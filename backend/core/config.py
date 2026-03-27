import os
from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env.local")

class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL")
    sqlite_db_path: str = os.getenv("SQLITE_DB_PATH", "sistema_estrategico.db")

    gclick_client_id: str = os.getenv("GCLICK_CLIENT_ID")
    gclick_client_secret: str = os.getenv("GCLICK_CLIENT_SECRET")

    zappy_api_key: str = os.getenv("ZAPPY_API_KEY")
    zappy_base_url: str = os.getenv("ZAPPY_BASE_URL", "")

    asaas_secret_1: str = os.getenv("ASAAS_SECRET_1")
    asaas_label_1: str = os.getenv("ASAAS_LABEL_1", "Conta Principal")
    asaas_env_1: str = os.getenv("ASAAS_ENV_1", "production")

    asaas_secret_2: Optional[str] = os.getenv("ASAAS_SECRET_2")
    asaas_label_2: str = os.getenv("ASAAS_LABEL_2", "Conta Secundária")
    asaas_env_2: str = os.getenv("ASAAS_ENV_2", "production")

    backend_secret: str = os.getenv("BACKEND_SECRET")
    sync_horario: str = os.getenv("SYNC_HORARIO", "06:30")

    # Porta do backend — deve bater com o que o iniciar.sh/bat usa
    backend_port: int = 5050

    class Config:
        env_file = (".env.local", "../.env.local")
        case_sensitive = False
        extra = "ignore"

settings = Settings()