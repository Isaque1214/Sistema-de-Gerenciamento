'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';

interface HeaderProps { nomeEmpresa: string; }

const TITULOS: Record<string, string> = {
  '/operacional': 'Visão Operacional',
  '/gclick': 'Gestão G-Click',
  '/financeiro': 'Gestão Financeira',
  '/identidade': 'Identidade Organizacional',
  '/raio-x': 'Raio-X do Cenário Atual',
  '/metas': 'Objetivos e Metas',
  '/kpis': 'KPIs Estratégicos',
  '/indicadores': 'KPIs por Área',
  '/plano-acao': 'Plano de Ação',
  '/agenda': 'Agenda de Impacto',
  '/configuracoes': 'Configurações',
};

export default function Header({ nomeEmpresa }: HeaderProps) {
  const pathname = usePathname();
  const adicionarToast = useToastStore((s) => s.adicionarToast);
  const [ultimaSync, setUltimaSync] = useState<string | null>(null);
  const [sincronizando, setSincronizando] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetch('/api/cron/status')
      .then(r => r.json())
      .then(d => setUltimaSync(d.ultima_sincronizacao))
      .catch(() => {});

    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function sincronizarAgora() {
    setSincronizando(true);
    try {
      const res = await fetch('/api/cron/sincronizar', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        adicionarToast('Sincronização concluída!', 'success');
        setUltimaSync(data.timestamp);
      } else {
        adicionarToast('Sincronização com erros parciais.', 'warning');
      }
    } catch {
      adicionarToast('Falha ao sincronizar. Backend offline?', 'error');
    } finally {
      setSincronizando(false);
    }
  }

  const titulo = TITULOS[pathname] || 'Painel';
  const ultimaSyncFormatada = ultimaSync
    ? new Date(ultimaSync).toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit',
        hour: '2-digit', minute: '2-digit',
      })
    : null;

  return (
    <header className={`h-16 flex items-center justify-between px-8 sticky top-0 z-30 transition-all ${
      scrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm' : 'bg-slate-50'
    }`}>
      <div className="flex flex-col">
        <span
          className="text-[10px] font-black uppercase tracking-widest mb-0.5"
          style={{ color: 'var(--cor-secundaria)' }}
        >
          {nomeEmpresa}
        </span>
        <h2 className="text-lg font-extrabold text-slate-900">{titulo}</h2>
      </div>

      <div className="flex items-center gap-3">
        {ultimaSyncFormatada && (
          <span className="hidden md:block text-xs text-slate-400">
            Sync: {ultimaSyncFormatada}
          </span>
        )}
        <button
          onClick={sincronizarAgora}
          disabled={sincronizando}
          title="Sincronizar agora"
          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${sincronizando ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </header>
  );
}