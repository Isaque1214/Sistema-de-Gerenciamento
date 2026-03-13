from fastapi import APIRouter, HTTPException
from services import sincronizacao_service
from core.database import buscar_ultima_sincronizacao

router = APIRouter(prefix="/api/cron", tags=["Sincronização"])


@router.post("/sincronizar")
async def sincronizar_dados_externos():
    """
    Sincronização manual — chamada pelo botão no frontend.
    A sincronização automática é feita pelo APScheduler no horário do .env.local.
    """
    try:
        resultado = await sincronizacao_service.sincronizar_tudo()
        return {
            "success": True,
            "message": "Sincronização concluída com sucesso.",
            "timestamp": resultado.get("timestamp"),
            "erros": resultado.get("erros", {}),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Falha na sincronização: {str(e)}",
        )


@router.get("/status")
async def status_sincronizacao():
    """
    Retorna quando foi a última sincronização.
    O frontend usa para exibir 'Última atualização: HH:MM'.
    """
    try:
        return await buscar_ultima_sincronizacao()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))