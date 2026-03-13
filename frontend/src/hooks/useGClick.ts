import { useState } from 'react';
import type { TarefaGClick, ClienteGClick, FiltroTarefasGClick } from '@/types/gclick';

export function useGClick() {
  const [tarefas, setTarefas] = useState<TarefaGClick[]>([]);
  const [clientes, setClientes] = useState<ClienteGClick[]>([]);
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const buscarTarefas = async (params: Partial<FiltroTarefasGClick> = {}) => {
    setLoading(true);
    setErro(null);
    try {
      const query = new URLSearchParams(
        // Remove chaves com valor undefined/null/vazio
        Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
        ) as Record<string, string>
      ).toString();

      const res = await fetch(`/api/gclick/tarefas${query ? `?${query}` : ''}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Erro ${res.status}`);
      }
      const data = await res.json();
      // FastAPI retorna array direto via response_model=List[TarefaGClick]
      setTarefas(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErro(e.message);
      setTarefas([]);
    } finally {
      setLoading(false);
    }
  };

  const buscarClientes = async (page = 0, size = 50, busca?: string) => {
    setLoading(true);
    setErro(null);
    try {
      const params = new URLSearchParams({ page: String(page), size: String(size) });
      if (busca) params.set('busca', busca);

      const res = await fetch(`/api/gclick/clientes?${params}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Erro ${res.status}`);
      }
      const data = await res.json();

      // CORRIGIDO: API retorna { clientes, total, totalPages, page } — não um array direto
      // Antes: Array.isArray(data) era false → clientes sempre ficava []
      if (data && Array.isArray(data.clientes)) {
        setClientes(data.clientes);
        setTotalClientes(data.total ?? data.clientes.length);
        setTotalPaginas(data.totalPages ?? 1);
      } else if (Array.isArray(data)) {
        // Fallback caso a API mude para array direto
        setClientes(data);
        setTotalClientes(data.length);
        setTotalPaginas(1);
      } else {
        setClientes([]);
      }
    } catch (e: any) {
      setErro(e.message);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const deletarCliente = async (clienteId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/gclick/clientes/${clienteId}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Erro ${res.status}`);
      }
      return true;
    } catch (e: any) {
      setErro(e.message);
      return false;
    }
  };

  const criarCliente = async (dados: Partial<ClienteGClick>): Promise<boolean> => {
    try {
      const res = await fetch('/api/gclick/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Erro ${res.status}`);
      }
      return true;
    } catch (e: any) {
      setErro(e.message);
      return false;
    }
  };

  const concluirTarefa = async (tarefaId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/gclick/tarefas/${tarefaId}/concluir`, { method: 'PUT' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Erro ${res.status}`);
      }
      return true;
    } catch (e: any) {
      setErro(e.message);
      return false;
    }
  };

  return {
    tarefas,
    clientes,
    totalClientes,
    totalPaginas,
    loading,
    erro,
    buscarTarefas,
    buscarClientes,
    deletarCliente,
    criarCliente,
    concluirTarefa,
  };
}