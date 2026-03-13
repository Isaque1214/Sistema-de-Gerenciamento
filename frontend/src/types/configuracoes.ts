// Ficheiro: configuracoes.ts
// Caminho: frontend/src/types/

/**
 * Definição das configurações globais do sistema e identidade visual.
 * Este ficheiro garante que o TypeScript reconheça a estrutura das preferências.
 */

export interface Configuracoes {
  id: number;
  nome_empresa: string;
  cor_primaria: string;
  cor_secundaria: string;
  logo_url?: string | null;
  conta_asaas_ativa: number; // Define se a conta activa é a 1 ou a 2
}