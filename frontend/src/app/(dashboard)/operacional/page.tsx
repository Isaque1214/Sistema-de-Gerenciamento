'use client';

import { useEffect, useState } from 'react';
import { useZappy } from '@/hooks/useZappy';
import { useEstrategia } from '@/hooks/useEstrategia';
import PageWrapper from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { FaturamentoChart } from '@/components/charts/FaturamentoChart';
import { ZappyCard } from '@/components/operacional/ZappyCard';
import { GclickCard } from '@/components/operacional/GclickCard';
import type { KpiItem } from '@/types/estrategia';

interface MetaGclick {
  id: number;
  obrigacao: string;
  valor_atual: number;
  meta_percentual: number;
}

interface DashboardData {
  gclick: MetaGclick[];
  zappy: { Total_Absoluto: number; Colaboradores: number; Mensagens_Por_Colaborador: number } | null;
  ultima_sincronizacao: string | null;
}

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

export default function OperacionalPage() {
  const { metricas, buscarMetricas } = useZappy();
  const { buscarDados } = useEstrategia();
  const [gclick, setGclick] = useState<MetaGclick[]>([]);
  const [kpis, setKpis] = useState<KpiItem[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      await Promise.all([
        buscarMetricas(),
        fetch('/api/dashboard')
          .then(r => r.json())
          .then((d: DashboardData) => setGclick(d.gclick ?? []))
          .catch(() => {}),
        buscarDados<KpiItem[]>('kpis')
          .then(d => setKpis(d ?? [])),
      ]);
      setCarregando(false);
    }
    carregarDados();
  }, []);

  const dadosGrafico = MESES.map(mes => {
    const fat = kpis.find(k => k.indicador === 'Faturamento' && k.mes === mes);
    return { mes, meta: fat?.meta ?? 0, realizado: fat?.realizado ?? 0 };
  });

  return (
    <PageWrapper>
      {/* Cards G-Click */}
      <div>
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">
          Obrigações G-Click
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {carregando ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse h-28" />
            ))
          ) : gclick.length === 0 ? (
            <div className="col-span-3 text-center text-slate-400 py-8 text-sm border border-dashed border-slate-200 rounded-xl">
              Nenhum dado. Clique em sincronizar no topo da página.
            </div>
          ) : gclick.map(item => (
            <GclickCard
              key={item.id}
              obrigacao={item.obrigacao}
              percentual={item.valor_atual}
            />
          ))}
        </div>
      </div>

      {/* Zappy */}
      <Card>
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">
          Atendimento Zappy
        </h3>
        <ZappyCard
          totalMensagens={metricas.Total_Absoluto}
          colaboradores={metricas.Colaboradores}
          mediaPorAtendente={metricas.Mensagens_Por_Colaborador}
        />
      </Card>

      {/* Gráfico */}
      <Card>
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">
          Faturamento Anual
        </h3>
        <FaturamentoChart dados={dadosGrafico} />
      </Card>
    </PageWrapper>
  );
}