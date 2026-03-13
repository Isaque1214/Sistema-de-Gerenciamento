import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from core.config import settings

logger = logging.getLogger("scheduler")

# Instância global — iniciada no lifespan do main.py
scheduler = AsyncIOScheduler(timezone="America/Sao_Paulo")


def configurar_scheduler() -> None:
    """
    Registra o job de sincronização diária e inicia o scheduler.
    Chamado uma única vez no startup do FastAPI (via lifespan).
    """
    from services.sincronizacao_service import sincronizar_tudo

    hora, minuto = settings.sync_horario.split(":")

    scheduler.add_job(
        func=_executar_sincronizacao,
        trigger=CronTrigger(hour=int(hora), minute=int(minuto)),
        id="sincronizacao_diaria",
        name=f"Sincronização diária G-Click + Zappy ({settings.sync_horario})",
        replace_existing=True,
        # Se o PC estiver dormindo e perder o horário,
        # executa assim que voltar (tolerância de 5 minutos)
        misfire_grace_time=300,
    )

    scheduler.start()
    logger.info(
        f"Scheduler iniciado. Sincronização automática todo dia às "
        f"{settings.sync_horario} (America/Sao_Paulo)."
    )


async def _executar_sincronizacao() -> None:
    """Wrapper que o scheduler chama no horário configurado."""
    from services.sincronizacao_service import sincronizar_tudo

    logger.info("Sincronização automática iniciada pelo scheduler...")
    try:
        resultado = await sincronizar_tudo()
        erros = resultado.get("erros", {})
        if erros:
            logger.warning(f"Sincronização concluída com falhas parciais: {erros}")
        else:
            logger.info("Sincronização automática concluída com sucesso.")
    except Exception as e:
        logger.error(f"Erro crítico na sincronização automática: {e}", exc_info=True)