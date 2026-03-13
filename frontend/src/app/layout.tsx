// Arquivo: layout.tsx
// Caminho: frontend/src/app/

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/**
 * Configuramos a fonte Inter com subsets latinos.
 * Esta fonte é amplamente utilizada em interfaces SaaS de alto nível
 * por sua excelente legibilidade em telas.
 */
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
});

/**
 * Metadados globais da aplicação. 
 * O que você escrever aqui aparecerá no título da aba do navegador.
 */
export const metadata: Metadata = {
  title: "EloGestão | Inteligência Estratégica",
  description: "Plataforma avançada de gestão estratégica, operacional e financeira.",
  icons: {
    icon: "/favicon.ico", // Opcional: adicione um ícone na pasta public depois
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        {/* O 'children' representa todas as páginas do sistema. 
          Como estamos usando o App Router, este layout envolve tanto 
          as páginas de login quanto o dashboard.
        */}
        {children}
      </body>
    </html>
  );
}