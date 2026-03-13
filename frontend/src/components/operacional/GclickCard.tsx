interface GclickCardProps {
  obrigacao: string;
  percentual: number;
}

export function GclickCard({ obrigacao, percentual }: GclickCardProps) {
  const cor = percentual >= 90 ? 'bg-green-500' : percentual >= 60 ? 'bg-yellow-500' : 'bg-red-500';
  const corTexto = percentual >= 90 ? 'text-green-600' : percentual >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">{obrigacao}</p>
      <p className={`text-3xl font-black mb-3 ${corTexto}`}>{percentual.toFixed(1)}%</p>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all duration-500 ${cor}`}
          style={{ width: `${Math.min(percentual, 100)}%` }} />
      </div>
      <p className="text-xs text-slate-400 mt-2">Meta: 100%</p>
    </div>
  );
}