// Arquivo: route.ts
// Caminho: frontend/src/app/api/estrategia/kpis/

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const kpis = await prisma.kpiEstrategico.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(kpis);
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, meta, realizado } = await request.json();
    await prisma.kpiEstrategico.update({
      where: { id },
      data: { meta, realizado },
    });
    return NextResponse.json({ status: "sucesso" });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}