from pydantic import BaseModel
from typing import Optional, Union, Any


class ClienteGClick(BaseModel):
    id: Union[str, float, int, Any]
    nome: str
    apelido: Optional[str] = ""
    cnpj: Optional[str] = "-"
    tipoInscricao: Optional[str] = "CNPJ"
    tipo: Optional[str] = "-"
    responsavel: Optional[str] = "-"
    email: Optional[str] = None
    telefone: Optional[str] = None
    status: Optional[str] = "ATIVO"


class TarefaGClick(BaseModel):
    id: Union[str, float, int, Any]
    categoria: Optional[str] = ""
    descricao: Optional[str] = ""
    cliente_nome: Optional[str] = ""
    cliente_id: Optional[Union[str, float, int, Any]] = None
    setor: Optional[str] = ""
    competencia: Optional[str] = ""
    vencimento: Optional[str] = ""
    status: Optional[str] = ""
    status_raw: Optional[str] = ""


class FiltroTarefasGClick(BaseModel):
    # Status
    # Códigos aceitos pela API G-Click: A=Aberto, S=Aguardando, C=Concluído,
    # F=Finalizado, O=Retificado, X=Cancelado, D=Dispensado, E=Retificando
    # "todos" = sem filtro de status (retorna qualquer status)
    status_codigo: Optional[str] = "A"          # Frontend envia o código direto após busca binária

    # Categoria
    categoria: Optional[str] = None             # Ex: "Obrigacao", "Cobranca"

    # Cliente
    cliente_id: Optional[str] = None

    # Setor — frontend faz busca binária e envia o ID numérico diretamente
    setor_id: Optional[int] = None              # ID do departamento no G-Click

    # Datas de vencimento
    data_ini: Optional[str] = None              # YYYY-MM-DD → dataVencimentoInicio
    data_fim: Optional[str] = None              # YYYY-MM-DD → dataVencimentoFim

    # Datas de competência (enviadas pelo frontend como YYYY-MM-DD)
    competencia_inicio: Optional[str] = None    # YYYY-MM-DD → dataCompetenciaInicio
    competencia_fim: Optional[str] = None       # YYYY-MM-DD → dataCompetenciaFim