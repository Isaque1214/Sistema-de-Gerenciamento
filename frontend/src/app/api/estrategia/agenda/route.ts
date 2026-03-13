// Arquivo: route.ts
// Caminho: frontend/src/app/api/estrategia/agenda/

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const eventos = await prisma.agendaImpacto.findMany({
      orderBy: { data_evento: "asc" },
    });
    return NextResponse.json(eventos);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { evento, data_evento, tipo } = await request.json();
    if (!evento || !data_evento) {
      return NextResponse.json({ erro: "Campos obrigatórios ausentes." }, { status: 400 });
    }
    await prisma.agendaImpacto.create({
      data: { evento, data_evento: new Date(data_evento).toISOString(), tipo },
    });
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
    await prisma.agendaImpacto.delete({ where: { id } });
    return NextResponse.json({ status: "sucesso" });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}