import time
import math
from datetime import datetime, timedelta
from core.config import settings
from core.http_client import http_client

_token_cache = None
_token_expiry = 0

# ── Token ──────────────────────────────────────────────────────────────────────
def get_valid_token():
    global _token_cache, _token_expiry
    agora = time.time()
    if _token_cache and agora < _token_expiry:
        return _token_cache
    if not settings.gclick_client_id or not settings.gclick_client_secret:
        return {"error": "Credenciais do G-Click não encontradas no .env"}
    url_token = "https://api.gclick.com.br/oauth/token"
    payload = f"client_id={settings.gclick_client_id}&client_secret={settings.gclick_client_secret}&grant_type=client_credentials"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    try:
        response = http_client.post(url_token, headers=headers, data=payload, timeout=10)
        response.raise_for_status()
        resposta = response.json()
        _token_cache = resposta.get("access_token")
        _token_expiry = agora + resposta.get("expires_in", 3600) - 60
        return _token_cache
    except Exception as e:
        return {"error": f"Falha ao obter token: {str(e)}"}


def _headers():
    tk = get_valid_token()
    if isinstance(tk, dict):
        return tk
    return {"Authorization": f"Bearer {tk}", "Content-Type": "application/json"}


# ── Departamentos ──────────────────────────────────────────────────────────────
def buscar_departamentos():
    h = _headers()
    if isinstance(h, dict) and "error" in h:
        return h
    try:
        res = http_client.get("https://api.gclick.com.br/departamentos", headers=h, params={"size": 100}, timeout=15)
        res.raise_for_status()
        return [{"id": d.get("id"), "nome": d.get("nome", "Sem nome")} for d in res.json().get("content", [])]
    except Exception as e:
        return {"error": f"Falha ao buscar departamentos: {str(e)}"}


# ── Clientes ───────────────────────────────────────────────────────────────────
def buscar_clientes(page: int = 0, size: int = 50, busca: str = None):
    h = _headers()
    if isinstance(h, dict) and "error" in h:
        return h
    params = {"page": page, "size": size}
    if busca:
        params["nome"] = busca
    try:
        res = http_client.get("https://api.gclick.com.br/clientes", headers=h, params=params, timeout=15)
        res.raise_for_status()
        raw = res.json()
        content = raw.get("content", [])
        total_elements = raw.get("totalElements", len(content))
        total_pages = raw.get("totalPages", math.ceil(total_elements / size) if size > 0 else 1)

        clientes = []
        for c in content:
            resp_obj = c.get("responsavel", {})
            nome_resp = resp_obj.get("nome", "-") if isinstance(resp_obj, dict) else "-"
            tel_raw = c.get("telefone") or c.get("celular") or ""
            if isinstance(tel_raw, list):
                tel_raw = tel_raw[0] if tel_raw else ""
            clientes.append({
                "id":            c.get("id"),
                "nome":          c.get("nome", "Sem Nome"),
                "apelido":       c.get("apelido") or "",
                "cnpj":          c.get("cnpj") or c.get("cpf") or "-",
                "tipoInscricao": c.get("tipoInscricao") or "CNPJ",
                "tipo":          c.get("tipo") or "-",
                "responsavel":   nome_resp,
                "email":         c.get("email") or "",
                "telefone":      tel_raw,
                "status":        c.get("status") or "ATIVO",
            })
        return {"clientes": clientes, "total": total_elements, "totalPages": total_pages, "page": page}
    except Exception as e:
        return {"error": f"Falha ao buscar clientes: {str(e)}"}


def buscar_cliente_por_id(cliente_id: str):
    h = _headers()
    if isinstance(h, dict) and "error" in h:
        return h
    try:
        res = http_client.get(f"https://api.gclick.com.br/clientes/{cliente_id}", headers=h, timeout=15)
        res.raise_for_status()
        c = res.json()
        resp_obj = c.get("responsavel", {})
        nome_resp = resp_obj.get("nome", "-") if isinstance(resp_obj, dict) else "-"
        end_obj = c.get("endereco", {}) or {}
        return {
            "id":            c.get("id"),
            "nome":          c.get("nome", ""),
            "apelido":       c.get("apelido") or "",
            "cnpj":          c.get("cnpj") or c.get("cpf") or "",
            "tipoInscricao": c.get("tipoInscricao") or "CNPJ",
            "tipo":          c.get("tipo") or "",
            "responsavel":   nome_resp,
            "email":         c.get("email") or "",
            "telefone":      c.get("telefone") or c.get("celular") or "",
            "status":        c.get("status") or "ATIVO",
            "endereco": {
                "rua":    end_obj.get("logradouro") or "",
                "numero": end_obj.get("numero") or "",
                "bairro": end_obj.get("bairro") or "",
                "cidade": end_obj.get("municipio") or "",
                "estado": end_obj.get("uf") or "",
            },
        }
    except Exception as e:
        return {"error": f"Cliente não encontrado: {str(e)}"}


