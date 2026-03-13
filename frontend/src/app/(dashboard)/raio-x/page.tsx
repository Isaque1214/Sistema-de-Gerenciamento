'use client';
import { useEffect, useState } from 'react';
import { useEstrategia } from '@/hooks/useEstrategia';
import { useToastStore } from '@/store/useToastStore';
import PageWrapper from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { formatarMoeda } from '@/lib/formatters';
import type { RaioXVisao, RaioXProduto } from '@/types/estrategia';

export default function RaioXPage() {
  const { buscarDados, salvarDados } = useEstrategia();
  const adicionarToast = useToastStore(s => s.adicionarToast);
  const [visao, setVisao] = useState<RaioXVisao>({ id: 1, faturamento: 0, meses: 12, clientes: 0 });
  const [produtos, setProdutos] = useState<RaioXProduto[]>([]);
  const [novoProduto, setNovoProduto] = useState({ nome: '', faturamento: 0, vendas: 0 });

  useEffect(() => {
    buscarDados<{ visao: RaioXVisao; produtos: RaioXProduto[] }>('raiox').then(d => {
      if (d) { setVisao(d.visao); setProdutos(d.produtos); }
    });
  }, []);

  async function salvarVisao() {
    const ok = await salvarDados('raiox', { visao }, 'PUT');
    adicionarToast(ok ? 'Raio-X salvo!' : 'Erro ao salvar.', ok ? 'success' : 'error');
  }

  async function adicionarProduto() {
    if (!novoProduto.nome.trim()) return;
    await salvarDados('raiox', novoProduto);
    const d = await buscarDados<{ visao: RaioXVisao; produtos: RaioXProduto[] }>('raiox');
    if (d) setProdutos(d.produtos);
    setNovoProduto({ nome: '', faturamento: 0, vendas: 0 });
  }

  const ticketMedio = visao.clientes > 0 ? visao.faturamento / visao.clientes / visao.meses : 0;

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Faturamento Total', valor: formatarMoeda(visao.faturamento) },
          { label: 'Clientes Ativos', valor: visao.clientes },
          { label: 'Ticket Médio/mês', valor: formatarMoeda(ticketMedio) },
        ].map(c => (
          <Card key={c.label}>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">{c.label}</p>
            <p className="text-2xl font-black text-slate-800">{c.valor}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="font-bold text-slate-800 mb-4">Dados Gerais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Faturamento (R$)', key: 'faturamento', type: 'number' },
            { label: 'Meses de referência', key: 'meses', type: 'number' },
            { label: 'Clientes ativos', key: 'clientes', type: 'number' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-bold text-slate-700 mb-1">{f.label}</label>
              <input type={f.type} value={(visao as any)[f.key]}
                onChange={e => setVisao({ ...visao, [f.key]: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500" />
            </div>
          ))}
        </div>
        <button onClick={salvarVisao} className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl">Salvar</button>
      </Card>

      <Card>
        <h3 className="font-bold text-slate-800 mb-4">Breakdown por Produto/Serviço</h3>
        <div className="flex gap-3 flex-wrap mb-4">
          <input placeholder="Nome do produto" value={novoProduto.nome} onChange={e => setNovoProduto({ ...novoProduto, nome: e.target.value })}
            className="flex-1 min-w-36 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500" />
          <input type="number" placeholder="Faturamento R$" value={novoProduto.faturamento || ''}
            onChange={e => setNovoProduto({ ...novoProduto, faturamento: Number(e.target.value) })}
            className="w-36 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500" />
          <input type="number" placeholder="Nº vendas" value={novoProduto.vendas || ''}
            onChange={e => setNovoProduto({ ...novoProduto, vendas: Number(e.target.value) })}
            className="w-28 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500" />
          <button onClick={adicionarProduto} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl">+</button>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-100">
            {['Produto', 'Faturamento', 'Vendas'].map(h => (
              <th key={h} className="text-left py-2 px-2 text-xs font-black text-slate-400 uppercase">{h}</th>
            ))}
          </tr></thead>
          <tbody>{produtos.map(p => (
            <tr key={p.id} className="border-b border-slate-50">
              <td className="py-2 px-2 font-medium">{p.nome}</td>
              <td className="py-2 px-2">{formatarMoeda(p.faturamento)}</td>
              <td className="py-2 px-2">{p.vendas}</td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </PageWrapper>
  );
}