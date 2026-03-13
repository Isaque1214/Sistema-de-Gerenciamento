import os
from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env.local")

class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL")
    sqlite_db_path: str = "/Users/isaqueba/Projeto/sistema_estrategico.db"

    gclick_client_id: str = os.getenv("GCLICK_CLIENT_ID")
    gclick_client_secret: str = os.getenv("GCLICK_CLIENT_SECRET")

    zappy_api_key: str = os.getenv("ZAPPY_API_KEY")
    zappy_base_url: str = "https://api-elogestaocontabil1.zapcontabil.chat"

    asaas_secret_1: str = os.getenv("ASAAS_SECRET_1")
    asaas_label_1: str = "Conta Principal"
    asaas_env_1: str = "production"

    asaas_secret_2: Optional[str] = os.getenv("ASAAS_SECRET_2")
    asaas_label_2: str = "Conta Secundária"
    asaas_env_2: str = "production"

    backend_secret: str = os.getenv("BACKEND_SECRET")
    sync_horario: str = "06:30"

    # Porta do backend — deve bater com o que o iniciar.sh/bat usa
    backend_port: int = 5050

    class Config:
        env_file = (".env.local", "../.env.local")
        case_sensitive = False
        extra = "ignore"

settings = Settings()