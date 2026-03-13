// Arquivo: useToastStore.ts
// Caminho: frontend/src/store/

import { create } from 'zustand';

/**
 * Esta Store é responsável por gerir as notificações temporárias (Toasts).
 * Permite exibir mensagens de sucesso, erro, informação ou aviso em qualquer parte da aplicação.
 */

// Definimos os tipos de alerta que o sistema aceita
export type ToastType = 'success' | 'error' | 'info' | 'warning';

// Estrutura de uma notificação individual
interface Toast {
  id: string;
  mensagem: string;
  tipo: ToastType;
}

// Definição das acções da Store
interface ToastState {
  toasts: Toast[];
  adicionarToast: (mensagem: string, tipo: ToastType) => void;
  removerToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  // Lista inicial de notificações (vazia)
  toasts: [],

  /**
   * Adiciona uma nova notificação à fila.
   * Gera um ID único e define um temporizador para remover a mensagem automaticamente.
   */
  adicionarToast: (mensagem, tipo) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    set((state) => ({
      toasts: [...state.toasts, { id, mensagem, tipo }]
    }));

    // Remove a notificação após 4 segundos para não poluir a interface
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, 4000);
  },

  /**
   * Remove manualmente uma notificação da lista através do seu ID.
   */
  removerToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),
}));