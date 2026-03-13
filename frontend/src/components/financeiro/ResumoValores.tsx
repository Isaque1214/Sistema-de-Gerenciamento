import { DollarSign, TrendingUp } from 'lucide-react';
import { formatarMoeda } from '@/lib/formatters';

interface ResumoProps { faturado: number; recebido: number; }

export function ResumoValores({ faturado, recebido }: ResumoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-blue-500 mb-2">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-wider">Total Faturado</span>
        </div>
        <p className="text-4xl font-black text-blue-700">{formatarMoeda(faturado)}</p>
      </div>
      <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-green-500 mb-2">
          <DollarSign className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-wider">Total Recebido</span>
        </div>
        <p className="text-4xl font-black text-green-700">{formatarMoeda(recebido)}</p>
      </div>
    </div>
  );
}