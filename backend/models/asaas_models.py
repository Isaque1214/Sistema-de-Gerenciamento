from pydantic import BaseModel
from typing import List, Optional


class ResumoFinanceiro(BaseModel):
    total_notas_emitidas: Optional[float] = 0
    qtd_notas_emitidas: Optional[int] = 0
    total_recebido: float
    total_recebido_bruto: Optional[float] = 0
    qtd_recebido: Optional[int] = 0
    total_vencido: Optional[float] = 0
    qtd_vencido: Optional[int] = 0
    total_faturado: Optional[float] = 0


class CobrancaDetalhe(BaseModel):
    id: str
    vencimento: str
    valor: float
    link: str
    status: Optional[str] = None


class CobrancaAsaas(BaseModel):
    id: Optional[str] = None
    cliente: Optional[str] = None
    vencimento: Optional[str] = None
    valor: Optional[float] = 0
    valor_liquido: Optional[float] = 0
    status: Optional[str] = None
    link: Optional[str] = None
    descricao: Optional[str] = None
    tipo: Optional[str] = None
    data_pagamento: Optional[str] = None


class ClienteAsaas(BaseModel):
    id: str
    nome: Optional[str] = None
    email: Optional[str] = None
    cpfCnpj: Optional[str] = None
    telefone: Optional[str] = None


class CriarCobrancaInput(BaseModel):
    customer: str
    billingType: str = "UNDEFINED"
    value: float
    dueDate: str
    description: Optional[str] = None


class AtualizarCobrancaInput(BaseModel):
    billingType: Optional[str] = None
    value: Optional[float] = None
    dueDate: Optional[str] = None
    description: Optional[str] = None


class ChavePixInput(BaseModel):
    apelido: str       # Ex: "Fornecedor TI"
    chave: str         # Ex: "11999998888" ou "email@email.com"
    tipo: str          # CPF | CNPJ | EMAIL | PHONE | EVP


class TransferenciaPixInput(BaseModel):
    chave: str
    tipo: str          # CPF | CNPJ | EMAIL | PHONE | EVP
    valor: float
    descricao: Optional[str] = None


class Inadimplente(BaseModel):
    id: str
    nome: str
    total_valor: float
    qtd: int
    cobrancas: List[CobrancaDetalhe]