import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import type { Configuracoes } from '@/types/configuracoes';

export function useConfiguracoes() {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const setPreferencias = useAppStore((s) => s.setPreferencias);

  const carregarConfig = async (): Promise<Configuracoes | null> => {
    setErro(null);
    try {
      const res = await fetch('/api/configuracoes');
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data: Configuracoes = await res.json();
      // Sincroniza com o store global para que Sidebar e Header reflitam imediatamente
      setPreferencias({
        nomeEmpresa: data.nome_empresa,
        corPrimaria: data.cor_primaria,
        corSecundaria: data.cor_secundaria,
        logoUrl: data.logo_url ?? null,
        contaAsaasAtiva: data.conta_asaas_ativa as 1 | 2,
      });
      return data;
    } catch (e: any) {
      setErro(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const atualizarConfig = async (dados: Partial<Configuracoes>): Promise<boolean> => {
    setErro(null);
    try {
      const res = await fetch('/api/configuracoes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      await carregarConfig(); // recarrega para manter store sincronizado
      return true;
    } catch (e: any) {
      setErro(e.message);
      return false;
    }
  };

  useEffect(() => { carregarConfig(); }, []);

  return { loading, erro, carregarConfig, atualizarConfig };
}