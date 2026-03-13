// Arquivo: validators.ts
// Caminho: frontend/src/lib/

/**
 * Funções para validar se os dados inseridos pelo utilizador estão corretos
 * antes de enviar para o banco de dados.
 */

// Verifica se um e-mail é válido
export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Verifica se um CNPJ tem o formato básico (apenas números e tamanho)
export const validarCNPJ = (cnpj: string): boolean => {
  const limpo = cnpj.replace(/\D/g, "");
  return limpo.length === 14;
};

// Valida se um campo obrigatório não está apenas com espaços vazios
export const campoPreenchido = (valor: string): boolean => {
  return valor.trim().length > 0;
};

// Valida se o valor é um número positivo (útil para faturamento e metas)
export const valorPositivo = (valor: number): boolean => {
  return !isNaN(valor) && valor >= 0;
};