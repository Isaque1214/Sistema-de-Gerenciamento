import requests
import logging
from core.config import settings

logger = logging.getLogger("asaas_service")


def _obter_configuracao_conta(conta: int):
    if conta == 2:
        secret = settings.asaas_secret_2
        env = settings.asaas_env_2
    else:
        secret = settings.asaas_secret_1
        env = settings.asaas_env_1

    if not secret:
        return None, None

    url_base = (
        "https://sandbox.asaas.com/api/v3"
        if env == "sandbox"
        else "https://api.asaas.com/v3"
    )
    headers = {
        "access_token": secret,
        "Content-Type": "application/json",
    }
    return url_base, headers


def _buscar_todas_paginas(url: str, headers: dict, params: dict) -> list:
    todos = []
    offset = 0
    limit = 100
    while True:
        p = {**params, "limit": limit, "offset": offset}
        try:
            res = requests.get(url, headers=headers, params=p, timeout=15)
            res.raise_for_status()
            dados = res.json()
            pagina = dados.get("data", [])
            todos.extend(pagina)
            if not dados.get("hasMore", False):
                break
            offset += limit
        except Exception as e:
            logger.error(f"Erro paginação Asaas ({url}): {e}")
            break
    return todos


def resumo_financeiro(inicio: str, fim: str, conta: int = 1):
    url_base, headers = _obter_configuracao_conta(conta)
    if not url_base:
        return {"error": f"Credenciais da conta {conta} não configuradas."}

    try:
        # Notas fiscais emitidas — effectiveDate em minúsculo (ge/le)
        notas = _buscar_todas_paginas(
            f"{url_base}/invoices", headers,
            {"status": "AUTHORIZED", "effectiveDate[ge]": inicio, "effectiveDate[le]": fim},
        )
        total_notas = round(sum(float(n.get("value", 0)) for n in notas), 2)
        logger.info(f"Asaas notas ({inicio}→{fim}): {len(notas)} = R${total_notas}")

        # Recebimentos — paymentDate, paginação manual (estatísticas não suporta paymentDate)
        recebidos = _buscar_todas_paginas(
            f"{url_base}/payments", headers,
            {"status": "RECEIVED", "paymentDate[ge]": inicio, "paymentDate[le]": fim},
        )
        total_recebido = round(sum(float(p.get("netValue") or p.get("value", 0)) for p in recebidos), 2)
        total_recebido_bruto = round(sum(float(p.get("value", 0)) for p in recebidos), 2)
        logger.info(f"Asaas recebidos ({inicio}→{fim}): {len(recebidos)} = R${total_recebido} líq.")

        # Vencidos — estatísticas suporta dueDate
        res_v = requests.get(
            f"{url_base}/finance/payment/statistics", headers=headers,
            params={"status": "OVERDUE", "dueDate[ge]": inicio, "dueDate[le]": fim}, timeout=15,
        )
        res_v.raise_for_status()
        stats_v = res_v.json()

        return {
            "total_notas_emitidas": total_notas,
            "qtd_notas_emitidas": len(notas),
            "total_recebido": total_recebido,
            "total_recebido_bruto": total_recebido_bruto,
            "qtd_recebido": len(recebidos),
            "total_vencido": round(float(stats_v.get("value", 0)), 2),
            "qtd_vencido": int(stats_v.get("totalCount", 0)),
            "total_faturado": total_notas,
        }
    except Exception as e:
        logger.error(f"Erro resumo Asaas: {e}")
        return {"error": str(e)}


def listar_cobrancas(inicio: str, fim: str, conta: int = 1, status: str = None):
    url_base, headers = _obter_configuracao_conta(conta)
    if not url_base:
        return {"error": f"Credenciais da conta {conta} não configuradas."}

    params = {"dueDate[ge]": inicio, "dueDate[le]": fim}
    if status:
        params["status"] = status

    try:
        cobrancas = _buscar_todas_paginas(f"{url_base}/payments", headers, params)
        STATUS_EXCLUIR = {"DELETED"}
        return [
            {
                "id": c.get("id"),
                "cliente": c.get("customer"),
                "vencimento": c.get("dueDate"),
                "valor": float(c.get("value", 0)),
                "valor_liquido": float(c.get("netValue") or 0),
                "status": c.get("status"),
                "link": c.get("invoiceUrl"),
                "descricao": c.get("description", ""),
                "tipo": c.get("billingType", ""),
                "data_pagamento": c.get("paymentDate"),
            }
            for c in cobrancas
            if c.get("status") not in STATUS_EXCLUIR
        ]
    except Exception as e:
        return {"error": str(e)}


