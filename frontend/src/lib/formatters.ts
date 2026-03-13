// Arquivo: formatters.ts
// Caminho: frontend/src/lib/

/**
 * Este ficheiro contém funções para formatar dados em todo o sistema.
 * Segue o padrão de Moeda Brasileira (R$) e Datas (DD/MM/AAAA).
 */

// Formata números para o padrão de moeda: R$ 1.250,00
export const formatarMoeda = (valor: number | string): string => {
  const n = typeof valor === "string" ? parseFloat(valor) : valor;
  if (isNaN(n)) return "R$ 0,00";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(n);
};

// Formata datas ISO (2026-03-01) para o padrão brasileiro: 01/03/2026
export const formatarData = (data: string | Date): string => {
  if (!data) return "-";
  
  const d = typeof data === "string" ? new Date(data) : data;
  if (isNaN(d.getTime())) return String(data);

  return d.toLocaleDateString("pt-BR");
};

// Formata números com casas decimais fixas (ex: 95.5%)
export const formatarPercentual = (valor: number): string => {
  return `${valor.toFixed(1)}%`;
};

// Abrevia nomes de meses (ex: Janeiro -> Jan)
export const abreviarMes = (mes: string): string => {
  const meses: Record<string, string> = {
    "Janeiro": "Jan", "Fevereiro": "Fev", "Março": "Mar", "Abril": "Abr",
    "Maio": "Mai", "Junho": "Jun", "Julho": "Jul", "Agosto": "Ago",
    "Setembro": "Set", "Outubro": "Out", "Novembro": "Nov", "Dezembro": "Dez"
  };
  return meses[mes] || mes.substring(0, 3);
};