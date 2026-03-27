// Arquivo: route.ts
// Caminho: frontend/src/app/api/estrategia/riscos/

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const riscos = await prisma.matrizRisco.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(riscos);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { risco, probabilidade, medidas_redutoras, medidas_exposicao } = await request.json();
    if (!risco || !medidas_redutoras || !medidas_exposicao) {
      return NextResponse.json({ erro: "Campos obrigatórios ausentes." }, { status: 400 });
    }
    await prisma.matrizRisco.create({
      data: { risco, probabilidade, medidas_redutoras, medidas_exposicao },
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
    await prisma.matrizRisco.delete({ where: { id } });
    return NextResponse.json({ status: "sucesso" });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}