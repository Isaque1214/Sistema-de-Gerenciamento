import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.scheduler import configurar_scheduler, scheduler
from routers import gclick_router, asaas_router, cron_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Servidor EloGestão iniciando...")
    configurar_scheduler()
    yield
    logger.info("Servidor EloGestão encerrando...")
    scheduler.shutdown(wait=False)


app = FastAPI(
    title="API EloGestão",
    description="Backend FastAPI — G-Click, Zappy e Asaas",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://192.168.0.17:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(gclick_router.router)
app.include_router(asaas_router.router)
app.include_router(cron_router.router)


@app.get("/", tags=["Status"])
def home():
    return {"status": "online", "mensagem": "API EloGestão funcionando. Acesse /docs"}


@app.get("/health", tags=["Status"])
def health():
    return {"status": "ok"}