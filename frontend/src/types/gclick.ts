// Caminho: frontend/src/types/gclick.ts

export interface ClienteGClick {
  id: string;
  nome: string;
  apelido?: string;
  cnpj: string;
  tipoInscricao?: string;
  tipo?: string;
  responsavel: string;
  email?: string;
  telefone?: string;
  status?: string;
}

export interface TarefaGClick {
  id: string;
  categoria: string;
  descricao: string;
  cliente_nome: string;
  cliente_id?: string | number;
  setor: string;          // CORRIGIDO: era "departamento" — backend retorna "setor"
  competencia?: string;
  vencimento: string;
  status: string;         // Label legível: "Aberto", "Concluído", "Finalizado"...
  status_raw?: string;    // Código bruto da API: "A", "C", "F", "O"...
}

// Resposta paginada de /api/gclick/clientes
export interface ClientesResponse {
  clientes: ClienteGClick[];
  total: number;
  totalPages: number;
  page: number;
}

// Parâmetros de filtro para /api/gclick/tarefas
export interface FiltroTarefasGClick {
  pendentes?: 'true' | 'false';          // "true" = só pendentes (padrão)
  categoria?: string;                     // "Obrigacao" | "Cobranca" | "CertificadoDigital" | ...
  cliente_id?: string;                    // ID do cliente
  departamento?: string;                  // Nome parcial do setor (filtro local)
  data_ini?: string;                      // Vencimento início (YYYY-MM-DD)
  data_fim?: string;                      // Vencimento fim (YYYY-MM-DD)
  dataCompetenciaInicio?: string;
  dataCompetenciaFim?: string;
}