// Arquivo: FaturamentoChart.tsx
// Caminho: frontend/src/components/charts/

"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DadosGrafico {
  mes: string;
  meta: number;
  realizado: number;
}

export function FaturamentoChart({ dados }: { dados: DadosGrafico[] }) {
  // Se não tiver dados, mostra um aviso amigável
  if (!dados || dados.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
        Nenhum dado financeiro para exibir no gráfico.
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      {/* O ResponsiveContainer faz o gráfico se adaptar ao tamanho da tela do celular ou PC */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="mes" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(valor) => `R$ ${valor / 1000}k`} />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="meta" name="Meta (R$)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="realizado" name="Realizado (R$)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}