def criar_cobranca(dados: dict, conta: int = 1):
    url_base, headers = _obter_configuracao_conta(conta)
    if not url_base:
        return {"error": f"Credenciais da conta {conta} não configuradas."}

    payload = {
        "customer": dados["customer"],
        "billingType": dados.get("billingType", "UNDEFINED"),
        "value": float(dados["value"]),
        "dueDate": dados["dueDate"],
    }
    if dados.get("description"):
        payload["description"] = dados["description"]

    try:
        res = requests.post(f"{url_base}/payments", headers=headers, json=payload, timeout=15)
        res.raise_for_status()
        return res.json()
    except requests.HTTPError as e:
        erro = e.response.json() if e.response else {"error": str(e)}
        erros = erro.get("errors", [])
        msg = erros[0].get("description", str(erro)) if erros else str(erro)
        return {"error": msg}
    except Exception as e:
        return {"error": str(e)}


def atualizar_cobranca(id_cobranca: str, dados: dict, conta: int = 1):
    url_base, headers = _obter_configuracao_conta(conta)
    if not url_base:
        return {"error": f"Credenciais da conta {conta} não configuradas."}

    # Só envia campos preenchidos — PUT requer billingType, value e dueDate obrigatórios
    payload = {}
    if dados.get("billingType"):
        payload["billingType"] = dados["billingType"]
    if dados.get("value"):
        payload["value"] = float(dados["value"])
    if dados.get("dueDate"):
        payload["dueDate"] = dados["dueDate"]
    if dados.get("description") is not None:
        payload["description"] = dados["description"]

    if not payload:
        return {"error": "Nenhum campo para atualizar."}

    try:
        res = requests.put(
            f"{url_base}/payments/{id_cobranca}",
            headers=headers, json=payload, timeout=15,
        )
        res.raise_for_status()
        return res.json()
    except requests.HTTPError as e:
        erro = e.response.json() if e.response else {"error": str(e)}
        erros = erro.get("errors", [])
        msg = erros[0].get("description", str(erro)) if erros else str(erro)
        return {"error": msg}
    except Exception as e:
        return {"error": str(e)}


def listar_clientes(conta: int = 1):
    url_base, headers = _obter_configuracao_conta(conta)
    if not url_base:
        return {"error": f"Credenciais da conta {conta} não configuradas."}
    try:
        clientes = _buscar_todas_paginas(f"{url_base}/customers", headers, {})
        return [
            {"id": c.get("id"), "nome": c.get("name", ""), "email": c.get("email", ""),
             "cpfCnpj": c.get("cpfCnpj", ""), "telefone": c.get("mobilePhone", "")}
            for c in clientes
        ]
    except Exception as e:
        return {"error": str(e)}


def buscar_inadimplentes(conta: int = 1):
    url_base, headers = _obter_configuracao_conta(conta)
    if not url_base:
        return {"error": f"Credenciais da conta {conta} não configuradas."}
    try:
        cobrancas = _buscar_todas_paginas(
            f"{url_base}/payments", headers, {"status": "OVERDUE"},
        )
        agrupado = {}
        for cob in cobrancas:
            cli_id = cob.get("customer")
            if cli_id not in agrupado:
                agrupado[cli_id] = {"id": cli_id, "nome": "...", "total_valor": 0.0, "qtd": 0, "cobrancas": []}
            agrupado[cli_id]["total_valor"] += float(cob.get("value", 0))
            agrupado[cli_id]["qtd"] += 1
            agrupado[cli_id]["cobrancas"].append({
                "id": cob.get("id"), "vencimento": cob.get("dueDate"),
                "valor": float(cob.get("value", 0)), "link": cob.get("invoiceUrl") or "",
            })
        resultado = list(agrupado.values())
        for cliente in resultado:
            try:
                r = requests.get(f"{url_base}/customers/{cliente['id']}", headers=headers, timeout=10)
                if r.status_code == 200:
                    cliente["nome"] = r.json().get("name", "Desconhecido")
            except Exception:
                pass
        resultado.sort(key=lambda x: x["total_valor"], reverse=True)
        return resultado
    except Exception as e:
        return {"error": str(e)}

def buscar_saldo(conta: int = 1):
    url_base, headers = _obter_configuracao_conta(conta)
    if not url_base:
        return {"error": f"Credenciais da conta {conta} não configuradas."}
    try:
        res = requests.get(f"{url_base}/finance/balance", headers=headers, timeout=10)
        res.raise_for_status()
        return res.json()  # { "balance": 1234.56 }
    except Exception as e:
        return {"error": str(e)}


def realizar_transferencia(chave: str, tipo: str, valor: float, descricao: str, conta: int = 1):
    url_base, headers = _obter_configuracao_conta(conta)
    if not url_base:
        return {"error": f"Credenciais da conta {conta} não configuradas."}
    try:
        payload = {
            "operationType": "PIX",
            "pixAddressKey": chave,
            "pixAddressKeyType": tipo,
            "value": valor,
        }
        if descricao:
            payload["description"] = descricao
        res = requests.post(
            f"{url_base}/transfers",
            headers=headers, json=payload, timeout=15,
        )
        res.raise_for_status()
        return res.json()
    except requests.HTTPError as e:
        erro = e.response.json() if e.response else {}
        erros = erro.get("errors", [])
        msg = erros[0].get("description", str(erro)) if erros else str(erro)
        return {"error": msg}
    except Exception as e:
        return {"error": str(e)}
