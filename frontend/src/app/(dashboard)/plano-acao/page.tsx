"use client";

import { useState, useEffect } from "react";
import PageWrapper from "@/components/layout/PageWrapper";

interface DiretrizItem {
  id: number;
  macro_area: string;
  sub_area: string;
  acao: string;
  status: string;
}

export default function PlanoAcaoPage() {
  const [itens, setItens] = useState<DiretrizItem[]>([]);
  const [macroArea, setMacroArea] = useState("VENDAS");
  const [subArea, setSubArea] = useState("");
  const [acao, setAcao] = useState("");

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    const r = await fetch("/api/estrategia/diretrizes");
    setItens(await r.json());
  }

  async function adicionar() {
    if (!subArea.trim() || !acao.trim()) { alert("Preencha a subárea e a ação."); return; }
    await fetch("/api/estrategia/diretrizes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ macro_area: macroArea, sub_area: subArea, acao }),
    });
    setSubArea(""); setAcao("");
    carregar();
  }

  async function alterarStatus(id: number, status: string) {
    await fetch("/api/estrategia/diretrizes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    carregar();
  }

  async function deletar(id: number) {
    if (!confirm("Remover esta ação?")) return;
    await fetch(`/api/estrategia/diretrizes?id=${id}`, { method: "DELETE" });
    carregar();
  }

  // Agrupa por macro_area > sub_area
  function getSubAreas(macro: string) {
    const filtrado = itens.filter(i => i.macro_area === macro);
    const grupos: Record<string, DiretrizItem[]> = {};
    filtrado.forEach(i => {
      if (!grupos[i.sub_area]) grupos[i.sub_area] = [];
      grupos[i.sub_area].push(i);
    });
    return grupos;
  }

  const colunas = [
    { key: "VENDAS",  icon: "📊", color: "blue"  },
    { key: "PESSOAS", icon: "👥", color: "purple" },
  ] as const;

  const colorMap = {
    blue:   { header: "bg-blue-600",   badge: "bg-blue-50 border-blue-200",   title: "text-blue-800",  check: "text-blue-500",  btn: "hover:bg-blue-50" },
    purple: { header: "bg-purple-600", badge: "bg-purple-50 border-purple-200", title: "text-purple-800", check: "text-purple-500", btn: "hover:bg-purple-50" },
  };

  return (
    <PageWrapper>
      {/* ──────── Formulário ──────── */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
          <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">🎯</span>
          Adicionar Nova Ação
        </h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Macroárea</label>
            <select value={macroArea} onChange={e => setMacroArea(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-400">
              <option value="VENDAS">📊 VENDAS</option>
              <option value="PESSOAS">👥 PESSOAS</option>
            </select>
          </div>
          <div className="w-52">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Subárea</label>
            <input type="text" value={subArea} onChange={e => setSubArea(e.target.value)}
              placeholder="Ex: Prospecção Ativa"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="flex-1 min-w-64">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Ação / Tarefa</label>
            <input type="text" value={acao} onChange={e => setAcao(e.target.value)}
              placeholder="Descreva a ação estratégica..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <button onClick={adicionar}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition h-[38px]">
            + Adicionar
          </button>
        </div>
      </section>

      {/* ──────── Colunas VENDAS / PESSOAS ──────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {colunas.map(col => {
          const grupos = getSubAreas(col.key);
          const cls = colorMap[col.color];
          const temItens = Object.keys(grupos).length > 0;

          return (
            <div key={col.key} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className={`${cls.header} text-white p-4 flex items-center gap-3`}>
                <span className="text-2xl">{col.icon}</span>
                <div>
                  <h3 className="font-black text-base tracking-wide">{col.key}</h3>
                  <p className="text-xs opacity-80">
                    {itens.filter(i => i.macro_area === col.key).length} ações ·{" "}
                    {itens.filter(i => i.macro_area === col.key && i.status === "Concluído").length} concluídas
                  </p>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-5 space-y-4">
                {!temItens
                  ? <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                      Nenhuma ação cadastrada para {col.key}.<br/>
                      <span className="text-xs">Use o formulário acima.</span>
                    </div>
                  : Object.entries(grupos).map(([sub, acoes]) => (
                      <div key={sub} className={`border ${cls.badge.split(" ")[1]} rounded-xl p-4`}>
                        <h5 className={`font-bold text-xs uppercase tracking-wider mb-3 pb-2 border-b ${cls.badge.split(" ")[1]} ${cls.title}`}>
                          {sub}
                        </h5>
                        <ul className="space-y-2">
                          {acoes.map(item => {
                            const concluido = item.status === "Concluído";
                            return (
                              <li key={item.id} className="flex items-start gap-2">
                                <button
                                  onClick={() => alterarStatus(item.id, concluido ? "Pendente" : "Concluído")}
                                  className={`mt-0.5 text-xl flex-shrink-0 transition ${concluido ? cls.check : "text-slate-200 hover:" + cls.check.replace("text-","").split("-").join("-")}`}
                                  title={concluido ? "Reabrir" : "Concluir"}>
                                  {concluido ? "✅" : "⭕"}
                                </button>
                                <span className={`text-sm flex-1 ${concluido ? "line-through text-slate-400" : "text-slate-700"}`}>
                                  {item.acao}
                                </span>
                                <button onClick={() => deletar(item.id)} className="text-slate-200 hover:text-red-500 transition text-xs flex-shrink-0 mt-0.5">
                                  🗑
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))
                }
              </div>
            </div>
          );
        })}
      </div>
    </PageWrapper>
  );
}