def criar_cliente(dados: dict):
    h = _headers()
    if isinstance(h, dict) and "error" in h:
        return h
    payload = {
        "nome":          dados.get("nome"),
        "apelido":       dados.get("apelido", ""),
        "cnpj":          dados.get("inscricao"),
        "tipoInscricao": dados.get("tipoInscricao", "CNPJ"),
        "tipo":          dados.get("tipo", "FIXO"),
        "email":         dados.get("email", ""),
        "telefone":      dados.get("telefone", ""),
    }
    try:
        res = http_client.post("https://api.gclick.com.br/clientes", headers=h, json=payload, timeout=15)
        res.raise_for_status()
        return res.json()
    except Exception as e:
        return {"error": f"Falha ao criar cliente: {str(e)}"}


def atualizar_cliente(cliente_id: str, dados: dict):
    h = _headers()
    if isinstance(h, dict) and "error" in h:
        return h
    payload = {
        "nome":          dados.get("nome"),
        "apelido":       dados.get("apelido", ""),
        "cnpj":          dados.get("inscricao"),
        "tipoInscricao": dados.get("tipoInscricao", "CNPJ"),
        "tipo":          dados.get("tipo", "FIXO"),
        "email":         dados.get("email", ""),
        "telefone":      dados.get("telefone", ""),
    }
    try:
        res = http_client.put(f"https://api.gclick.com.br/clientes/{cliente_id}", headers=h, json=payload, timeout=15)
        res.raise_for_status()
        return res.json()
    except Exception as e:
        return {"error": f"Falha ao atualizar cliente: {str(e)}"}


def deletar_cliente(cliente_id: str):
    h = _headers()
    if isinstance(h, dict) and "error" in h:
        return h
    try:
        res = http_client.delete(f"https://api.gclick.com.br/clientes/{cliente_id}", headers=h, timeout=15)
        res.raise_for_status()
        return {"ok": True}
    except Exception as e:
        return {"error": f"Falha ao deletar cliente: {str(e)}"}


# ── Tarefas ────────────────────────────────────────────────────────────────────
def buscar_tarefas(filtros: dict):
    h = _headers()
    if isinstance(h, dict) and "error" in h:
        return h

    params = {"size": 200}

    # ── Status ─────────────────────────────────────────────────────────────────
    # Frontend envia "status_codigo" com o código exato da API (A, C, F...) após busca binária
    # "todos" = sem filtro → retorna qualquer status
    status_codigo = filtros.get("status_codigo", "A")
    if status_codigo and status_codigo.lower() != "todos":
        params["status"] = status_codigo

    # ── Categoria ──────────────────────────────────────────────────────────────
    categoria = filtros.get("categoria", "")
    if categoria and categoria.lower() not in ("todos", ""):
        params["categoria"] = categoria

    # ── Cliente ────────────────────────────────────────────────────────────────
    cliente_id = filtros.get("cliente_id", "")
    if cliente_id and str(cliente_id).lower() not in ("todos", ""):
        params["clienteId"] = cliente_id

    # ── Setor ──────────────────────────────────────────────────────────────────
    # Frontend faz busca binária no dicionário e envia o ID numérico diretamente
    # A API G-Click aceita "departamentosIds" como número inteiro
    setor_id = filtros.get("setor_id")
    if setor_id is not None:
        params["departamentosIds"] = int(setor_id)

    # ── Datas de Vencimento ────────────────────────────────────────────────────
    if filtros.get("data_ini"):
        params["dataVencimentoInicio"] = filtros["data_ini"]
    if filtros.get("data_fim"):
        params["dataVencimentoFim"] = filtros["data_fim"]

    # ── Datas de Competência ───────────────────────────────────────────────────
    # Frontend usa competencia_inicio / competencia_fim (YYYY-MM-DD) geradas
    # a partir das listas suspensas de mês e ano
    if filtros.get("competencia_inicio"):
        params["dataCompetenciaInicio"] = filtros["competencia_inicio"]
    if filtros.get("competencia_fim"):
        params["dataCompetenciaFim"] = filtros["competencia_fim"]

    try:
        res = http_client.get("https://api.gclick.com.br/tarefas", headers=h, params=params, timeout=15)
        res.raise_for_status()

        status_map = {
            "A": "Aberto", "S": "Aguardando", "C": "Concluído",
            "F": "Finalizado", "O": "Retificado", "X": "Cancelado",
            "D": "Dispensado", "E": "Retificando",
        }

        formatadas = []
        for t in res.json().get("content", []):
            cliente = t.get("cliente", {})
            nome_cli = cliente.get("nome", "Cliente Indefinido") if isinstance(cliente, dict) else str(cliente)
            depto    = t.get("departamento", {})
            nome_dep = depto.get("nome", "Geral") if isinstance(depto, dict) else str(depto)
            status_raw = t.get("status", "A")

            formatadas.append({
                "id":           t.get("id"),
                "categoria":    t.get("categoria", ""),
                "descricao":    t.get("nome", ""),
                "cliente_nome": nome_cli,
                "cliente_id":   cliente.get("id") if isinstance(cliente, dict) else 0,
                "setor":        nome_dep,
                "competencia":  t.get("dataCompetencia", ""),
                "vencimento":   t.get("dataVencimento", ""),
                "status":       status_map.get(status_raw, status_raw),
                "status_raw":   status_raw,
            })
        return formatadas
    except Exception as e:
        return {"error": f"Falha ao buscar tarefas: {str(e)}"}


