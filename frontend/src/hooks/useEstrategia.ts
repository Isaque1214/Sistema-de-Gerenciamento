import { useState } from 'react';

export function useEstrategia() {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const buscarDados = async <T>(endpoint: string): Promise<T | null> => {
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch(`/api/estrategia/${endpoint}`);
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      return await res.json() as T;
    } catch (e: any) {
      setErro(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const salvarDados = async (
    endpoint: string,
    dados: unknown,
    metodo: 'POST' | 'PUT' | 'DELETE' = 'POST'
  ): Promise<boolean> => {
    setErro(null);
    try {
      const res = await fetch(`/api/estrategia/${endpoint}`, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      return true;
    } catch (e: any) {
      setErro(e.message);
      return false;
    }
  };

  return { loading, erro, buscarDados, salvarDados };
}