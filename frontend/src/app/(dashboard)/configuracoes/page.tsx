'use client';

import { useEffect, useState } from 'react';
import { useConfiguracoes } from '@/hooks/useConfiguracoes';
import { useAppStore } from '@/store/useAppStore';
import { useToastStore } from '@/store/useToastStore';
import PageWrapper from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/card';
import { ColorPicker } from '@/components/configuracoes/ColorPicker';
import type { Configuracoes } from '@/types/configuracoes';

export default function ConfiguracoesPage() {
  const { loading, carregarConfig, atualizarConfig } = useConfiguracoes();
  const store = useAppStore();
  const adicionarToast = useToastStore(s => s.adicionarToast);
  const [form, setForm] = useState<Partial<Configuracoes>>({});
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarConfig().then(d => {
      if (d) setForm(d);
    });
  }, []);

  // Preview em tempo real — aplica as CSS variables sem salvar
  useEffect(() => {
    if (form.cor_primaria) document.documentElement.style.setProperty('--cor-primaria', form.cor_primaria);
    if (form.cor_secundaria) document.documentElement.style.setProperty('--cor-secundaria', form.cor_secundaria);
  }, [form.cor_primaria, form.cor_secundaria]);

  async function salvar() {
    setSalvando(true);
    const ok = await atualizarConfig(form);
    setSalvando(false);
    adicionarToast(ok ? 'Configurações salvas!' : 'Erro ao salvar.', ok ? 'success' : 'error');
  }

  if (loading) return <PageWrapper><div className="text-slate-400 text-center py-16">Carregando...</div></PageWrapper>;

  return (
    <PageWrapper maxWidth="4xl">
      <Card>
        <h3 className="font-bold text-slate-800 mb-6">Identidade da Empresa</h3>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Nome da empresa</label>
            <input value={form.nome_empresa || ''} onChange={e => setForm({ ...form, nome_empresa: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ColorPicker label="Cor Primária (Sidebar)"
              corAtual={form.cor_primaria || '#1C3D5A'}
              onChange={c => setForm({ ...form, cor_primaria: c })} />
            <ColorPicker label="Cor Secundária (Botões / Destaques)"
              corAtual={form.cor_secundaria || '#2563eb'}
              onChange={c => setForm({ ...form, cor_secundaria: c })} />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Conta Asaas padrão</label>
            <select value={form.conta_asaas_ativa || 1}
              onChange={e => setForm({ ...form, conta_asaas_ativa: Number(e.target.value) as 1 | 2 })}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-blue-500">
              <option value={1}>Conta 1 — Principal</option>
              <option value={2}>Conta 2 — Secundária</option>
            </select>
          </div>

          <button onClick={salvar} disabled={salvando}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-all">
            {salvando ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </Card>
    </PageWrapper>
  );
}