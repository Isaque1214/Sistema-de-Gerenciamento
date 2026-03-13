// Arquivo: route.ts
// Caminho: frontend/src/app/api/estrategia/metas/canais/

// API para rastrear de onde o faturamento deve vir (Instagram, Google, Indicações, etc).

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const canais = await prisma.metasCanal.findMany();
    return NextResponse.json(canais);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const novo = await prisma.metasCanal.create({
      data: {
        canal: body.canal,
        meta_anual: parseFloat(body.meta_anual) || 0
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
    
    const atualizado = await prisma.metasCanal.update({
      where: { id: parseInt(body.id) },
      data: {
        canal: body.canal,
        meta_anual: parseFloat(body.meta_anual) || 0
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
    await prisma.metasCanal.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}