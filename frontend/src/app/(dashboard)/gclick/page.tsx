"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CheckSquare, Users, BarChart2, Filter, RefreshCw,
  Plus, Edit2, Search, X, Check, ChevronLeft,
  ChevronRight, Eye, Building2, Phone, Mail,
  AlertCircle, Clock, CheckCircle2, XCircle,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  SETORES_GCLICK,
  buscarIdSetor,
  STATUS_GCLICK,
  buscarCodigoStatus,
  MESES_COMPETENCIA,
  gerarAnos,
  competenciaParaDatas,
} from "@/constants/gclick_constants";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Tarefa {
  id: number;
  categoria: string;
  descricao: string;
  cliente_nome: string;
  cliente_id: number;
  setor: string;
  competencia: string;
  vencimento: string;
  status: string;
  status_raw: string;
}

interface Cliente {
  id: number;
  nome: string;
  apelido: string;
  cnpj: string;
  tipoInscricao: string;
  tipo: string;
  responsavel: string;
  email: string;
  telefone: string;
  status: string;
}

interface ClienteDetalhe extends Cliente {
  endereco?: Record<string, string>;
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const BACKEND = "http://192.168.0.17:5050";
const ANOS    = gerarAnos();

const STATUS_CORES: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  "Aberto":      { bg: "bg-yellow-100", text: "text-yellow-700", icon: <Clock        className="w-3 h-3" /> },
  "Aguardando":  { bg: "bg-orange-100", text: "text-orange-700", icon: <Clock        className="w-3 h-3" /> },
  "Concluído":   { bg: "bg-green-100",  text: "text-green-700",  icon: <CheckCircle2 className="w-3 h-3" /> },
  "Finalizado":  { bg: "bg-green-100",  text: "text-green-700",  icon: <CheckCircle2 className="w-3 h-3" /> },
  "Retificado":  { bg: "bg-blue-100",   text: "text-blue-700",   icon: <CheckCircle2 className="w-3 h-3" /> },
  "Cancelado":   { bg: "bg-red-100",    text: "text-red-700",    icon: <XCircle      className="w-3 h-3" /> },
  "Dispensado":  { bg: "bg-slate-100",  text: "text-slate-600",  icon: <XCircle      className="w-3 h-3" /> },
  "Retificando": { bg: "bg-purple-100", text: "text-purple-700", icon: <AlertCircle  className="w-3 h-3" /> },
};

const GRAFICO_CORES = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const formatarData = (s?: string) =>
  s ? new Date(s + "T12:00:00").toLocaleDateString("pt-BR") : "—";

