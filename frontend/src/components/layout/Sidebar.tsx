'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, CheckSquare, Wallet, Fingerprint,
  Search, Crosshair, LineChart, PieChart, Target,
  Calendar, Settings
} from 'lucide-react';

interface SidebarProps {
  nomeEmpresa: string;
  logoUrl?: string | null;
}

export default function Sidebar({ nomeEmpresa, logoUrl }: SidebarProps) {
  const pathname = usePathname();
  const isAtivo = (p: string) => pathname === p;

  const base = 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200';
  // Usa as CSS variables injetadas pelo layout — mudam junto com as configurações
  const ativo = 'bg-[var(--cor-secundaria)]/10 text-[var(--cor-secundaria)] font-semibold';
  const inativo = 'text-slate-600 hover:bg-slate-100 hover:text-slate-900';

  const link = (href: string, icon: React.ReactNode, label: string) => (
    <li>
      <Link href={href} className={`${base} ${isAtivo(href) ? ativo : inativo}`}>
        {icon} {label}
      </Link>
    </li>
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <Link href="/operacional" className="flex items-center gap-2.5">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
          ) : (
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'var(--cor-secundaria)' }}>
              <PieChart className="text-white w-5 h-5" />
            </div>
          )}
          <h1 className="text-lg font-black text-slate-800 truncate">{nomeEmpresa}</h1>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-5 overflow-y-auto custom-scrollbar">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-3">Monitoramento</p>
          <ul className="space-y-1">
            {link('/operacional', <LayoutDashboard className="w-4 h-4" />, 'Visão Operacional')}
            {link('/gclick', <CheckSquare className="w-4 h-4" />, 'Gestão G-Click')}
            {link('/financeiro', <Wallet className="w-4 h-4" />, 'Gestão Asaas')}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-3">Estratégia</p>
          <ul className="space-y-1">
            {link('/identidade', <Fingerprint className="w-4 h-4" />, 'Identidade Org.')}
            {link('/raio-x', <Search className="w-4 h-4" />, 'Raio-X Atual')}
            {link('/metas', <Crosshair className="w-4 h-4" />, 'Objetivos e Metas')}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-3">Resultados</p>
          <ul className="space-y-1">
            {link('/kpis', <LineChart className="w-4 h-4" />, 'KPIs Estratégicos')}
            {link('/indicadores', <PieChart className="w-4 h-4" />, 'KPIs por Área')}
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-3">Execução</p>
          <ul className="space-y-1">
            {link('/plano-acao', <Target className="w-4 h-4" />, 'Plano de Ação')}
            {link('/agenda', <Calendar className="w-4 h-4" />, 'Agenda de Impacto')}
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100">
        {link('/configuracoes', <Settings className="w-4 h-4" />, 'Configurações')}
      </div>
    </aside>
  );
}