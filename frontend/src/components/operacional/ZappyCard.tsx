import { MessageCircle, Users } from 'lucide-react';

interface ZappyProps {
  totalMensagens: number;
  colaboradores: number;
  mediaPorAtendente: number;
}

export function ZappyCard({ totalMensagens, colaboradores, mediaPorAtendente }: ZappyProps) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div>
        <div className="flex items-center gap-2 text-slate-400 mb-1">
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-wide">Total Mensagens</span>
        </div>
        <p className="text-3xl font-black text-blue-600">{totalMensagens.toLocaleString('pt-BR')}</p>
      </div>
      <div className="border-x border-slate-100 px-6">
        <div className="flex items-center gap-2 text-slate-400 mb-1">
          <Users className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-wide">Colaboradores</span>
        </div>
        <p className="text-3xl font-black text-slate-700">{colaboradores}</p>
      </div>
      <div>
        <div className="flex items-center gap-2 text-slate-400 mb-1">
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-wide">Média / Atendente</span>
        </div>
        <p className="text-3xl font-black text-slate-700">{mediaPorAtendente.toFixed(1)}</p>
      </div>
    </div>
  );
}