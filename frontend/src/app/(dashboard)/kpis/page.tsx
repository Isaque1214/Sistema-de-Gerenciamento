"use client";

import { useState, useEffect } from "react";
import PageWrapper from "@/components/layout/PageWrapper";

interface KpiItem {
  id: number;
  indicador: string;
  mes: string;
  meta: number;
  realizado: number;
}

const MESES_ORDEM = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

const INDICADORES = [
  { key: "Faturamento",       cor: "bg-blue-50 border-blue-200",    header: "bg-blue-700",   icon: "📈" },
  { key: "Recebimentos",      cor: "bg-green-50 border-green-200",  header: "bg-green-700",  icon: "💵" },
  { key: "Custos e Despesas", cor: "bg-red-50 border-red-200",      header: "bg-red-700",    icon: "📉" },
  { key: "Lucro Líquido",     cor: "bg-purple-50 border-purple-200",header: "bg-purple-700", icon: "💎" },
];

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function KpisPage() {
  const [kpis, setKpis] = useState<KpiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [iniciando, setIniciando] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);

  useEffect(() => { carregarKpis(); }, []);

  async function carregarKpis() {
    setLoading(true);
    const r = await fetch("/api/estrategia/kpis");
    setKpis(await r.json());
    setLoading(false);
  }

  async function inicializarKpis() {
    if (!confirm("Criar os 12 meses para os 4 indicadores (apenas os que não existem). Continuar?")) return;
    setIniciando(true);
    const r = await fetch("/api/estrategia/kpis/inicializar", { method: "POST" });
    const d = await r.json();
    setIniciando(false);
    if (d.erro) { alert("Erro: " + d.erro); return; }
    alert(`${d.criados} registros criados com sucesso!`);
    carregarKpis();
  }

  async function sincronizarAsaas() {
    setSincronizando(true);
    const r = await fetch("/api/estrategia/kpis/sincronizar", { method: "POST" });
    const d = await r.json();
    setSincronizando(false);
    if (d.erro) { alert("Erro: " + d.erro); return; }
    alert("Sincronização concluída!");
    carregarKpis();
  }

  async function atualizarKpi(id: number, campo: "meta" | "realizado", valor: string) {
    const item = kpis.find(k => k.id === id);
    if (!item) return;
    const payload = {
      id,
      meta:      campo === "meta"      ? parseFloat(valor) || 0 : item.meta,
      realizado: campo === "realizado" ? parseFloat(valor) || 0 : item.realizado,
    };
    await fetch("/api/estrategia/kpis", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  const temDados = kpis.length > 0;

  return (
    <PageWrapper>
      {/* Barra de ações */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-slate-800">KPIs Estratégicos</h1>
          <p className="text-sm text-slate-500 mt-0.5">Metas e resultados mensais dos indicadores financeiros</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {!temDados && (
            <button onClick={inicializarKpis} disabled={iniciando}
              className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-700 transition disabled:opacity-60">
              {iniciando ? "⏳ Inicializando..." : "🗄 Inicializar KPIs do Ano"}
            </button>
          )}
          <button onClick={sincronizarAsaas} disabled={sincronizando}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-60">
            {sincronizando ? "⏳ Sincronizando..." : "🔄 Sincronizar com Asaas"}
          </button>
          {temDados && (
            <button onClick={inicializarKpis} disabled={iniciando}
              className="flex items-center gap-2 border border-slate-300 text-slate-700 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-50 transition disabled:opacity-60">
              {iniciando ? "⏳" : "🗄"} Inicializar/Repor
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-center py-16 text-slate-400">Carregando...</div>
      )}

      {!loading && !temDados && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">Nenhum KPI cadastrado</h3>
          <p className="text-slate-400 text-sm mb-6">Clique em <strong>"Inicializar KPIs do Ano"</strong> para criar os 12 meses dos 4 indicadores.</p>
          <button onClick={inicializarKpis} disabled={iniciando}
            className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-700 transition">
            {iniciando ? "Inicializando..." : "Inicializar KPIs do Ano"}
          </button>
        </div>
      )}

      {!loading && temDados && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {INDICADORES.map(ind => {
            const itens = MESES_ORDEM.map(mes => kpis.find(k => k.indicador === ind.key && k.mes === mes)).filter(Boolean) as KpiItem[];
            const totalMeta = itens.reduce((s, k) => s + k.meta, 0);
            const totalReal = itens.reduce((s, k) => s + k.realizado, 0);
            const pctTotal  = totalMeta > 0 ? ((totalReal / totalMeta) * 100).toFixed(1) : "0";

            return (
              <div key={ind.key} className={`border-2 ${ind.cor} rounded-2xl overflow-hidden shadow-sm`}>
                {/* Header */}
                <div className={`${ind.header} text-white p-4 flex items-center justify-between`}>
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <span>{ind.icon}</span> {ind.key}
                  </h3>
                  <div className="text-right text-xs opacity-90">
                    <div>Meta total: {fmt(totalMeta)}</div>
                    <div>Real total: {fmt(totalReal)} ({pctTotal}%)</div>
                  </div>
                </div>

                {/* Tabela */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-slate-500 uppercase bg-white/60 border-b">
                      <tr>
                        <th className="p-3 text-left">Mês</th>
                        <th className="p-3 text-center">Meta (R$)</th>
                        <th className="p-3 text-center">Realizado (R$)</th>
                        <th className="p-3 text-center w-20">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {itens.length === 0
                        ? <tr><td colSpan={4} className="p-6 text-center text-slate-400 text-xs">Clique em "Inicializar" para gerar os meses.</td></tr>
                        : itens.map(item => {
                            const pct = item.meta > 0 ? ((item.realizado / item.meta) * 100).toFixed(1) : "0";
                            const numPct = parseFloat(pct);
                            let corPct = "text-slate-400";
                            if (item.meta > 0) {
                              if (ind.key === "Custos e Despesas")
                                corPct = item.realizado <= item.meta ? "text-green-600 font-bold" : "text-red-600 font-bold";
                              else
                                corPct = numPct >= 100 ? "text-green-600 font-bold" : numPct > 0 ? "text-yellow-600 font-bold" : "text-slate-400";
                            }
                            return (
                              <tr key={item.id} className="hover:bg-white/80 bg-white/40">
                                <td className="p-3 font-medium text-slate-700">{item.mes}</td>
                                <td className="p-2">
                                  <input type="number" step="0.01" defaultValue={item.meta}
                                    onBlur={e => atualizarKpi(item.id, "meta", e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-center focus:ring-2 focus:ring-blue-400 outline-none bg-white" />
                                </td>
                                <td className="p-2">
                                  <input type="number" step="0.01" defaultValue={item.realizado}
                                    onBlur={e => atualizarKpi(item.id, "realizado", e.target.value)}
                                    className="w-full border border-blue-200 rounded-lg px-2 py-1.5 text-xs text-center focus:ring-2 focus:ring-blue-400 outline-none bg-blue-50 text-blue-700" />
                                </td>
                                <td className={`p-3 text-center text-xs ${corPct}`}>{pct}%</td>
                              </tr>
                            );
                          })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageWrapper>
  );
}