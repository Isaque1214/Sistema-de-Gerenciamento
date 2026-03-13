import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  nomeEmpresa: string;
  corPrimaria: string;
  corSecundaria: string;
  logoUrl: string | null;
  contaAsaasAtiva: 1 | 2; // estava faltando — causava perda de estado entre navegações
  setNomeEmpresa: (nome: string) => void;
  setCores: (primaria: string, secundaria: string) => void;
  setLogo: (url: string | null) => void;
  setContaAsaasAtiva: (conta: 1 | 2) => void;
  setPreferencias: (prefs: Partial<Pick<AppState,
    'nomeEmpresa' | 'corPrimaria' | 'corSecundaria' | 'logoUrl' | 'contaAsaasAtiva'
  >>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      nomeEmpresa: 'EloGestão',
      corPrimaria: '#1C3D5A',
      corSecundaria: '#2563eb',
      logoUrl: null,
      contaAsaasAtiva: 1,
      setNomeEmpresa: (nome) => set({ nomeEmpresa: nome }),
      setCores: (primaria, secundaria) => set({ corPrimaria: primaria, corSecundaria: secundaria }),
      setLogo: (url) => set({ logoUrl: url }),
      setContaAsaasAtiva: (conta) => set({ contaAsaasAtiva: conta }),
      setPreferencias: (prefs) => set(prefs),
    }),
    { name: 'elogestao-storage' }
  )
);