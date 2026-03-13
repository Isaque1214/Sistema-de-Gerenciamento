// Arquivo: PageWrapper.tsx
// Caminho: frontend/src/components/layout/

"use client";

import React from "react";

/**
 * Este componente garante que todas as páginas do dashboard
 * tenham o mesmo comportamento de entrada e espaçamento.
 * * Ele utiliza classes do Tailwind CSS para criar uma animação suave
 * sem a necessidade de bibliotecas externas pesadas.
 */
interface PageWrapperProps {
  children: React.ReactNode;
  maxWidth?: "4xl" | "5xl" | "6xl" | "7xl" | "full";
}

export default function PageWrapper({ 
  children,
  maxWidth = "7xl"
}: PageWrapperProps) {
  
  // Mapeamento de largura máxima para manter o conteúdo centralizado e legível
  const widthClasses = {
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    "full": "max-w-full"
  };

  return (
    <div className={`p-8 mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out ${widthClasses[maxWidth]}`}>
      {children}
    </div>
  );
}