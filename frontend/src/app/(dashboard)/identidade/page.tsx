"use client";

import { useState, useEffect } from "react";
import PageWrapper from "@/components/layout/PageWrapper";

// ---- Tipos ----
interface SwotItem { id: number; categoria: string; descricao: string; }
interface Risco { id: number; risco: string; probabilidade: string; medidas_redutoras: string; medidas_exposicao: string; }

const PROB_CLASSES: Record<string, string> = {
  Alta: "bg-red-100 text-red-800",
  Média: "bg-yellow-100 text-yellow-800",
  Baixa: "bg-green-100 text-green-800",
};

export default function IdentidadePage() {
  // Identidade
  const [missao, setMissao] = useState("");
  const [visao, setVisao] = useState("");
  const [valores, setValores] = useState("");
  const [msgIdent, setMsgIdent] = useState("");

  // SWOT
  const [swotItens, setSwotItens] = useState<SwotItem[]>([]);
  const [swotCategoria, setSwotCategoria] = useState("Força");
  const [swotDescricao, setSwotDescricao] = useState("");

  // Riscos
  const [riscos, setRiscos] = useState<Risco[]>([]);
  const [riscoNome, setRiscoNome] = useState("");
  const [riscoProb, setRiscoProb] = useState("Baixa");
  const [riscoRedutoras, setRiscoRedutoras] = useState("");
  const [riscoExposicao, setRiscoExposicao] = useState("");
  const [msgRisco, setMsgRisco] = useState("");
  const [loadingRisco, setLoadingRisco] = useState(false);

  // ---- Carregamento inicial ----
  useEffect(() => {
    fetch("/api/estrategia/identidade").then(r => r.json()).then(d => {
      setMissao(d.missao || "");
      setVisao(d.visao || "");
      setValores(d.valores || "");
    });
    carregarSwot();
    carregarRiscos();
  }, []);

  // ---- Identidade ----
  async function salvarIdentidade(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/estrategia/identidade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ missao, visao, valores }),
    });
    setMsgIdent("Salvo com sucesso!");
    setTimeout(() => setMsgIdent(""), 3000);
  }

  // ---- SWOT ----
  async function carregarSwot() {
    const r = await fetch("/api/estrategia/swot");
    setSwotItens(await r.json());
  }
  async function adicionarSwot() {
    if (!swotDescricao.trim()) return;
    await fetch("/api/estrategia/swot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoria: swotCategoria, descricao: swotDescricao }),
    });
    setSwotDescricao("");
    carregarSwot();
  }
  async function deletarSwot(id: number) {
    await fetch(`/api/estrategia/swot?id=${id}`, { method: "DELETE" });
    carregarSwot();
  }

  // ---- Riscos ----
  async function carregarRiscos() {
    const r = await fetch("/api/estrategia/riscos");
    setRiscos(await r.json());
  }
  async function adicionarRisco() {
    if (!riscoNome.trim() || !riscoRedutoras.trim() || !riscoExposicao.trim()) {
      setMsgRisco("error:Preencha todos os campos obrigatórios.");
      return;
    }
    setLoadingRisco(true);
    const res = await fetch("/api/estrategia/riscos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        risco: riscoNome,
        probabilidade: riscoProb,
        medidas_redutoras: riscoRedutoras,
        medidas_exposicao: riscoExposicao,
      }),
    });
    setLoadingRisco(false);
    if (res.ok) {
      setRiscoNome(""); setRiscoRedutoras(""); setRiscoExposicao("");
      setMsgRisco("ok:Risco salvo com sucesso!");
      setTimeout(() => setMsgRisco(""), 3000);
      carregarRiscos();
    } else {
      setMsgRisco("error:Erro ao salvar risco.");
    }
  }
  async function deletarRisco(id: number) {
    if (!confirm("Remover este risco?")) return;
    await fetch(`/api/estrategia/riscos?id=${id}`, { method: "DELETE" });
    carregarRiscos();
  }

  // ---- Helpers SWOT ----
  const swotConfig = [
    { key: "Força",       label: "Forças",       icon: "↑", border: "border-green-200",  bg: "bg-green-50",   text: "text-green-800" },
    { key: "Fraqueza",    label: "Fraquezas",    icon: "↓", border: "border-red-200",    bg: "bg-red-50",     text: "text-red-800"   },
    { key: "Oportunidade",label: "Oportunidades",icon: "◎", border: "border-blue-200",   bg: "bg-blue-50",    text: "text-blue-800"  },
    { key: "Ameaça",      label: "Ameaças",      icon: "⚠", border: "border-orange-200", bg: "bg-orange-50",  text: "text-orange-800"},
  ];
  const swotFiltrado = (cat: string) => swotItens.filter(i => i.categoria === cat);
  const [msgRiscoTipo, msgRiscoTexto] = msgRisco.split(":");

  return (
    <PageWrapper>
      {/* ──────────── IDENTIDADE ──────────── */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-5">
          <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">🏢</span>
          Identidade Organizacional 2026
        </h2>
        <form onSubmit={salvarIdentidade}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <label className="block text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">🚀 Missão</label>
              <textarea rows={5} value={missao} onChange={e => setMissao(e.target.value)}
                placeholder="Por que a empresa existe?"
                className="w-full bg-white border border-blue-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
            </div>
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
              <label className="block text-xs font-bold text-indigo-700 uppercase tracking-wide mb-2">👁 Visão</label>
              <textarea rows={5} value={visao} onChange={e => setVisao(e.target.value)}
                placeholder="Onde a empresa quer chegar?"
                className="w-full bg-white border border-indigo-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <label className="block text-xs font-bold text-purple-700 uppercase tracking-wide mb-2">💎 Valores</label>
              <textarea rows={5} value={valores} onChange={e => setValores(e.target.value)}
                placeholder="Princípios que guiam a empresa (um por linha)"
                className="w-full bg-white border border-purple-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-purple-400 resize-none" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            {msgIdent && <span className="text-sm text-green-600 font-medium">✓ {msgIdent}</span>}
            <button type="submit"
              className="bg-blue-600 text-white px-7 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm">
              Salvar Identidade
            </button>
          </div>
        </form>
      </section>

      {/* ──────────── SWOT ──────────── */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-5">
          <span className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-sm">⊞</span>
          Matriz SWOT
        </h2>

        {/* Formulário de adição */}
        <div className="flex flex-wrap gap-3 items-end bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
          <div className="w-40">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Categoria</label>
            <select value={swotCategoria} onChange={e => setSwotCategoria(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-400">
              <option>Força</option>
              <option>Fraqueza</option>
              <option>Oportunidade</option>
              <option>Ameaça</option>
            </select>
          </div>
          <div className="flex-1 min-w-52">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Descrição do Fator</label>
            <input type="text" value={swotDescricao} onChange={e => setSwotDescricao(e.target.value)}
              onKeyDown={e => e.key === "Enter" && adicionarSwot()}
              placeholder="Descreva o fator..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <button onClick={adicionarSwot}
            className="bg-slate-800 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-slate-700 transition h-[38px]">
            + Adicionar
          </button>
        </div>

        {/* Grid SWOT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {swotConfig.map(cfg => (
            <div key={cfg.key} className={`border-2 ${cfg.border} ${cfg.bg} rounded-xl p-4`}>
              <h4 className={`font-bold text-sm uppercase tracking-wide mb-3 ${cfg.text}`}>
                {cfg.icon} {cfg.label}
              </h4>
              {swotFiltrado(cfg.key).length === 0
                ? <p className={`text-xs italic ${cfg.text} opacity-60`}>Nenhum item cadastrado.</p>
                : <ul className="space-y-1.5">
                    {swotFiltrado(cfg.key).map(item => (
                      <li key={item.id} className="flex items-center justify-between bg-white/60 px-3 py-1.5 rounded-lg">
                        <span className={`text-sm flex-1 pr-2 ${cfg.text}`}>{item.descricao}</span>
                        <button onClick={() => deletarSwot(item.id)} className="text-red-400 hover:text-red-600 text-xs flex-shrink-0">✕</button>
                      </li>
                    ))}
                  </ul>
              }
            </div>
          ))}
        </div>
      </section>

      {/* ──────────── RISCOS ──────────── */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-5">
          <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-sm">🛡</span>
          Matriz de Riscos
        </h2>

        {/* Formulário de risco */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
          <h4 className="text-sm font-semibold text-slate-700 mb-4">Cadastrar Novo Risco</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Risco Mapeado *</label>
              <input type="text" value={riscoNome} onChange={e => setRiscoNome(e.target.value)}
                placeholder="Ex: Perda de clientes estratégicos"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Probabilidade *</label>
              <select value={riscoProb} onChange={e => setRiscoProb(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-400">
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Medidas Redutoras — Prevenção *</label>
              <textarea rows={3} value={riscoRedutoras} onChange={e => setRiscoRedutoras(e.target.value)}
                placeholder="O que fazer para evitar que este risco aconteça?"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Medidas após Exposição — Contingência *</label>
              <textarea rows={3} value={riscoExposicao} onChange={e => setRiscoExposicao(e.target.value)}
                placeholder="O que fazer se o risco se concretizar?"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
            </div>
          </div>
          {msgRisco && (
            <div className={`text-sm font-medium p-2 rounded-lg mb-3 text-center ${msgRiscoTipo === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {msgRiscoTexto}
            </div>
          )}
          <div className="flex justify-end">
            <button onClick={adicionarRisco} disabled={loadingRisco}
              className="bg-slate-800 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-slate-700 transition disabled:opacity-60">
              {loadingRisco ? "Salvando..." : "+ Salvar Risco"}
            </button>
          </div>
        </div>

        {/* Tabela de riscos */}
        {riscos.length === 0
          ? <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
              Nenhum risco cadastrado ainda.
            </div>
          : <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="p-4 w-1/5">Risco</th>
                    <th className="p-4 w-28">Probabilidade</th>
                    <th className="p-4">Medidas Redutoras</th>
                    <th className="p-4">Medidas Após Exposição</th>
                    <th className="p-4 w-16 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {riscos.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 align-top">
                      <td className="p-4 font-semibold">{r.risco}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${PROB_CLASSES[r.probabilidade] || "bg-slate-100 text-slate-700"}`}>
                          {r.probabilidade}
                        </span>
                      </td>
                      <td className="p-4 text-xs whitespace-pre-line">{r.medidas_redutoras}</td>
                      <td className="p-4 text-xs whitespace-pre-line">{r.medidas_exposicao}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => deletarRisco(r.id)} className="text-red-500 hover:text-red-700">🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        }
      </section>
    </PageWrapper>
  );
}