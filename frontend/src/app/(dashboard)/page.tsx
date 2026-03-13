import { redirect } from "next/navigation";

export default function DashboardRoot() {
  // Quando o usuário acessar localhost:3000/ ele será jogado direto para a visão operacional
  redirect("/operacional");
}