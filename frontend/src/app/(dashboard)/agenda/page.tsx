"use client";

import { useState, useEffect } from "react";
import PageWrapper from "@/components/layout/PageWrapper";

interface AgendaItem {
  id: number;
  evento: string;
  data_evento: string;
  tipo: string;
}

const COR_TIPO: Record<string, { badge: string; ponto: string; icon: string }> = {
  Campanha: { badge: "bg-green-100 text-green-800",   ponto: "#22c55e", icon: "📣" },
  Projeto:  { badge: "bg-blue-100 text-blue-800",     ponto: "#3b82f6", icon: "🚀" },
  Evento:   { badge: "bg-purple-100 text-purple-800", ponto: "#a855f7", icon: "🎯" },
  Marco:    { badge: "bg-yellow-100 text-yellow-800", ponto: "#eab308", icon: "🏆" },
};

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

function formatarData(iso: string) {
  const [ano, mes, dia] = iso.split("T")[0].split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function AgendaPage() {
  const [eventos, setEventos] = useState<AgendaItem[]>([]);
  const [nomeEvento, setNomeEvento] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [tipoEvento, setTipoEvento] = useState("Campanha");
  const [msgEvento, setMsgEvento] = useState("");

  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());

  useEffect(() => { carregarEventos(); }, []);

  async function carregarEventos() {
    const r = await fetch("/api/estrategia/agenda");
    setEventos(await r.json());
  }

  async function adicionarEvento() {
    if (!dataEvento || !nomeEvento.trim()) {
      setMsgEvento("error:Preencha a data e o nome do evento.");
      return;
    }
    const res = await fetch("/api/estrategia/agenda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ evento: nomeEvento, data_evento: dataEvento, tipo: tipoEvento }),
    });
    if (res.ok) {
      setNomeEvento(""); setDataEvento("");
      setMsgEvento("ok:Evento adicionado!");
      setTimeout(() => setMsgEvento(""), 2500);
      carregarEventos();
    }
  }

  async function deletarEvento(id: number) {
    await fetch(`/api/estrategia/agenda?id=${id}`, { method: "DELETE" });
    carregarEventos();
  }

  // ── Calendário ──
  function navegarMes(delta: number) {
    let m = mesAtual + delta;
    let a = anoAtual;
    if (m > 11) { m = 0; a++; }
    if (m < 0)  { m = 11; a--; }
    setMesAtual(m); setAnoAtual(a);
  }

  const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
  const totalDias   = new Date(anoAtual, mesAtual + 1, 0).getDate();

  const eventosPorDia: Record<number, AgendaItem[]> = {};
  eventos.forEach(e => {
    const d = new Date(e.data_evento);
    if (d.getMonth() === mesAtual && d.getFullYear() === anoAtual) {
      const dia = d.getDate();
      if (!eventosPorDia[dia]) eventosPorDia[dia] = [];
      eventosPorDia[dia].push(e);
    }
  });

  const hojeMs = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()).getTime();

  // Próximos eventos
  const proximos = [...eventos]
    .filter(e => new Date(e.data_evento).getTime() >= hojeMs)
    .sort((a, b) => new Date(a.data_evento).getTime() - new Date(b.data_evento).getTime())
    .slice(0, 8);

  const [msgTipo, msgTexto] = msgEvento.split(":");

  return (
    <PageWrapper>
      {/* ──────── Formulário ──────── */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
          <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">📅</span>
          Nova Entrada na Agenda
        </h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Data</label>
            <input type="date" value={dataEvento} onChange={e => setDataEvento(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="flex-1 min-w-52">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nome do Evento</label>
            <input type="text" value={nomeEvento} onChange={e => setNomeEvento(e.target.value)}
              placeholder="Ex: Campanha de Captação de Clientes"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo</label>
            <select value={tipoEvento} onChange={e => setTipoEvento(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-400">
              <option>Campanha</option>
              <option>Projeto</option>
              <option>Evento</option>
              <option>Marco</option>
            </select>
          </div>
          <button onClick={adicionarEvento}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition h-[38px]">
            + Adicionar
          </button>
        </div>
        {msgEvento && (
          <div className={`mt-3 text-sm font-medium p-2 rounded-lg text-center ${msgTipo === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {msgTexto}
          </div>
        )}
      </section>

      {/* ──────── Calendário + Próximos ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-slate-800">
              {MESES[mesAtual]} {anoAtual}
            </h3>
            <div className="flex gap-1">
              <button onClick={() => navegarMes(-1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 transition text-slate-600">←</button>
              <button onClick={() => navegarMes(1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 transition text-slate-600">→</button>
            </div>
          </div>

          {/* Cabeçalho dias da semana */}
          <div className="grid grid-cols-7 mb-2">
            {["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map(d => (
              <div key={d} className="text-center text-xs font-bold text-slate-400 py-1">{d}</div>
            ))}
          </div>

          {/* Grade dos dias */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: primeiroDia }).map((_, i) => (
              <div key={`v${i}`} className="h-12 rounded-lg bg-slate-50 opacity-40" />
            ))}
            {Array.from({ length: totalDias }, (_, i) => i + 1).map(dia => {
              const diaMs = new Date(anoAtual, mesAtual, dia).getTime();
              const isHoje = diaMs === hojeMs;
              const evts = eventosPorDia[dia] || [];
              const title = evts.map(e => e.evento).join(", ");
              return (
                <div key={dia} title={title}
                  className={`h-12 rounded-lg flex flex-col items-center justify-center cursor-default transition relative
                    ${isHoje ? "bg-blue-600 shadow-lg" : evts.length > 0 ? "bg-slate-100 ring-1 ring-slate-300" : "hover:bg-slate-50"}`}>
                  <span className={`text-sm ${isHoje ? "text-white font-bold" : "text-slate-700"}`}>{dia}</span>
                  {evts.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {evts.slice(0, 3).map((e, idx) => (
                        <span key={idx} className="w-1.5 h-1.5 rounded-full"
                          style={{ background: COR_TIPO[e.tipo]?.ponto || "#94a3b8" }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legenda */}
          <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-slate-100">
            {Object.entries(COR_TIPO).map(([tipo, cfg]) => (
              <div key={tipo} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.ponto }} />
                <span className="text-xs text-slate-500">{tipo}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Próximos eventos */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Próximos Eventos</h3>
          {proximos.length === 0
            ? <p className="text-sm text-slate-400 text-center pt-4">Nenhum evento futuro.</p>
            : <div className="space-y-3">
                {proximos.map(e => {
                  const cfg = COR_TIPO[e.tipo] || COR_TIPO.Campanha;
                  const diff = Math.ceil((new Date(e.data_evento).getTime() - hojeMs) / 86400000);
                  const diffLabel = diff === 0 ? "🔴 Hoje" : diff === 1 ? "🟡 Amanhã" : `em ${diff} dias`;
                  return (
                    <div key={e.id} className="flex items-start gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                      <span className="text-lg flex-shrink-0">{cfg.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{e.evento}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{formatarData(e.data_evento)} · <span className="font-medium">{diffLabel}</span></p>
                      </div>
                    </div>
                  );
                })}
              </div>
          }
        </div>
      </div>

      {/* ──────── Tabela completa ──────── */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Todos os Eventos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide border-b border-slate-200">
              <tr>
                <th className="p-4">Data</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Evento</th>
                <th className="p-4 text-center w-20">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {eventos.length === 0
                ? <tr><td colSpan={4} className="p-8 text-center text-slate-400">Nenhum evento cadastrado.</td></tr>
                : [...eventos].sort((a, b) => new Date(a.data_evento).getTime() - new Date(b.data_evento).getTime())
                    .map(e => (
                      <tr key={e.id} className="hover:bg-slate-50">
                        <td className="p-4 font-medium text-slate-700">{formatarData(e.data_evento)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${COR_TIPO[e.tipo]?.badge || "bg-slate-100 text-slate-700"}`}>
                            {e.tipo}
                          </span>
                        </td>
                        <td className="p-4 font-medium">{e.evento}</td>
                        <td className="p-4 text-center">
                          <button onClick={() => deletarEvento(e.id)} className="text-red-500 hover:text-red-700">🗑</button>
                        </td>
                      </tr>
                    ))
              }
            </tbody>
          </table>
        </div>
      </section>
    </PageWrapper>
  );
}