'use client';
import { useEffect, useState } from 'react';
import { useEstrategia } from '@/hooks/useEstrategia';
import PageWrapper from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import type { KpiSetorial } from '@/types/estrategia';

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

export default function IndicadoresPage() {
  const { buscarDados, salvarDados } = useEstrategia();
  const [kpis, setKpis] = useState<KpiSetorial[]>([]);
  const [novo, setNovo] = useState({ setor: '', indicador: '', mes: 'Jan', meta: 0, realizado: 0 });

  useEffect(() => {
    buscarDados<KpiSetorial[]>('kpis-setoriais').then(d => d && setKpis(d));
  }, []);

  const setores = [...new Set(kpis.map(k => k.setor))];

  async function adicionar() {
    if (!novo.setor || !novo.indicador) return;
    await salvarDados('kpis-setoriais', novo);
    const d = await buscarDados<KpiSetorial[]>('kpis-setoriais');
    if (d) setKpis(d);
    setNovo({ ...novo, indicador: '', meta: 0, realizado: 0 });
  }

  return (
    <PageWrapper>
      <Card>
        <h3 className="font-bold text-slate-800 mb-3">Adicionar KPI Setorial</h3>
        <div className="flex gap-3 flex-wrap">
          <input
            placeholder="Setor (ex: Comercial)"
            value={novo.setor}
            onChange={e => setNovo({ ...novo, setor: e.target.value })}
            className="flex-1 min-w-32 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
          />
          <input
            placeholder="Indicador"
            value={novo.indicador}
            onChange={e => setNovo({ ...novo, indicador: e.target.value })}
            className="flex-1 min-w-32 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
          />
          <select
            value={novo.mes}
            onChange={e => setNovo({ ...novo, mes: e.target.value })}
            className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
          >
            {MESES.map(m => <option key={m}>{m}</option>)}
          </select>
          <input
            type="number"
            placeholder="Meta"
            value={novo.meta || ''}
            onChange={e => setNovo({ ...novo, meta: Number(e.target.value) })}
            className="w-24 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
          />
          <button onClick={adicionar} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl">
            +
          </button>
        </div>
      </Card>

      {setores.map(setor => (
        <Card key={setor}>
          <h3 className="font-bold text-slate-800 mb-3">{setor}</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Indicador', 'Mês', 'Meta', 'Realizado', '%'].map(h => (
                  <th key={h} className="text-left py-2 px-2 text-xs font-black text-slate-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kpis.filter(k => k.setor === setor).map(k => {
                const pct = k.meta > 0 ? Math.round((k.realizado / k.meta) * 100) : 0;
                return (
                  <tr key={k.id} className="border-b border-slate-50">
                    <td className="py-2 px-2">{k.indicador}</td>
                    <td className="py-2 px-2">{k.mes}</td>
                    <td className="py-2 px-2">{k.meta}</td>
                    <td className="py-2 px-2">{k.realizado}</td>
                    <td className="py-2 px-2">
                      <span className={`text-xs font-bold ${
                        pct >= 100 ? 'text-green-600' : pct >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {pct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      ))}

      {setores.length === 0 && (
        <div className="text-center text-slate-400 py-12">Nenhum KPI setorial cadastrado ainda.</div>
      )}
    </PageWrapper>
  );
}