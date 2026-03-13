import logging
import requests
import calendar
from datetime import datetime
from core.config import settings

logger = logging.getLogger("zappy_service")


def _headers():
    return {
        "Authorization": f"Bearer {settings.zappy_api_key}",
        "Content-Type": "application/json",
        "accept": "application/json",
    }


def obter_metricas_zappy() -> dict:
    if not settings.zappy_api_key:
        logger.warning("Chave do Júpiter não configurada.")
        return _resposta_vazia("Chave não configurada.")

    base = settings.zappy_base_url.rstrip("/")

    hoje = datetime.now()
    primeiro_dia = hoje.replace(day=1).strftime("%Y-%m-%d")
    ultimo_dia_num = calendar.monthrange(hoje.year, hoje.month)[1]
    ultimo_dia = hoje.replace(day=ultimo_dia_num).strftime("%Y-%m-%d")

    try:
        res_messages = requests.get(
            f"{base}/api/metrics/messages",
            headers=_headers(),
            params={"dateFrom": primeiro_dia, "dateTo": ultimo_dia},
            timeout=10,
        )

        if res_messages.status_code == 401:
            logger.error("Júpiter: chave inválida.")
            return _resposta_vazia("Chave inválida — verifique ZAPPY_API_KEY.")

        res_messages.raise_for_status()
        dados_messages = res_messages.json()

        res_users = requests.get(
            f"{base}/api/users",
            headers=_headers(),
            timeout=10,
        )
        res_users.raise_for_status()
        dados_users = res_users.json()

        logger.info(f"Júpiter métricas: {dados_messages}")

        total_geral = dados_messages.get("messages", {}).get("total", 0)
        # +1 conforme lógica do teste validado
        total_users = dados_users.get("count", 0) + 1
        mensagens_por_colaborador = round(total_geral / total_users, 2) if total_users > 0 else 0.0

        avg = dados_messages.get("avgResponseTime", {})
        first_response = round(avg.get("firstResponseTime", 0) / 1000, 1)

        return {
            "Total_Absoluto": total_geral,
            "Colaboradores": total_users,
            "Mensagens_Por_Colaborador": mensagens_por_colaborador,
            "Tempo_Primeira_Resposta_seg": first_response,
        }

    except Exception as e:
        logger.error(f"Erro ao chamar Júpiter: {e}")
        return _resposta_vazia(str(e))


def _resposta_vazia(motivo: str) -> dict:
    return {
        "Total_Absoluto": 0,
        "Colaboradores": 0,
        "Mensagens_Por_Colaborador": 0.0,
        "Tempo_Primeira_Resposta_seg": 0.0,
        "error": motivo,
    }