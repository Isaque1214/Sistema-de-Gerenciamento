export interface IdentidadeOrganizacional {
  id: number;
  ano: number;
  missao: string;
  visao: string;
  valores: string;
}

export interface AnaliseSwot {
  id: number;
  categoria: 'Força' | 'Fraqueza' | 'Oportunidade' | 'Ameaça';
  descricao: string;
  // sem criado_em — não existe no banco
}

export interface MatrizRisco {
  id: number;
  risco: string;
  probabilidade: 'Baixa' | 'Média' | 'Alta';
  medidas_redutoras: string;
  medidas_exposicao: string;
}

export interface RaioXVisao {
  id: number;
  faturamento: number;
  meses: number;
  clientes: number;
}

export interface RaioXProduto {
  id: number;
  nome: string;
  faturamento: number;
  vendas: number;
}

export interface MetasGerais {
  id: number;
  objetivo: string;
  meta_faturamento: number;
  meta_lucro: number;
}

export interface MetasProduto {
  id: number;
  nome: string;
  faturamento: number;
  ticket: number;
  clientes: number;
}

export interface MetasCanal {
  id: number;
  canal: string;
  meta_anual: number;
}

export interface Objetivo5W2H {
  id: number;
  o_que: string;
  quem: string;
  quando_prazo: string; // mapeia para coluna "quando" no banco via @map
  onde: string;
  como: string;
  indicador: string;
  meta: string;
  realizado: string;
}

export interface DiretrizEstrategica {
  id: number;
  macro_area: string;
  sub_area: string;
  acao: string;
  status: 'Pendente' | 'Concluído';
}

export interface AgendaImpacto {
  id: number;
  evento: string;
  data_evento: string;
  tipo: 'Campanha' | 'Evento' | 'Projeto' | 'Marco';
}

export interface KpiItem {
  id: number;
  indicador: string;
  mes: string;
  meta: number;
  realizado: number;
}

export interface KpiSetorial {
  id: number;
  setor: string;
  indicador: string;
  mes: string;
  meta: number;
  realizado: number;
}