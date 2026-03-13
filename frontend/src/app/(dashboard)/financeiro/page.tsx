"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Building2, DollarSign, FileText, AlertTriangle,
  Plus, Edit2, ExternalLink, X, Check,
  RefreshCw, Filter, Send, Trash2,
  KeyRound, ArrowRightLeft,
} from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface ResumoFinanceiro {
  total_notas_emitidas: number;
  qtd_notas_emitidas: number;
  total_recebido: number;
  total_recebido_bruto: number;
  qtd_recebido: number;
  total_vencido: number;
  qtd_vencido: number;
}

interface CobrancaAsaas {
  id: string;
  cliente: string;
  vencimento: string;
  valor: number;
  valor_liquido: number;
  status: string;
  link: string;
  descricao: string;
  tipo: string;
  data_pagamento?: string;
}

interface ClienteAsaas {
  id: string;
  nome: string;
  cpfCnpj: string;
  email: string;
}

interface ChavePix {
  id: number;
  apelido: string;
  chave: string;
  tipo: string;
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const BACKEND = "http://192.168.0.17:5050";

const CONTAS = [
  { id: 1, label: "Elo Gestão Contábil" },
  { id: 2, label: "Elo Gestão Empresarial" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Todos os status" },
  { value: "PENDING", label: "Pendente" },
  { value: "RECEIVED", label: "Recebido" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "OVERDUE", label: "Vencido" },
  { value: "REFUNDED", label: "Estornado" },
];

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  PENDING:   { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pendente"   },
  RECEIVED:  { bg: "bg-green-100",  text: "text-green-700",  label: "Recebido"   },
  CONFIRMED: { bg: "bg-blue-100",   text: "text-blue-700",   label: "Confirmado" },
  OVERDUE:   { bg: "bg-red-100",    text: "text-red-700",    label: "Vencido"    },
  REFUNDED:  { bg: "bg-slate-100",  text: "text-slate-600",  label: "Estornado"  },
};

const BILLING_OPTIONS = [
  { value: "UNDEFINED",   label: "Livre (cliente escolhe)" },
  { value: "BOLETO",      label: "Boleto"                  },
  { value: "PIX",         label: "Pix"                     },
  { value: "CREDIT_CARD", label: "Cartão de Crédito"       },
];

const TIPO_PIX_OPTIONS = [
  { value: "CPF",   label: "CPF"                   },
  { value: "CNPJ",  label: "CNPJ"                  },
  { value: "EMAIL", label: "E-mail"                },
  { value: "PHONE", label: "Telefone"              },
  { value: "EVP",   label: "Chave Aleatória (EVP)" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const moeda = (v: number) =>
  (v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const hojeStr = () => new Date().toISOString().split("T")[0];

const inicioMesStr = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split("T")[0];
};

const formatarData = (s?: string) =>
  s ? new Date(s + "T12:00:00").toLocaleDateString("pt-BR") : "—";

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function FinanceiroPage() {
  const [conta, setConta] = useState(1);
  const [inicio, setInicio] = useState(inicioMesStr());
  const [fim, setFim] = useState(hojeStr());
  const [statusFiltro, setStatusFiltro] = useState("");

  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [cobrancas, setCobrancas] = useState<CobrancaAsaas[]>([]);
  const [clientes, setClientes] = useState<ClienteAsaas[]>([]);
  const [saldo, setSaldo] = useState<Record<number, number>>({ 1: 0, 2: 0 });
  const [loadingSaldo, setLoadingSaldo] = useState<Record<number, boolean>>({ 1: false, 2: false });
  const [chavesPix, setChavesPix] = useState<ChavePix[]>([]);

  const [loadingResumo, setLoadingResumo] = useState(false);
  const [loadingCob, setLoadingCob] = useState(false);
  const [erro, setErro] = useState("");

  // Modal cobranças
  const [modal, setModal] = useState<"criar" | "editar" | null>(null);
  const [cobSelecionada, setCobSelecionada] = useState<CobrancaAsaas | null>(null);
  const [form, setForm] = useState({
    customer: "", billingType: "UNDEFINED",
    value: "", dueDate: hojeStr(), description: "",
  });
  const [salvando, setSalvando] = useState(false);
  const [erroModal, setErroModal] = useState("");

  // Modal chave Pix
  const [modalChave, setModalChave] = useState(false);
  const [formChave, setFormChave] = useState({ apelido: "", chave: "", tipo: "CPF" });
  const [salvandoChave, setSalvandoChave] = useState(false);
  const [erroChave, setErroChave] = useState("");

  // Modal transferência
  const [modalTransf, setModalTransf] = useState(false);
  const [chaveTransf, setChaveTransf] = useState<ChavePix | null>(null);
  const [valorTransf, setValorTransf] = useState("");
  const [descTransf, setDescTransf] = useState("");
  const [contaTransf, setContaTransf] = useState(1);
  const [transferindo, setTransferindo] = useState(false);
  const [erroTransf, setErroTransf] = useState("");
  const [sucessoTransf, setSucessoTransf] = useState("");

  // ── Fetchers ──────────────────────────────────────────────────────────────
  const buscarSaldo = useCallback(async (ct: number) => {
    setLoadingSaldo((prev) => ({ ...prev, [ct]: true }));
    try {
      const res = await fetch(`${BACKEND}/api/financeiro/saldo?conta=${ct}`);
      if (!res.ok) throw new Error("Erro");
      const data = await res.json();
      setSaldo((prev) => ({ ...prev, [ct]: data.balance ?? 0 }));
    } catch {}
    finally {
      setLoadingSaldo((prev) => ({ ...prev, [ct]: false }));
    }
  }, []);

  const buscarResumo = useCallback(async (ini?: string, f?: string, ct?: number) => {
    setLoadingResumo(true);
    setErro("");
    try {
      const params = new URLSearchParams({
        inicio: ini ?? inicio,
        fim: f ?? fim,
        conta: String(ct ?? conta),
      });
      const res = await fetch(`${BACKEND}/api/financeiro/resumo?${params}`);
      if (!res.ok) throw new Error((await res.json()).detail ?? "Erro");
      setResumo(await res.json());
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoadingResumo(false);
    }
  }, [inicio, fim, conta]);

  const buscarCobrancas = useCallback(async (
    ini?: string, f?: string, st?: string, ct?: number
  ) => {
    setLoadingCob(true);
    try {
      const params = new URLSearchParams({
        inicio: ini ?? inicio,
        fim: f ?? fim,
        conta: String(ct ?? conta),
      });
      const s = st !== undefined ? st : statusFiltro;
      if (s) params.append("status", s);
      const res = await fetch(`${BACKEND}/api/financeiro/cobrancas?${params}`);
      if (!res.ok) throw new Error((await res.json()).detail ?? "Erro");
      setCobrancas(await res.json());
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoadingCob(false);
    }
  }, [inicio, fim, conta, statusFiltro]);

  const buscarClientes = useCallback(async (ct?: number) => {
    try {
      const res = await fetch(`${BACKEND}/api/financeiro/clientes?conta=${ct ?? conta}`);
      if (res.ok) setClientes(await res.json());
    } catch {}
  }, [conta]);

  const buscarChavesPix = async () => {
    try {
      const res = await fetch(`${BACKEND}/api/financeiro/pix/chaves`);
      if (res.ok) setChavesPix(await res.json());
    } catch {}
  };

  useEffect(() => {
    buscarResumo(undefined, undefined, conta);
    buscarCobrancas(undefined, undefined, undefined, conta);
    buscarClientes(conta);
    buscarSaldo(1);
    buscarSaldo(2);
    buscarChavesPix();
  }, [conta]);

  const aplicarFiltros = () => {
    buscarResumo(inicio, fim, conta);
    buscarCobrancas(inicio, fim, statusFiltro, conta);
  };

  const limparFiltros = () => {
    const ini = inicioMesStr();
    const f = hojeStr();
    setInicio(ini);
    setFim(f);
    setStatusFiltro("");
    buscarResumo(ini, f, conta);
    buscarCobrancas(ini, f, "", conta);
  };

  // ── Modal Cobranças ────────────────────────────────────────────────────────
  const abrirCriar = () => {
    setForm({
      customer: "", billingType: "UNDEFINED",
      value: "", dueDate: hojeStr(), description: "",
    });
    setErroModal("");
    setModal("criar");
  };

  const abrirEditar = (cob: CobrancaAsaas) => {
    setCobSelecionada(cob);
    setForm({
      customer: cob.cliente ?? "",
      billingType: cob.tipo || "UNDEFINED",
      value: String(cob.valor),
      dueDate: cob.vencimento ?? hojeStr(),
      description: cob.descricao || "",
    });
    setErroModal("");
    setModal("editar");
  };

  const salvar = async () => {
    setSalvando(true);
    setErroModal("");
    try {
      let res: Response;
      if (modal === "criar") {
        if (!form.customer || !form.value || !form.dueDate) {
          setErroModal("Preencha cliente, valor e vencimento.");
          return;
        }
        res = await fetch(`${BACKEND}/api/financeiro/cobrancas?conta=${conta}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: form.customer,
            billingType: form.billingType,
            value: parseFloat(form.value),
            dueDate: form.dueDate,
            ...(form.description && { description: form.description }),
          }),
        });
      } else {
        res = await fetch(
          `${BACKEND}/api/financeiro/cobrancas/${cobSelecionada!.id}?conta=${conta}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...(form.billingType && { billingType: form.billingType }),
              ...(form.value && { value: parseFloat(form.value) }),
              ...(form.dueDate && { dueDate: form.dueDate }),
              description: form.description,
            }),
          }
        );
      }
      const data = await res.json();
      if (!res.ok || data.error)
        throw new Error(data.detail || data.error || "Erro ao salvar.");
      setModal(null);
      buscarCobrancas(inicio, fim, statusFiltro, conta);
      buscarResumo(inicio, fim, conta);
    } catch (e: any) {
      setErroModal(e.message);
    } finally {
      setSalvando(false);
    }
  };

  // ── Modal Chave Pix ────────────────────────────────────────────────────────
  const salvarChave = async () => {
    if (!formChave.apelido || !formChave.chave) {
      setErroChave("Preencha apelido e chave.");
      return;
    }
    setSalvandoChave(true);
    setErroChave("");
    try {
      const res = await fetch(`${BACKEND}/api/financeiro/pix/chaves`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formChave),
      });
      if (!res.ok) throw new Error((await res.json()).detail ?? "Erro");
      setModalChave(false);
      setFormChave({ apelido: "", chave: "", tipo: "CPF" });
      buscarChavesPix();
    } catch (e: any) {
      setErroChave(e.message);
    } finally {
      setSalvandoChave(false);
    }
  };

  const deletarChave = async (id: number) => {
    if (!confirm("Remover esta chave Pix?")) return;
    try {
      await fetch(`${BACKEND}/api/financeiro/pix/chaves/${id}`, { method: "DELETE" });
      buscarChavesPix();
    } catch {}
  };

  // ── Modal Transferência ────────────────────────────────────────────────────
  const abrirTransferencia = (chave: ChavePix) => {
    setChaveTransf(chave);
    setValorTransf("");
    setDescTransf("");
    setContaTransf(conta);
    setErroTransf("");
    setSucessoTransf("");
    setModalTransf(true);
  };

  const realizarTransferencia = async () => {
    if (!valorTransf || parseFloat(valorTransf) <= 0) {
      setErroTransf("Informe um valor válido.");
      return;
    }
    setTransferindo(true);
    setErroTransf("");
    setSucessoTransf("");
    try {
      const res = await fetch(
        `${BACKEND}/api/financeiro/pix/transferir?conta=${contaTransf}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chave: chaveTransf!.chave,
            tipo: chaveTransf!.tipo,
            valor: parseFloat(valorTransf),
            ...(descTransf && { descricao: descTransf }),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok || data.error)
        throw new Error(data.detail || data.error || "Erro na transferência.");
      setSucessoTransf("Transferência realizada com sucesso!");
      buscarSaldo(contaTransf);
      setTimeout(() => setModalTransf(false), 2000);
    } catch (e: any) {
      setErroTransf(e.message);
    } finally {
      setTransferindo(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const contaLabel = CONTAS.find((c) => c.id === conta)?.label ?? "";

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-slate-50">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Gestão Financeira</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Cobranças, notas e recebimentos — Asaas
          </p>
        </div>
        <button
          onClick={abrirCriar}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nova Cobrança
        </button>
      </div>

      {/* Seletor de Conta + Saldo em Tempo Real */}
      <div className="flex flex-col sm:flex-row gap-3">
        {CONTAS.map((c) => (
          <button
            key={c.id}
            onClick={() => setConta(c.id)}
            className={`flex items-center justify-between gap-4 px-5 py-3 rounded-xl border transition-all flex-1 ${
              conta === c.id
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-semibold">{c.label}</span>
            </div>
            <div className="text-right">
              <p className={`text-[10px] uppercase tracking-wide font-bold ${
                conta === c.id ? "text-blue-200" : "text-slate-400"
              }`}>
                Saldo disponível
              </p>
              {loadingSaldo[c.id] ? (
                <div className="h-4 w-20 bg-white/30 rounded animate-pulse mt-0.5" />
              ) : (
                <p className={`text-sm font-black ${
                  conta === c.id ? "text-white" : "text-green-600"
                }`}>
                  {moeda(saldo[c.id] ?? 0)}
                </p>
              )}
            </div>
          </button>
        ))}
        <button
          onClick={() => { buscarSaldo(1); buscarSaldo(2); }}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-700 text-sm transition-colors"
          title="Atualizar saldos"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Vencimento — De
            </label>
            <input
              type="date" value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Vencimento — Até
            </label>
            <input
              type="date" value={fim}
              onChange={(e) => setFim(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Status
            </label>
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={aplicarFiltros}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Filter className="w-4 h-4" /> Filtrar
          </button>
          <button
            onClick={limparFiltros}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Limpar
          </button>
        </div>
      </div>

      {/* Erro global */}
      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {erro}
        </div>
      )}

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ResumoCard
          icon={<FileText className="w-5 h-5 text-blue-600" />}
          titulo="Notas Emitidas"
          valor={moeda(resumo?.total_notas_emitidas ?? 0)}
          sub={`${resumo?.qtd_notas_emitidas ?? 0} notas`}
          cor="blue" loading={loadingResumo}
        />
        <ResumoCard
          icon={<DollarSign className="w-5 h-5 text-green-600" />}
          titulo="Recebido (líquido)"
          valor={moeda(resumo?.total_recebido ?? 0)}
          sub={`${resumo?.qtd_recebido ?? 0} pagamentos`}
          cor="green" loading={loadingResumo}
        />
        <ResumoCard
          icon={<DollarSign className="w-5 h-5 text-slate-500" />}
          titulo="Recebido (bruto)"
          valor={moeda(resumo?.total_recebido_bruto ?? 0)}
          sub="Antes das taxas Asaas"
          cor="slate" loading={loadingResumo}
        />
        <ResumoCard
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
          titulo="Em Atraso"
          valor={moeda(resumo?.total_vencido ?? 0)}
          sub={`${resumo?.qtd_vencido ?? 0} cobranças`}
          cor="red" loading={loadingResumo}
        />
      </div>

      {/* Tabela de Cobranças */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">
            Cobranças — {contaLabel}
            <span className="ml-2 text-sm font-normal text-slate-400">
              ({cobrancas.length} registros)
            </span>
          </h2>
          {loadingCob && <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" />}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="text-left px-5 py-3 font-semibold">Descrição</th>
                <th className="text-left px-4 py-3 font-semibold">Vencimento</th>
                <th className="text-right px-4 py-3 font-semibold">Valor</th>
                <th className="text-left px-4 py-3 font-semibold">Tipo</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Pgto</th>
                <th className="text-center px-4 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cobrancas.length === 0 && !loadingCob ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Nenhuma cobrança encontrada para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                cobrancas.map((cob) => {
                  const badge = STATUS_BADGE[cob.status] ?? {
                    bg: "bg-slate-100", text: "text-slate-600", label: cob.status,
                  };
                  const podeEditar = ["PENDING", "OVERDUE"].includes(cob.status);
                  return (
                    <tr key={cob.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 text-slate-700 max-w-[220px] truncate">
                        {cob.descricao || (
                          <span className="text-slate-400 italic">Sem descrição</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {formatarData(cob.vencimento)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-800 whitespace-nowrap">
                        {moeda(cob.valor)}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {cob.tipo || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                        {formatarData(cob.data_pagamento)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          {cob.link && (
                            <a
                              href={cob.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Abrir link de pagamento"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {podeEditar && (
                            <button
                              onClick={() => abrirEditar(cob)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Editar cobrança"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Seção Pix ──────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-violet-600" />
            <h2 className="font-bold text-slate-800">Transferências Pix</h2>
            <span className="text-xs text-slate-400 font-normal ml-1">
              — chaves cadastradas
            </span>
          </div>
          <button
            onClick={() => {
              setFormChave({ apelido: "", chave: "", tipo: "CPF" });
              setErroChave("");
              setModalChave(true);
            }}
            className="flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-800 border border-violet-200 hover:border-violet-400 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Chave
          </button>
        </div>

        {chavesPix.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">
            Nenhuma chave Pix cadastrada. Clique em "Cadastrar Chave" para adicionar.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {chavesPix.map((chave) => (
              <div
                key={chave.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                    <ArrowRightLeft className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{chave.apelido}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono mr-2">
                        {chave.tipo}
                      </span>
                      {chave.chave}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => abrirTransferencia(chave)}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Transferir
                  </button>
                  <button
                    onClick={() => deletarChave(chave.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Remover chave"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal Criar/Editar Cobrança ────────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg">
                {modal === "criar" ? "Nova Cobrança" : "Editar Cobrança"}
              </h3>
              <button
                onClick={() => setModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              {modal === "criar" && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Cliente *
                  </label>
                  <select
                    value={form.customer}
                    onChange={(e) => setForm({ ...form, customer: e.target.value })}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um cliente...</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}{c.cpfCnpj ? ` — ${c.cpfCnpj}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Forma de Pagamento
                </label>
                <select
                  value={form.billingType}
                  onChange={(e) => setForm({ ...form, billingType: e.target.value })}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {BILLING_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Valor (R$) *
                  </label>
                  <input
                    type="number" step="0.01" min="0" value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    placeholder="0,00"
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Vencimento *
                  </label>
                  <input
                    type="date" value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Descrição
                </label>
                <input
                  type="text" value={form.description} maxLength={500}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Ex: Honorários março/2026"
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {erroModal && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
                  {erroModal}
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => setModal(null)}
                className="flex-1 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={salvar} disabled={salvando}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {salvando
                  ? <RefreshCw className="w-4 h-4 animate-spin" />
                  : <Check className="w-4 h-4" />
                }
                {modal === "criar" ? "Criar Cobrança" : "Salvar Alterações"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Cadastrar Chave Pix ──────────────────────────────────────────── */}
      {modalChave && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-violet-600" />
                Cadastrar Chave Pix
              </h3>
              <button
                onClick={() => setModalChave(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Apelido *
                </label>
                <input
                  type="text" value={formChave.apelido}
                  onChange={(e) => setFormChave({ ...formChave, apelido: e.target.value })}
                  placeholder="Ex: Fornecedor Marketing"
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Tipo de Chave
                </label>
                <select
                  value={formChave.tipo}
                  onChange={(e) => setFormChave({ ...formChave, tipo: e.target.value })}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {TIPO_PIX_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Chave Pix *
                </label>
                <input
                  type="text" value={formChave.chave}
                  onChange={(e) => setFormChave({ ...formChave, chave: e.target.value })}
                  placeholder={
                    formChave.tipo === "CPF" ? "000.000.000-00"
                    : formChave.tipo === "CNPJ" ? "00.000.000/0000-00"
                    : formChave.tipo === "EMAIL" ? "email@email.com"
                    : formChave.tipo === "PHONE" ? "+5511999998888"
                    : "Chave aleatória"
                  }
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              {erroChave && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
                  {erroChave}
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => setModalChave(false)}
                className="flex-1 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={salvarChave} disabled={salvandoChave}
                className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {salvandoChave
                  ? <RefreshCw className="w-4 h-4 animate-spin" />
                  : <Check className="w-4 h-4" />
                }
                Salvar Chave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Transferência Pix ────────────────────────────────────────────── */}
      {modalTransf && chaveTransf && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Send className="w-5 h-5 text-violet-600" />
                Transferir via Pix
              </h3>
              <button
                onClick={() => setModalTransf(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              {/* Destino */}
              <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
                <p className="text-xs text-violet-500 font-semibold uppercase tracking-wide mb-1">
                  Destino
                </p>
                <p className="font-bold text-violet-800 text-sm">{chaveTransf.apelido}</p>
                <p className="text-xs text-violet-600 mt-0.5">
                  <span className="font-mono bg-violet-100 px-1 rounded mr-1">
                    {chaveTransf.tipo}
                  </span>
                  {chaveTransf.chave}
                </p>
              </div>

              {/* Conta de origem */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Conta de Origem
                </label>
                <div className="flex gap-2">
                  {CONTAS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setContaTransf(c.id)}
                      className={`flex-1 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                        contaTransf === c.id
                          ? "bg-violet-600 text-white border-violet-600"
                          : "bg-white text-slate-600 border-slate-200 hover:border-violet-300"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Saldo:{" "}
                  <span className="font-semibold text-green-600">
                    {moeda(saldo[contaTransf] ?? 0)}
                  </span>
                </p>
              </div>

              {/* Valor */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Valor (R$) *
                </label>
                <input
                  type="number" step="0.01" min="0.01" value={valorTransf}
                  onChange={(e) => setValorTransf(e.target.value)}
                  placeholder="0,00"
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* Descrição */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Descrição (opcional)
                </label>
                <input
                  type="text" value={descTransf}
                  onChange={(e) => setDescTransf(e.target.value)}
                  placeholder="Ex: Pagamento fornecedor"
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {erroTransf && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
                  {erroTransf}
                </div>
              )}
              {sucessoTransf && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" /> {sucessoTransf}
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => setModalTransf(false)}
                className="flex-1 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={realizarTransferencia} disabled={transferindo}
                className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {transferindo
                  ? <RefreshCw className="w-4 h-4 animate-spin" />
                  : <Send className="w-4 h-4" />
                }
                Confirmar Transferência
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Card de Resumo ────────────────────────────────────────────────────────────
interface ResumoCardProps {
  icon: React.ReactNode;
  titulo: string;
  valor: string;
  sub: string;
  cor: "blue" | "green" | "red" | "slate";
  loading: boolean;
}

function ResumoCard({ icon, titulo, valor, sub, cor, loading }: ResumoCardProps) {
  const cores = {
    blue:  { bg: "bg-blue-50",  border: "border-blue-100",  val: "text-blue-700"  },
    green: { bg: "bg-green-50", border: "border-green-100", val: "text-green-700" },
    red:   { bg: "bg-red-50",   border: "border-red-100",   val: "text-red-600"   },
    slate: { bg: "bg-white",    border: "border-slate-200", val: "text-slate-700" },
  }[cor];

  return (
    <div className={`rounded-xl border p-5 shadow-sm ${cores.bg} ${cores.border}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          {titulo}
        </span>
      </div>
      {loading ? (
        <div className="h-8 w-32 bg-slate-200 animate-pulse rounded-lg" />
      ) : (
        <p className={`text-2xl font-black ${cores.val}`}>{valor}</p>
      )}
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  );
}