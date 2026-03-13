export interface ResumoFinanceiro {
  total_recebido: number;
  total_faturado: number;
}

export interface CobrancaDetalhe {
  id: string;
  vencimento: string;
  valor: number;
  link?: string | null; // PIX e transferências não têm link
  status?: string;
}

export interface Inadimplente {
  id: string;
  nome: string;
  total_valor: number;
  qtd: number;
  cobrancas: CobrancaDetalhe[];
}

export interface CobrancaAsaas {
  id: string;
  cliente_id?: string | null;
  valor: number;
  vencimento?: string | null;
  status?: string | null;
  link?: string | null;
  descricao?: string | null;
  data_pagamento?: string | null;
}

export interface ClienteAsaas {
  id: string;
  nome?: string | null;
  email?: string | null;
  cpf_cnpj?: string | null;
  telefone?: string | null;
  ativo: boolean;
}