def criar_tarefa(dados: dict):
    h = _headers()
    if isinstance(h, dict) and "error" in h:
        return h
    payload = {
        "categoria":      dados.get("categoria"),
        "nome":           dados.get("descricao"),
        "cliente":        {"id": int(dados.get("cliente_id"))},
        "dataVencimento": dados.get("vencimento"),
    }
    try:
        res = http_client.post("https://api.gclick.com.br/tarefas", headers=h, json=payload, timeout=15)
        res.raise_for_status()
        return res.json()
    except Exception as e:
        return {"error": f"Falha ao criar tarefa: {str(e)}"}


def concluir_tarefa(tarefa_id: str):
    h = _headers()
    if isinstance(h, dict) and "error" in h:
        return h
    try:
        res = http_client.put(
            f"https://api.gclick.com.br/tarefas/{tarefa_id}/status",
            headers=h, json={"status": "C"}, timeout=15,
        )
        res.raise_for_status()
        return {"ok": True}
    except Exception as e:
        return {"error": f"Falha ao concluir tarefa: {str(e)}"}


# ── Funções do cron (sincronização diária) ────────────────────────────────────
def obter_datas_competencia():
    hoje = datetime.now()
    primeiro_dia = hoje.replace(day=1)
    ultimo_dia_anterior = primeiro_dia - timedelta(days=1)
    primeiro_dia_anterior = ultimo_dia_anterior.replace(day=1)
    return primeiro_dia_anterior.strftime("%Y-%m-%d"), ultimo_dia_anterior.strftime("%Y-%m-%d")


def buscar_tarefas_por_obrigacao(nome_obrigacao: str, depto_id: int):
    h = _headers()
    if isinstance(h, dict) and "error" in h:
        return {"Obrigacao": nome_obrigacao, "Concluidas": 0, "Faltantes": 0, "Total": 0}
    data_ini, data_fim = obter_datas_competencia()
    page = 0
    concluidos = 0
    faltantes  = 0
    while True:
        params = {
            "page": page, "size": 50, "departamentosIds": depto_id,
            "nome": nome_obrigacao, "dataCompetenciaInicio": data_ini, "dataCompetenciaFim": data_fim,
        }
        try:
            res = http_client.get("https://api.gclick.com.br/tarefas", headers=h, params=params, timeout=15)
            res.raise_for_status()
            lista = res.json().get("content", [])
            if not lista:
                break
            for t in lista:
                if t.get("status") in ["C", "O", "F"]:
                    concluidos += 1
                else:
                    faltantes += 1
            page += 1
        except Exception:
            break
    return {"Obrigacao": nome_obrigacao, "Concluidas": concluidos, "Faltantes": faltantes, "Total": concluidos + faltantes}


def getDas():      return buscar_tarefas_por_obrigacao("DAS SIMPLES", 2)
def getContabil(): return buscar_tarefas_por_obrigacao("Fechamento Contábil", 1)
def getFolha():    return buscar_tarefas_por_obrigacao("Fechamento Folha", 3)