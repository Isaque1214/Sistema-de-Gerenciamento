// Arquivo: route.ts
// Caminho: frontend/src/app/api/estrategia/identidade/

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const dados = await prisma.identidadeOrganizacional.findUnique({ where: { id: 1 } });
    return NextResponse.json(dados ?? { missao: "", visao: "", valores: "" });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { missao, visao, valores } = await request.json();
    await prisma.identidadeOrganizacional.upsert({
      where: { id: 1 },
      update: { missao, visao, valores },
      create: { id: 1, missao, visao, valores },
    });
    return NextResponse.json({ status: "sucesso" });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}