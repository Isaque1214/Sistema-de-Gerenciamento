import aiosqlite
import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from core.config import settings

def _resolver_caminho_db() -> str:
    """
    Resolve o caminho absoluto do arquivo SQLite.
    O backend roda em backend/, então caminhos relativos partem daí.
    """
    caminho = settings.sqlite_db_path
    if not os.path.isabs(caminho):
        base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        caminho = os.path.normpath(os.path.join(base, caminho))
    return caminho

DB_PATH = _resolver_caminho_db()


@asynccontextmanager
async def get_db():
    """Context manager para conexões async com o SQLite."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        yield db


async def upsert_meta_gclick(
    obrigacao: str,
    valor_atual: float,
    meta_percentual: float = 100.0,
    prazo_dias: int = 30,
) -> None:
    """
    Insere ou atualiza uma linha na tabela MetasGclick.
    Se a obrigação já existir, atualiza apenas valor_atual e atualizado_em.
    """
    agora = datetime.now(timezone.utc).isoformat()
    async with get_db() as db:
        await db.execute(
            """
            INSERT INTO MetasGclick (obrigacao, meta_percentual, valor_atual, prazo_dias, atualizado_em)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(obrigacao) DO UPDATE SET
                valor_atual    = excluded.valor_atual,
                atualizado_em  = excluded.atualizado_em
            """,
            (obrigacao, meta_percentual, valor_atual, prazo_dias, agora),
        )
        await db.commit()


async def upsert_indicadores_zappy(
    mes_referencia: str,
    total_mensagens: int,
    total_colaboradores: int,
    mensagens_por_colaborador: float,
) -> None:
    """
    Insere ou atualiza os indicadores mensais do Zappy.
    A chave única é mes_referencia (ex: '2026-03').
    """
    agora = datetime.now(timezone.utc).isoformat()
    async with get_db() as db:
        await db.execute(
            """
            INSERT INTO IndicadoresZappy
                (mes_referencia, total_mensagens, total_colaboradores, mensagens_por_colaborador, atualizado_em)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(mes_referencia) DO UPDATE SET
                total_mensagens           = excluded.total_mensagens,
                total_colaboradores       = excluded.total_colaboradores,
                mensagens_por_colaborador = excluded.mensagens_por_colaborador,
                atualizado_em             = excluded.atualizado_em
            """,
            (mes_referencia, total_mensagens, total_colaboradores, mensagens_por_colaborador, agora),
        )
        await db.commit()


async def buscar_ultima_sincronizacao() -> dict:
    """Retorna o timestamp da última atualização registrada no banco."""
    async with get_db() as db:
        async with db.execute(
            "SELECT MAX(atualizado_em) as ultima FROM MetasGclick"
        ) as cursor:
            row = await cursor.fetchone()
            return {"ultima_sincronizacao": row["ultima"] if row else None}