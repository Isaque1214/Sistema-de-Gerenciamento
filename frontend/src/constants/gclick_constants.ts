// =============================================================================
// CONSTANTES G-CLICK — Dicionários com busca binária O(log n)
// =============================================================================

// ── SETORES ───────────────────────────────────────────────────────────────────
// OBRIGATÓRIO: lista em ORDEM ALFABÉTICA pelo campo "nome"
// para que a busca binária funcione corretamente.
//
// Para encontrar os IDs reais do seu G-Click, consulte:
//   GET https://api.gclick.com.br/departamentos
// e atualize os IDs abaixo conforme a resposta.
// =============================================================================
export interface SetorGClick {
  nome: string;
  id: number;
}

export const SETORES_GCLICK: SetorGClick[] = [
  { nome: "Administrativo", id: 7  },
  { nome: "Comercial",      id: 8  },
  { nome: "Contábil",       id: 1  },
  { nome: "Financeiro",     id: 5  },
  { nome: "Fiscal",         id: 2  },
  { nome: "Jurídico",       id: 10 },
  { nome: "Legalização",    id: 9  },
  { nome: "Pessoal",        id: 3  },
  { nome: "Societário",     id: 4  },
  { nome: "Tecnologia",     id: 6  },
];

/**
 * Busca binária pelo nome do setor — O(log n).
 * A lista DEVE estar em ordem alfabética.
 * Retorna o ID numérico do departamento no G-Click, ou null se não encontrado.
 */
export function buscarIdSetor(nome: string): number | null {
  if (!nome || nome === "Todos") return null;
  const alvo = nome.toLowerCase().trim();
  let ini = 0, fim = SETORES_GCLICK.length - 1;
  while (ini <= fim) {
    const meio = Math.floor((ini + fim) / 2);
    const n    = SETORES_GCLICK[meio].nome.toLowerCase();
    if (n === alvo) return SETORES_GCLICK[meio].id;
    if (n < alvo)   ini = meio + 1;
    else             fim = meio - 1;
  }
  return null;
}

// ── STATUS ────────────────────────────────────────────────────────────────────
// OBRIGATÓRIO: lista em ORDEM ALFABÉTICA pelo campo "label"
// para que a busca binária funcione corretamente.
export interface StatusGClick {
  codigo: string; // código exato da API G-Click
  label: string;  // texto exibido no dropdown
}

export const STATUS_GCLICK: StatusGClick[] = [
  { codigo: "A", label: "Aberto"      },
  { codigo: "S", label: "Aguardando"  },
  { codigo: "X", label: "Cancelado"   },
  { codigo: "C", label: "Concluído"   },
  { codigo: "D", label: "Dispensado"  },
  { codigo: "F", label: "Finalizado"  },
  { codigo: "O", label: "Retificado"  },
  { codigo: "E", label: "Retificando" },
];

/**
 * Busca binária pelo label do status — O(log n).
 * Retorna o código da API G-Click (ex: "A", "C", "F").
 * Retorna null se label = "Todos" ou não encontrado.
 */
export function buscarCodigoStatus(label: string): string | null {
  if (!label || label === "Todos") return null;
  const alvo = label.toLowerCase().trim();
  let ini = 0, fim = STATUS_GCLICK.length - 1;
  while (ini <= fim) {
    const meio = Math.floor((ini + fim) / 2);
    const l    = STATUS_GCLICK[meio].label.toLowerCase();
    if (l === alvo) return STATUS_GCLICK[meio].codigo;
    if (l < alvo)   ini = meio + 1;
    else             fim = meio - 1;
  }
  return null;
}

// ── COMPETÊNCIA: MÊS + ANO ────────────────────────────────────────────────────
export const MESES_COMPETENCIA = [
  { valor: "01", label: "Janeiro"   },
  { valor: "02", label: "Fevereiro" },
  { valor: "03", label: "Março"     },
  { valor: "04", label: "Abril"     },
  { valor: "05", label: "Maio"      },
  { valor: "06", label: "Junho"     },
  { valor: "07", label: "Julho"     },
  { valor: "08", label: "Agosto"    },
  { valor: "09", label: "Setembro"  },
  { valor: "10", label: "Outubro"   },
  { valor: "11", label: "Novembro"  },
  { valor: "12", label: "Dezembro"  },
];

/** Lista de anos de 2021 até o ano atual (cresce automaticamente). */
export function gerarAnos(): number[] {
  const atual = new Date().getFullYear();
  const anos: number[] = [];
  for (let a = 2021; a <= atual; a++) anos.push(a);
  return anos;
}

/**
 * Converte mês (ex: "03") + ano (ex: "2025") nas datas de início e fim do período.
 * Retorna { inicio: "2025-03-01", fim: "2025-03-31" }
 */
export function competenciaParaDatas(mes: string, ano: string): { inicio: string; fim: string } {
  const ultimoDia = new Date(Number(ano), Number(mes), 0).getDate();
  return {
    inicio: `${ano}-${mes}-01`,
    fim:    `${ano}-${mes}-${String(ultimoDia).padStart(2, "0")}`,
  };
}