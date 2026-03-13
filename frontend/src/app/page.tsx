// Ficheiro: page.tsx
// Caminho: frontend/src/app/

import { redirect } from "next/navigation";

/**
 * Como removemos a autenticação, a página raiz da aplicação
 * agora redireciona o utilizador diretamente para o Dashboard Operacional.
 */
export default function RootPage() {
  redirect("/operacional");
}