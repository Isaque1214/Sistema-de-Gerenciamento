// Arquivo: route.ts
// Caminho: frontend/src/app/api/estrategia/metas/5w2h/

// API que gerencia o quadro detalhado de ações táticas (O que, Quem, Quando, Onde, etc).

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const planos = await prisma.objetivo5W2H.findMany();
    return NextResponse.json(planos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const novo = await prisma.objetivo5W2H.create({
      data: {
        o_que: body.o_que || "",
        quem: body.quem || "",
        quando_prazo: body.quando || "", // Tratando o campo que vem do form como 'quando'
        onde: body.onde || "",
        como: body.como || "",
        indicador: body.indicador || "",
        meta: body.meta || "",
        realizado: body.realizado || ""
      }
    });
    return NextResponse.json(novo);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "ID não informado" }, { status: 400 });
    
    const atualizado = await prisma.objetivo5W2H.update({
      where: { id: parseInt(body.id) },
      data: {
        o_que: body.o_que,
        quem: body.quem,
        quando_prazo: body.quando,
        onde: body.onde,
        como: body.como,
        indicador: body.indicador,
        meta: body.meta,
        realizado: body.realizado
      }
    });
    return NextResponse.json(atualizado);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID não informado" }, { status: 400 });

  try {
    await prisma.objetivo5W2H.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}