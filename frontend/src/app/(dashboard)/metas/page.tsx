'use client';
import { useEffect, useState } from 'react';
import { useEstrategia } from '@/hooks/useEstrategia';
import { useToastStore } from '@/store/useToastStore';
import PageWrapper from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { formatarMoeda } from '@/lib/formatters';
import type { MetasGerais } from '@/types/estrategia';

export default function MetasPage() {
  const { buscarDados, salvarDados } = useEstrategia();
  const adicionarToast = useToastStore(s => s.adicionarToast);
  const [dados, setDados] = useState<any>(null);
  const [gerais, setGerais] = useState<MetasGerais>({ id: 1, objetivo: '', meta_faturamento: 0, meta_lucro: 0 });

  useEffect(() => {
    buscarDados<any>('metas').then(d => {
      if (d) { setDados(d); setGerais(d.gerais); }
    });
  }, []);

  async function salvarGerais() {
    const ok = await salvarDados('metas', { gerais }, 'PUT');
    adicionarToast(ok ? 'Metas salvas!' : 'Erro.', ok ? 'success' : 'error');
  }

  return (
    <PageWrapper>
      <Card>
        <h3 className="font-bold text-slate-800 mb-4">Objetivo Macro do Ciclo</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Objetivo</label>
            <textarea rows={2} value={gerais.objetivo}
              onChange={e => setGerais({ ...gerais, objetivo: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Meta Faturamento (R$)</label>
              <input type="number" value={gerais.meta_faturamento}
                onChange={e => setGerais({ ...gerais, meta_faturamento: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Meta Lucro (R$)</label>
              <input type="number" value={gerais.meta_lucro}
                onChange={e => setGerais({ ...gerais, meta_lucro: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <button onClick={salvarGerais} className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl">Salvar</button>
        </div>
      </Card>

      {dados && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="font-bold text-slate-800 mb-3">Produtos ({dados.produtos?.length ?? 0})</h3>
            {dados.produtos?.length === 0 ? <p className="text-slate-400 text-sm">Nenhum produto cadastrado.</p> : (
              <ul className="space-y-2">
                {dados.produtos?.map((p: any) => (
                  <li key={p.id} className="flex justify-between text-sm border-b border-slate-50 pb-2">
                    <span className="font-medium">{p.nome}</span>
                    <span className="text-slate-500">{formatarMoeda(p.faturamento)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card>
            <h3 className="font-bold text-slate-800 mb-3">5W2H ({dados.w2h?.length ?? 0} ações)</h3>
            {dados.w2h?.length === 0 ? <p className="text-slate-400 text-sm">Nenhuma ação cadastrada.</p> : (
              <ul className="space-y-2">
                {dados.w2h?.map((w: any) => (
                  <li key={w.id} className="text-sm border-b border-slate-50 pb-2">
                    <span className="font-medium">{w.o_que}</span>
                    <span className="text-slate-400 ml-2">— {w.quem}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      )}
    </PageWrapper>
  );
}