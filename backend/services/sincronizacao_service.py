import asyncio
import logging
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone

from services.gclick_service import getDas, getContabil, getFolha
from services.zappy_service import obter_metricas_zappy
from core.database import upsert_meta_gclick, upsert_indicadores_zappy

logger = logging.getLogger("sincronizacao")

# 4 workers: um para cada busca externa (DAS, Contábil, Folha, Zappy)
_executor = ThreadPoolExecutor(max_workers=4)


async def sincronizar_tudo() -> dict:
    """
    Dispara as 4 buscas externas em PARALELO usando asyncio.gather().
    Tempo total = tempo da mais lenta, não a soma das 4.
    
    return_exceptions=True garante que uma falha (ex: Zappy offline)
    não cancela as outras 3 buscas.
    """
    loop = asyncio.get_event_loop()

    logger.info("Iniciando busca paralela: DAS, Contábil, Folha, Zappy...")

    das, contabil, folha, zappy = await asyncio.gather(
        loop.run_in_executor(_executor, getDas),
        loop.run_in_executor(_executor, getContabil),
        loop.run_in_executor(_executor, getFolha),
        loop.run_in_executor(_executor, obter_metricas_zappy),
        return_exceptions=True,
    )

    resultados = {
        "das": das if not isinstance(das, Exception) else {"error": str(das)},
        "contabil": contabil if not isinstance(contabil, Exception) else {"error": str(contabil)},
        "folha": folha if not isinstance(folha, Exception) else {"error": str(folha)},
        "zappy": zappy if not isinstance(zappy, Exception) else {"error": str(zappy)},
    }

    erros = {k: v["error"] for k, v in resultados.items() if isinstance(v, dict) and "error" in v}
    if erros:
        logger.warning(f"Falhas parciais na busca: {erros}")

    # Persiste no banco SQLite — esta era a parte que faltava
    await _salvar_no_banco(resultados)

    timestamp = datetime.now(timezone.utc).isoformat()
    logger.info(f"Sincronização concluída em {timestamp}. Erros: {erros or 'nenhum'}")

    return {
        "sucesso": True,
        "timestamp": timestamp,
        "erros": erros,
        "detalhes": resultados,
    }


async def _salvar_no_banco(resultados: dict) -> None:
    """
    Persiste os resultados nas tabelas MetasGclick e IndicadoresZappy.
    Erros de persistência são logados mas não interrompem o processo.
    """
    # Salva as 3 obrigações G-Click
    mapeamento_gclick = {
        "das": "Simples Nacional",
        "contabil": "Fechamento Contábil",
        "folha": "Fechamento Folha",
    }

    for chave, nome_obrigacao in mapeamento_gclick.items():
        dados = resultados.get(chave)
        if not isinstance(dados, dict) or "error" in dados:
            continue

        concluidas = dados.get("Concluidas", 0)
        faltantes = dados.get("Faltantes", 0)
        total = concluidas + faltantes
        percentual = round((concluidas / total) * 100, 1) if total > 0 else 0.0

        try:
            await upsert_meta_gclick(
                obrigacao=nome_obrigacao,
                valor_atual=percentual,
                meta_percentual=100.0,
                prazo_dias=30,
            )
            logger.info(f"G-Click [{nome_obrigacao}] salvo: {percentual}% ({concluidas}/{total})")
        except Exception as e:
            logger.error(f"Erro ao salvar MetasGclick [{nome_obrigacao}]: {e}")

    # Salva as métricas do Zappy
    zappy = resultados.get("zappy")
    if isinstance(zappy, dict) and "error" not in zappy:
        mes_referencia = datetime.now(timezone.utc).strftime("%Y-%m")
        try:
            await upsert_indicadores_zappy(
                mes_referencia=mes_referencia,
                total_mensagens=zappy.get("Total_Absoluto", 0),
                total_colaboradores=zappy.get("Colaboradores", 0),
                mensagens_por_colaborador=float(zappy.get("Mensagens_Por_Colaborador", 0.0)),
            )
            logger.info(f"Zappy [{mes_referencia}] salvo: {zappy.get('Total_Absoluto', 0)} mensagens")
        except Exception as e:
            logger.error(f"Erro ao salvar IndicadoresZappy: {e}")