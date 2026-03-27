// Arquivo: route.ts
// Caminho: frontend/src/app/api/estrategia/diretrizes/

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const itens = await prisma.diretrizEstrategica.findMany({
      orderBy: [{ macro_area: "asc" }, { sub_area: "asc" }, { id: "asc" }],
    });
    return NextResponse.json(itens);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { macro_area, sub_area, acao } = await request.json();
    if (!macro_area || !sub_area || !acao) {
      return NextResponse.json({ erro: "Campos obrigatórios ausentes." }, { status: 400 });
    }
    await prisma.diretrizEstrategica.create({ data: { macro_area, sub_area, acao } });
    return NextResponse.json({ status: "sucesso" });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    await prisma.diretrizEstrategica.update({ where: { id }, data: { status } });
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
    await prisma.diretrizEstrategica.delete({ where: { id } });
    return NextResponse.json({ status: "sucesso" });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}