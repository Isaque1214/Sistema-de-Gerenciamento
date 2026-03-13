from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from models.gclick_models import ClienteGClick, TarefaGClick, FiltroTarefasGClick
from services import gclick_service

router = APIRouter(prefix="/api/gclick", tags=["G-Click"])


# ── Departamentos ──────────────────────────────────────────────────────────────
@router.get("/departamentos")
def listar_departamentos():
    resultado = gclick_service.buscar_departamentos()
    if isinstance(resultado, dict) and "error" in resultado:
        raise HTTPException(status_code=400, detail=resultado["error"])
    return resultado


# ── Clientes ───────────────────────────────────────────────────────────────────
@router.get("/clientes")
def listar_clientes(
    page: int = Query(0),
    size: int = Query(50),
    busca: Optional[str] = Query(None),
):
    resultado = gclick_service.buscar_clientes(page=page, size=size, busca=busca)
    if isinstance(resultado, dict) and "error" in resultado:
        raise HTTPException(status_code=400, detail=resultado["error"])
    return resultado


@router.get("/clientes/{cliente_id}")
def obter_cliente(cliente_id: str):
    resultado = gclick_service.buscar_cliente_por_id(cliente_id)
    if isinstance(resultado, dict) and "error" in resultado:
        raise HTTPException(status_code=404, detail=resultado["error"])
    return resultado


@router.post("/clientes")
def criar_cliente(dados: dict):
    resultado = gclick_service.criar_cliente(dados)
    if isinstance(resultado, dict) and "error" in resultado:
        raise HTTPException(status_code=400, detail=resultado["error"])
    return resultado


@router.put("/clientes/{cliente_id}")
def atualizar_cliente(cliente_id: str, dados: dict):
    resultado = gclick_service.atualizar_cliente(cliente_id, dados)
    if isinstance(resultado, dict) and "error" in resultado:
        raise HTTPException(status_code=400, detail=resultado["error"])
    return resultado


@router.delete("/clientes/{cliente_id}")
def deletar_cliente(cliente_id: str):
    resultado = gclick_service.deletar_cliente(cliente_id)
    if isinstance(resultado, dict) and "error" in resultado:
        raise HTTPException(status_code=400, detail=resultado["error"])
    return resultado


# ── Tarefas ────────────────────────────────────────────────────────────────────
@router.get("/tarefas", response_model=List[TarefaGClick])
def listar_tarefas(filtros: FiltroTarefasGClick = Depends()):
    """
    Lista tarefas com filtros. Parâmetros via query string:

    - status_codigo: código da API (A=Aberto, C=Concluído, F=Finalizado, etc.) | "todos" = sem filtro
    - categoria: Obrigacao | Cobranca | CertificadoDigital | Solicitacao | Agendamento
    - cliente_id: ID numérico do cliente no G-Click
    - setor_id: ID numérico do departamento (frontend resolve via busca binária no dicionário)
    - data_ini / data_fim: intervalo de vencimento YYYY-MM-DD
    - competencia_inicio / competencia_fim: intervalo de competência YYYY-MM-DD (gerado pelas listas suspensas mês/ano)
    """
    filtros_dict = filtros.dict(exclude_none=True)
    resultado = gclick_service.buscar_tarefas(filtros_dict)
    if isinstance(resultado, dict) and "error" in resultado:
        raise HTTPException(status_code=400, detail=resultado["error"])
    return resultado


@router.post("/tarefas")
def criar_tarefa(dados: dict):
    resultado = gclick_service.criar_tarefa(dados)
    if isinstance(resultado, dict) and "error" in resultado:
        raise HTTPException(status_code=400, detail=resultado["error"])
    return resultado


@router.put("/tarefas/{tarefa_id}/concluir")
def concluir_tarefa(tarefa_id: str):
    resultado = gclick_service.concluir_tarefa(tarefa_id)
    if isinstance(resultado, dict) and "error" in resultado:
        raise HTTPException(status_code=400, detail=resultado["error"])
    return resultado