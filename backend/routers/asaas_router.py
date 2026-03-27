import sqlite3
import os

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import date
from models.asaas_models import (
    ResumoFinanceiro, CobrancaAsaas, ClienteAsaas,
    Inadimplente, CriarCobrancaInput, AtualizarCobrancaInput,
    TransferenciaPixInput, ChavePixInput,
)
from services import asaas_service


DB_PATH = os.getenv("SQLITE_DB_PATH", "sistema_estrategico.db")

router = APIRouter(prefix="/api/financeiro", tags=["Financeiro (Asaas)"])

def _get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def _defaults_mes():
    hoje = date.today()
    return hoje.replace(day=1).isoformat(), hoje.isoformat()


# ── Resumo ────────────────────────────────────────────────────────────────────
@router.get("/resumo", response_model=ResumoFinanceiro)
def obter_resumo(
    inicio: Optional[str] = Query(None),
    fim: Optional[str] = Query(None),
    conta: int = Query(1, description="1 = Elo Gestão Contábil | 2 = Elo Gestão Empresarial"),
):
    ini, f = _defaults_mes()
    resultado = asaas_service.resumo_financeiro(inicio or ini, fim or f, conta)
    if "error" in resultado:
        raise HTTPException(status_code=400, detail=resultado["error"])
    return resultado


# ── Saldo ─────────────────────────────────────────────────────────────────────
@router.get("/saldo")
def obter_saldo(
    conta: int = Query(1, description="1 = Elo Gestão Contábil | 2 = Elo Gestão Empresarial"),
):
    """Retorna o saldo disponível na conta Asaas em tempo real."""
    resultado = asaas_service.buscar_saldo(conta)
    if "error" in resultado:
        raise HTTPException(status_code=400, detail=resultado["error"])
    return resultado


# ── Cobranças ─────────────────────────────────────────────────────────────────
@router.get("/cobrancas", response_model=List[CobrancaAsaas])
def listar_cobrancas(
    inicio: Optional[str] = Query(None),
    fim: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    conta: int = Query(1),
):
    ini, f = _defaults_mes()
    resultado = asaas_service.listar_cobrancas(inicio or ini, fim or f, conta, status)
    if isinstance(resultado, dict) and "error" in resultado:
        raise HTTPException(status_code=400, detail=resultado["error"])
    return resultado


@router.post("/cobrancas")
def criar_cobranca(dados: CriarCobrancaInput, conta: int = Query(1)):
    resultado = asaas_service.criar_cobranca(dados.dict(), conta)
    if "error" in resultado:
        raise HTTPException(status_code=400, detail=resultado["error"])
    return resultado


@router.put("/cobrancas/{id_cobranca}")
def atualizar_cobranca(
    id_cobranca: str,
    dados: AtualizarCobrancaInput,
    conta: int = Query(1),
):
    resultado = asaas_service.atualizar_cobranca(
        id_cobranca, dados.dict(exclude_none=True), conta
    )
    if "error" in resultado:
        raise HTTPException(status_code=400, detail=resultado["error"])
    return resultado


# ── Clientes ──────────────────────────────────────────────────────────────────
@router.get("/clientes", response_model=List[ClienteAsaas])
def listar_clientes(conta: int = Query(1)):
    resultado = asaas_service.listar_clientes(conta)
    if isinstance(resultado, dict) and "error" in resultado:
        raise HTTPException(status_code=400, detail=resultado["error"])
    return resultado


# ── Inadimplentes ─────────────────────────────────────────────────────────────
@router.get("/inadimplentes", response_model=List[Inadimplente])
def listar_inadimplentes(conta: int = Query(1)):
    resultado = asaas_service.buscar_inadimplentes(conta)
    if isinstance(resultado, dict) and "error" in resultado:
        raise HTTPException(status_code=400, detail=resultado["error"])
    return resultado


# ── Chaves Pix salvas ─────────────────────────────────────────────────────────
@router.get("/pix/chaves")
def listar_chaves_pix():
    with _get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM ChavePix ORDER BY criado_em DESC"
        ).fetchall()
    return [dict(r) for r in rows]


@router.post("/pix/chaves")
def salvar_chave_pix(dados: ChavePixInput):
    with _get_db() as conn:
        cur = conn.execute(
            "INSERT INTO ChavePix (apelido, chave, tipo, criado_em) VALUES (?, ?, ?, datetime('now')) RETURNING *",
            (dados.apelido, dados.chave, dados.tipo),
        )
        nova = dict(cur.fetchone())
    return nova


@router.delete("/pix/chaves/{id_chave}")
def deletar_chave_pix(id_chave: int):
    with _get_db() as conn:
        conn.execute("DELETE FROM ChavePix WHERE id = ?", (id_chave,))
    return {"ok": True}


# ── Transferência Pix ─────────────────────────────────────────────────────────
@router.post("/pix/transferir")
def transferir_pix(
    dados: TransferenciaPixInput,
    conta: int = Query(1, description="1 = Elo Gestão Contábil | 2 = Elo Gestão Empresarial"),
):
    """Realiza uma transferência Pix para uma chave cadastrada."""
    resultado = asaas_service.realizar_transferencia(
        chave=dados.chave,
        tipo=dados.tipo,
        valor=dados.valor,
        descricao=dados.descricao or "",
        conta=conta,
    )
    if "error" in resultado:
        raise HTTPException(status_code=400, detail=resultado["error"])
    return resultado