function normalizarRespostaClientes(data: any): {
  clientes: Cliente[]; total: number; totalPages: number; page: number;
} {
  if (Array.isArray(data))
    return { clientes: data, total: data.length, totalPages: 1, page: 0 };
  return {
    clientes:   Array.isArray(data?.clientes)   ? data.clientes   : [],
    total:      typeof data?.total      === "number" ? data.total      : 0,
    totalPages: typeof data?.totalPages === "number" ? data.totalPages : 1,
    page:       typeof data?.page       === "number" ? data.page       : 0,
  };
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default function GClickPage() {
  const [aba, setAba] = useState<"obrigacoes" | "dashboard" | "clientes">("obrigacoes");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-1">
          {[
            { id: "obrigacoes", label: "Obrigações", icon: <CheckSquare className="w-4 h-4" /> },
            { id: "dashboard",  label: "Dashboard",  icon: <BarChart2   className="w-4 h-4" /> },
            { id: "clientes",   label: "Clientes",   icon: <Users       className="w-4 h-4" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setAba(t.id as any)}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold border-b-2 transition-colors ${
                aba === t.id
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6">
        {aba === "obrigacoes" && <AbaObrigacoes />}
        {aba === "dashboard"  && <AbaDashboard />}
        {aba === "clientes"   && <AbaClientes />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE: SELETOR DE COMPETÊNCIA (Mês + Ano)
// ═══════════════════════════════════════════════════════════════════════════════
function SeletorCompetencia({
  mes, ano,
  onMes, onAno,
}: {
  mes: string; ano: string;
  onMes: (v: string) => void; onAno: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        Competência
      </label>
      <div className="flex gap-2">
        {/* Mês */}
        <select
          value={mes}
          onChange={(e) => onMes(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {MESES_COMPETENCIA.map((m) => (
            <option key={m.valor} value={m.valor}>{m.label}</option>
          ))}
        </select>
        {/* Ano — gerado dinamicamente de 2021 até o ano atual */}
        <select
          value={ano}
          onChange={(e) => onAno(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ANOS.map((a) => (
            <option key={a} value={String(a)}>{a}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ABA: OBRIGAÇÕES
// ═══════════════════════════════════════════════════════════════════════════════
function AbaObrigacoes() {
  const hoje   = new Date();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro]       = useState("");

  // Filtros
  const [setorNome, setSetorNome]     = useState("Todos");
  const [statusLabel, setStatusLabel] = useState("Aberto");
  const [compMes, setCompMes]   = useState(String(hoje.getMonth() + 1).padStart(2, "0"));
  const [compAno, setCompAno]   = useState(String(hoje.getFullYear()));

  const buscarTarefas = useCallback(async () => {
    setLoading(true);
    setErro("");
    try {
      const { inicio, fim } = competenciaParaDatas(compMes, compAno);
      const params = new URLSearchParams({ categoria: "Obrigacao" });

      // ── Setor: busca binária no dicionário → retorna ID numérico ──
      const setorId = buscarIdSetor(setorNome);
      if (setorId !== null) params.append("setor_id", String(setorId));

      // ── Status: busca binária no dicionário → retorna código da API ──
      const statusCodigo = buscarCodigoStatus(statusLabel);
      if (statusCodigo !== null) {
        params.append("status_codigo", statusCodigo);
      } else {
        // "Todos" = envia "todos" → backend ignora o filtro de status
        params.append("status_codigo", "todos");
      }

      // ── Competência: gerada pelos seletores de Mês + Ano ──
      params.append("competencia_inicio", inicio);
      params.append("competencia_fim",    fim);

      const res = await fetch(`${BACKEND}/api/gclick/tarefas?${params}`);
      if (!res.ok) throw new Error((await res.json()).detail ?? "Erro ao buscar tarefas");
      const data = await res.json();
      setTarefas(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErro(e.message);
      setTarefas([]);
    } finally {
      setLoading(false);
    }
  }, [setorNome, statusLabel, compMes, compAno]);

  useEffect(() => { buscarTarefas(); }, []);

  const limpar = () => {
    setSetorNome("Todos");
    setStatusLabel("Aberto");
    setCompMes(String(hoje.getMonth() + 1).padStart(2, "0"));
    setCompAno(String(hoje.getFullYear()));
    setTimeout(buscarTarefas, 50);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Obrigações G-Click</h1>
          <p className="text-sm text-slate-500 mt-0.5">{tarefas.length} obrigações encontradas</p>
        </div>
      </div>

      {/* ── Painel de Filtros ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-wrap gap-3 items-end">

          {/* Setor — dicionário SETORES_GCLICK, busca binária no envio */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Setor
            </label>
            <select
              value={setorNome}
              onChange={(e) => setSetorNome(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[170px]"
            >
              <option value="Todos">Todos os setores</option>
              {SETORES_GCLICK.map((s) => (
                <option key={s.id} value={s.nome}>{s.nome}</option>
              ))}
            </select>
          </div>

          {/* Status — dicionário STATUS_GCLICK, busca binária no envio */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Status
            </label>
            <select
              value={statusLabel}
              onChange={(e) => setStatusLabel(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
            >
              <option value="Todos">Todos</option>
              {STATUS_GCLICK.map((s) => (
                <option key={s.codigo} value={s.label}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Competência — dois seletores: Mês + Ano */}
          <SeletorCompetencia
            mes={compMes} ano={compAno}
            onMes={setCompMes} onAno={setCompAno}
          />

          <button
            onClick={buscarTarefas}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
                       px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Filter className="w-4 h-4" /> Filtrar
          </button>
          <button
            onClick={limpar}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700
                       px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Limpar
          </button>
        </div>
      </div>

      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {erro}
        </div>
      )}

      {/* ── Tabela ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="text-left px-5 py-3 font-semibold">Obrigação</th>
                <th className="text-left px-4 py-3 font-semibold">Cliente</th>
                <th className="text-left px-4 py-3 font-semibold">Setor</th>
                <th className="text-left px-4 py-3 font-semibold">Competência</th>
                <th className="text-left px-4 py-3 font-semibold">Vencimento</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-slate-100 animate-pulse rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : tarefas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    Nenhuma obrigação encontrada para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                tarefas.map((t) => {
                  const badge = STATUS_CORES[t.status] ?? {
                    bg: "bg-slate-100", text: "text-slate-600", icon: null,
                  };
                  return (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-slate-800 max-w-[220px] truncate">
                        {t.descricao || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{t.cliente_nome}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                          {t.setor || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {t.competencia ? t.competencia.substring(0, 7) : "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {formatarData(t.vencimento)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                          {badge.icon} {t.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ABA: DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function AbaDashboard() {
  const hoje = new Date();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(false);

  const [setorNome, setSetorNome] = useState("Todos");
  const [compMes, setCompMes]     = useState(String(hoje.getMonth() + 1).padStart(2, "0"));
  const [compAno, setCompAno]     = useState(String(hoje.getFullYear()));

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const { inicio, fim } = competenciaParaDatas(compMes, compAno);
      const params = new URLSearchParams({
        categoria:          "Obrigacao",
        status_codigo:      "todos",       // Dashboard exibe todos os status
        competencia_inicio: inicio,
        competencia_fim:    fim,
      });
      const setorId = buscarIdSetor(setorNome);
      if (setorId !== null) params.append("setor_id", String(setorId));

      const res = await fetch(`${BACKEND}/api/gclick/tarefas?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTarefas(Array.isArray(data) ? data : []);
      }
    } catch {}
    finally { setLoading(false); }
  }, [setorNome, compMes, compAno]);

  useEffect(() => { carregar(); }, []);

  const total      = tarefas.length;
  const concluidas = tarefas.filter(t => ["Concluído", "Finalizado", "Retificado"].includes(t.status)).length;
  const abertas    = tarefas.filter(t => ["Aberto", "Aguardando", "Retificando"].includes(t.status)).length;
  const canceladas = tarefas.filter(t => ["Cancelado", "Dispensado"].includes(t.status)).length;
  const pct        = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  const porStatus = Object.entries(
    tarefas.reduce<Record<string, number>>((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1; return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const porSetor = Object.entries(
    tarefas.reduce<Record<string, { total: number; concluidas: number }>>((acc, t) => {
      const s = t.setor || "Sem setor";
      if (!acc[s]) acc[s] = { total: 0, concluidas: 0 };
      acc[s].total++;
      if (["Concluído", "Finalizado", "Retificado"].includes(t.status)) acc[s].concluidas++;
      return acc;
    }, {})
  ).map(([name, v]) => ({ name, ...v, pendentes: v.total - v.concluidas }));

  const topClientes = Object.entries(
    tarefas
      .filter(t => ["Aberto", "Aguardando"].includes(t.status))
      .reduce<Record<string, number>>((acc, t) => {
        acc[t.cliente_nome] = (acc[t.cliente_nome] || 0) + 1; return acc;
      }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, pendentes]) => ({
      name: name.length > 22 ? name.substring(0, 22) + "…" : name,
      pendentes,
    }));

  return (
    <div className="flex flex-col gap-5">
      {/* Cabeçalho + filtros inline */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Dashboard G-Click</h1>
          <p className="text-sm text-slate-500 mt-0.5">Visão geral das obrigações</p>
        </div>
        <div className="flex gap-3 items-end flex-wrap">
          {/* Setor */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Setor</label>
            <select
              value={setorNome}
              onChange={(e) => setSetorNome(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Todos">Todos</option>
              {SETORES_GCLICK.map((s) => (
                <option key={s.id} value={s.nome}>{s.nome}</option>
              ))}
            </select>
          </div>

          {/* Competência */}
          <SeletorCompetencia
            mes={compMes} ano={compAno}
            onMes={setCompMes} onAno={setCompAno}
          />

          <button
            onClick={carregar}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
                       px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            {loading
              ? <RefreshCw className="w-4 h-4 animate-spin" />
              : <Filter    className="w-4 h-4" />}
            Atualizar
          </button>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard titulo="Total"        valor={total}      cor="slate"  />
        <MetricCard titulo="Concluídas"   valor={concluidas} cor="green"  />
        <MetricCard titulo="Em Aberto"    valor={abertas}    cor="yellow" />
        <MetricCard titulo="% Conclusão"  valor={`${pct}%`} cor="blue"   />
      </div>

      {/* Barra de progresso */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-700">Taxa de Conclusão</h3>
          <span className="text-2xl font-black text-blue-600">{pct}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-4">
          <div
            className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>{concluidas} concluídas</span>
          <span>{abertas} em aberto</span>
          <span>{canceladas} canceladas/dispensadas</span>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-bold text-slate-700 mb-4">Distribuição por Status</h3>
          {loading ? (
            <div className="h-56 bg-slate-50 animate-pulse rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={porStatus} cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {porStatus.map((_, i) => (
                    <Cell key={i} fill={GRAFICO_CORES[i % GRAFICO_CORES.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-bold text-slate-700 mb-4">Concluídas vs Pendentes por Setor</h3>
          {loading ? (
            <div className="h-56 bg-slate-50 animate-pulse rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={porSetor} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="concluidas" name="Concluídas" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pendentes"  name="Pendentes"  fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {topClientes.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h3 className="font-bold text-slate-700 mb-4">Top Clientes com Obrigações Pendentes</h3>
          {loading ? (
            <div className="h-48 bg-slate-50 animate-pulse rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topClientes} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number"   tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={140} />
                <Tooltip />
                <Bar dataKey="pendentes" name="Pendentes" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ABA: CLIENTES
// ═══════════════════════════════════════════════════════════════════════════════
function AbaClientes() {
  const [clientes, setClientes]     = useState<Cliente[]>([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]             = useState(0);
  const [busca, setBusca]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [erro, setErro]             = useState("");

  const [modalTipo, setModalTipo]   = useState<"ver" | "editar" | "criar" | null>(null);
  const [clienteSel, setClienteSel] = useState<ClienteDetalhe | null>(null);
  const [form, setForm] = useState({
    nome: "", apelido: "", inscricao: "", tipoInscricao: "CNPJ",
    tipo: "FIXO", email: "", telefone: "",
  });
  const [salvando, setSalvando]     = useState(false);
  const [erroModal, setErroModal]   = useState("");

  const buscarClientes = useCallback(async (p: number = 0, q: string = busca) => {
    setLoading(true);
    setErro("");
    try {
      const params = new URLSearchParams({ page: String(p), size: "50" });
      if (q) params.append("busca", q);
      const res  = await fetch(`${BACKEND}/api/gclick/clientes?${params}`);
      if (!res.ok) throw new Error((await res.json()).detail ?? "Erro ao buscar clientes");
      const norm = normalizarRespostaClientes(await res.json());
      setClientes(norm.clientes);
      setTotal(norm.total);
      setTotalPages(norm.totalPages);
      setPage(p);
    } catch (e: any) {
      setErro(e.message);
      setClientes([]); setTotal(0); setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [busca]);

  useEffect(() => { buscarClientes(0, ""); }, []);

  const abrirVer = async (id: number) => {
    try {
      const res = await fetch(`${BACKEND}/api/gclick/clientes/${id}`);
      if (res.ok) { setClienteSel(await res.json()); setModalTipo("ver"); }
    } catch {}
  };

  const abrirEditar = async (id: number) => {
    try {
      const res = await fetch(`${BACKEND}/api/gclick/clientes/${id}`);
      if (res.ok) {
        const det: ClienteDetalhe = await res.json();
        setClienteSel(det);
        setForm({
          nome: det.nome || "", apelido: det.apelido || "",
          inscricao: det.cnpj || "", tipoInscricao: det.tipoInscricao || "CNPJ",
          tipo: det.tipo || "FIXO", email: det.email || "", telefone: det.telefone || "",
        });
        setErroModal(""); setModalTipo("editar");
      }
    } catch {}
  };

  const abrirCriar = () => {
    setForm({ nome: "", apelido: "", inscricao: "", tipoInscricao: "CNPJ", tipo: "FIXO", email: "", telefone: "" });
    setErroModal(""); setModalTipo("criar");
  };

  const salvar = async () => {
    if (!form.nome || !form.inscricao) { setErroModal("Nome e inscrição são obrigatórios."); return; }
    setSalvando(true); setErroModal("");
    try {
      const url    = modalTipo === "criar"
        ? `${BACKEND}/api/gclick/clientes`
        : `${BACKEND}/api/gclick/clientes/${clienteSel!.id}`;
      const method = modalTipo === "criar" ? "POST" : "PUT";
      const res    = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.detail || data.error || "Erro ao salvar.");
      setModalTipo(null);
      buscarClientes(page);
    } catch (e: any) {
      setErroModal(e.message);
    } finally { setSalvando(false); }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Clientes G-Click</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} clientes cadastrados</p>
        </div>
        <button
          onClick={abrirCriar}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
                     px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Novo Cliente
        </button>
      </div>

      {/* Busca */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text" value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscarClientes(0, busca)}
              placeholder="Buscar por nome ou CNPJ..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm
                         text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => buscarClientes(0, busca)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white
                       px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Search className="w-4 h-4" /> Buscar
          </button>
          {busca && (
            <button
              onClick={() => { setBusca(""); buscarClientes(0, ""); }}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-700
                         px-3 py-2 rounded-lg text-sm transition-colors"
            >
              <X className="w-4 h-4" /> Limpar
            </button>
          )}
        </div>
      </div>

      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{erro}</div>
      )}

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="text-left px-5 py-3 font-semibold">Nome</th>
                <th className="text-left px-4 py-3 font-semibold">CNPJ/CPF</th>
                <th className="text-left px-4 py-3 font-semibold">Tipo</th>
                <th className="text-left px-4 py-3 font-semibold">E-mail</th>
                <th className="text-left px-4 py-3 font-semibold">Telefone</th>
                <th className="text-center px-4 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-slate-100 animate-pulse rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : clientes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                clientes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-800 max-w-[200px] truncate">
                      {c.nome}
                      {c.apelido && c.apelido !== c.nome && (
                        <span className="block text-xs font-normal text-slate-400">{c.apelido}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-xs">{c.cnpj || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {c.tipo || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs max-w-[160px] truncate">{c.email || "—"}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{c.telefone || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => abrirVer(c.id)} title="Ver detalhes"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => abrirEditar(c.id)} title="Editar"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-500">
              Página {page + 1} de {totalPages} — {total} clientes
            </p>
            <div className="flex gap-2">
              <button onClick={() => buscarClientes(page - 1)} disabled={page === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs
                           font-semibold text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" /> Anterior
              </button>
              <button onClick={() => buscarClientes(page + 1)} disabled={page >= totalPages - 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs
                           font-semibold text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Próxima <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Ver Detalhes */}
      {modalTipo === "ver" && clienteSel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" /> Detalhes do Cliente
              </h3>
              <button onClick={() => setModalTipo(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-3">
              <DetalheItem label="Nome"           value={clienteSel.nome} />
              <DetalheItem label="Apelido"        value={clienteSel.apelido} />
              <DetalheItem label="CNPJ/CPF"       value={clienteSel.cnpj} mono />
              <DetalheItem label="Tipo Inscrição" value={clienteSel.tipoInscricao} />
              <DetalheItem label="Tipo Cliente"   value={clienteSel.tipo} />
              {clienteSel.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700">{clienteSel.email}</span>
                </div>
              )}
              {clienteSel.telefone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700">{clienteSel.telefone}</span>
                </div>
              )}
              {clienteSel.endereco && Object.keys(clienteSel.endereco).length > 0 && (
                <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 mt-1">
                  {[clienteSel.endereco.rua, clienteSel.endereco.numero, clienteSel.endereco.bairro,
                    clienteSel.endereco.cidade, clienteSel.endereco.estado].filter(Boolean).join(", ")}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
              <button onClick={() => setModalTipo(null)}
                className="flex-1 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-lg
                           text-sm font-semibold hover:bg-slate-50 transition-colors">
                Fechar
              </button>
              <button onClick={() => abrirEditar(clienteSel.id as number)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg
                           text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                <Edit2 className="w-4 h-4" /> Editar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Criar / Editar */}
      {(modalTipo === "criar" || modalTipo === "editar") && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h3 className="font-bold text-slate-800 text-lg">
                {modalTipo === "criar" ? "Novo Cliente" : "Editar Cliente"}
              </h3>
              <button onClick={() => setModalTipo(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <Campo label="Nome *"   value={form.nome}    onChange={v => setForm({...form, nome: v})}    placeholder="Razão social ou nome completo" />
              <Campo label="Apelido"  value={form.apelido} onChange={v => setForm({...form, apelido: v})} placeholder="Nome fantasia (opcional)" />
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tipo Inscrição</label>
                  <select value={form.tipoInscricao} onChange={e => setForm({...form, tipoInscricao: e.target.value})}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700
                               focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {["CNPJ","CPF","CEI","SREG"].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <Campo label="Inscrição *" value={form.inscricao} onChange={v => setForm({...form, inscricao: v})} placeholder="00.000.000/0001-00" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tipo de Cliente</label>
                <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700
                             focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="FIXO">FIXO</option>
                  <option value="EVENTUAL">EVENTUAL</option>
                </select>
              </div>
              <Campo label="E-mail"   value={form.email}    onChange={v => setForm({...form, email: v})}    placeholder="contato@empresa.com" type="email" />
              <Campo label="Telefone" value={form.telefone} onChange={v => setForm({...form, telefone: v})} placeholder="(11) 99999-9999" />
              {erroModal && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">{erroModal}</div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-slate-100 sticky bottom-0 bg-white">
              <button onClick={() => setModalTipo(null)}
                className="flex-1 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-lg
                           text-sm font-semibold hover:bg-slate-50 transition-colors">
                Cancelar
              </button>
              <button onClick={salvar} disabled={salvando}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2.5
                           rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                {salvando ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {modalTipo === "criar" ? "Criar Cliente" : "Salvar Alterações"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────
function MetricCard({ titulo, valor, cor }: { titulo: string; valor: any; cor: string }) {
  const cores: Record<string, string> = {
    slate: "text-slate-700", green: "text-green-600",
    yellow: "text-yellow-600", blue: "text-blue-600",
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">{titulo}</p>
      <p className={`text-3xl font-black ${cores[cor] ?? "text-slate-700"}`}>{valor}</p>
    </div>
  );
}

function DetalheItem({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
      <p className={`text-sm text-slate-700 mt-0.5 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

function Campo({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}