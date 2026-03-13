import { useState } from "react";

export interface ResumoFinanceiro {
  total_recebido: number;
  total_recebido_bruto?: number;
  total_notas_emitidas?: number;
  qtd_notas_emitidas?: number;
  total_faturado?: number;
  total_vencido?: number;
  qtd_recebido?: number;
  qtd_faturado?: number;
  qtd_vencido?: number;
}

export interface CobrancaAsaas {
  id: string;
  cliente?: string;
  vencimento?: string;
  valor: number;
  valor_liquido?: number;
  status?: string;
  link?: string;
  descricao?: string;
  tipo?: string;
  data_pagamento?: string;
}

export interface CobrancaDetalhe {
  id: string;
  vencimento: string;
  valor: number;
  link: string;
  status?: string;
}

export interface Inadimplente {
  id: string;
  nome: string;
  total_valor: number;
  qtd: number;
  cobrancas: CobrancaDetalhe[];
}

const BACKEND = "http://192.168.0.17:5050";

function getMesAtual() {
  const hoje = new Date();
  const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const fim = hoje.toISOString().split("T")[0];
  return { inicio, fim };
}

export function useFinanceiro() {
  const [resumo, setResumo] = useState<ResumoFinanceiro>({
    total_recebido: 0,
    total_faturado: 0,
    total_notas_emitidas: 0,
    total_vencido: 0,
  });
  const [cobrancas, setCobrancas] = useState<CobrancaAsaas[]>([]);
  const [inadimplentes, setInadimplentes] = useState<Inadimplente[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const buscarResumo = async (inicio?: string, fim?: string, conta = 1) => {
    setLoading(true);
    setErro(null);
    try {
      const { inicio: ini, fim: f } = getMesAtual();
      const params = new URLSearchParams({
        inicio: inicio || ini,
        fim: fim || f,
        conta: String(conta),
      });
      const res = await fetch(`${BACKEND}/api/financeiro/resumo?${params}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Erro ao buscar resumo");
      }
      const data: ResumoFinanceiro = await res.json();
      setResumo(data);
      return data;
    } catch (error: any) {
      console.error("Erro Financeiro Resumo:", error);
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  const buscarCobrancas = async (
    filtros: { inicio?: string; fim?: string; status?: string } = {},
    conta = 1
  ) => {
    setLoading(true);
    setErro(null);
    try {
      const { inicio: ini, fim: f } = getMesAtual();
      const params = new URLSearchParams({
        inicio: filtros.inicio || ini,
        fim: filtros.fim || f,
        conta: String(conta),
      });
      if (filtros.status) params.append("status", filtros.status);

      const res = await fetch(`${BACKEND}/api/financeiro/cobrancas?${params}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Erro ao buscar cobranças");
      }
      const data: CobrancaAsaas[] = await res.json();
      setCobrancas(data);
      return data;
    } catch (error: any) {
      console.error("Erro Cobranças:", error);
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  const buscarInadimplentes = async (conta = 1) => {
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch(
        `${BACKEND}/api/financeiro/inadimplentes?conta=${conta}`
      );
      if (!res.ok) throw new Error("Erro ao buscar inadimplentes");
      const data: Inadimplente[] = await res.json();
      setInadimplentes(data);
      return data;
    } catch (error: any) {
      console.error("Erro Inadimplentes:", error);
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    resumo,
    cobrancas,
    inadimplentes,
    loading,
    erro,
    buscarResumo,
    buscarCobrancas,
    buscarInadimplentes,
  };
}