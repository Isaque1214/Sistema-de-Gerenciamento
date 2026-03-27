import { useState } from 'react';
import type { MetricasZappy } from '@/types/zappy';

export function useZappy() {
  const [metricas, setMetricas] = useState<MetricasZappy>({
    Total_Absoluto: 0,
    Colaboradores: 0,
    Mensagens_Por_Colaborador: 0,
    Total_Jupiter: 0,
    Total_Outras_Conexoes: 0,
    Tempo_Primeira_Resposta_seg: 0,
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const buscarMetricas = async () => {
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data = await res.json();
      if (data.zappy) setMetricas(data.zappy);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { metricas, loading, erro, buscarMetricas };
}