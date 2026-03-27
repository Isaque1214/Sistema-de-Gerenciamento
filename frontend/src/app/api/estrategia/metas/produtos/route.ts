// Arquivo: route.ts
// Caminho: frontend/src/app/api/estrategia/metas/produtos/

// API para desdobrar a meta financeira em produtos/serviços específicos.

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// LER PRODUTOS (GET)
export async function GET() {
  try {
    const produtos = await prisma.metasProduto.findMany();
    return NextResponse.json(produtos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// CRIAR NOVO PRODUTO (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const novo = await prisma.metasProduto.create({
      data: {
        nome: body.nome,
        faturamento: parseFloat(body.faturamento) || 0,
        ticket: parseFloat(body.ticket) || 0,
        clientes: parseInt(body.clientes) || 0
      }
    });
    return NextResponse.json(novo);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ATUALIZAR PRODUTO (PUT)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "ID não informado" }, { status: 400 });
    
    const atualizado = await prisma.metasProduto.update({
      where: { id: parseInt(body.id) },
      data: {
        nome: body.nome,
        faturamento: parseFloat(body.faturamento) || 0,
        ticket: parseFloat(body.ticket) || 0,
        clientes: parseInt(body.clientes) || 0
      }
    });
    return NextResponse.json(atualizado);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETAR PRODUTO (DELETE)
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID não informado" }, { status: 400 });

  try {
    await prisma.metasProduto.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}