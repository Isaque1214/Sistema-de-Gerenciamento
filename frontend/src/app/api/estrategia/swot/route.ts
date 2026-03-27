// Arquivo: route.ts
// Caminho: frontend/src/app/api/estrategia/swot/

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const itens = await prisma.analiseSwot.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json(itens);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { categoria, descricao } = await request.json();
    if (!descricao) return NextResponse.json({ erro: "Descrição obrigatória." }, { status: 400 });
    await prisma.analiseSwot.create({ data: { categoria, descricao } });
    return NextResponse.json({ status: "sucesso" });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "");
    if (!id) return NextResponse.json({ erro: "ID ausente." }, { status: 400 });
    await prisma.analiseSwot.delete({ where: { id } });
    return NextResponse.json({ status: "sucesso" });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}