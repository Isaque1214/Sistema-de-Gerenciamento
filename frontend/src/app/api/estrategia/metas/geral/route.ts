// Arquivo: route.ts
// Caminho: frontend/src/app/api/estrategia/metas/geral/

// Esta API gerencia o objetivo macro da empresa e os alvos anuais.
// Conecta a parte superior da tela de Metas com o SQLite.

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// LER METAS GERAIS (GET)
export async function GET() {
  try {
    // Busca a linha de ID 1 (sempre usamos 1 pois a empresa só tem 1 objetivo geral por vez)
    let metas = await prisma.metasGerais.findUnique({ where: { id: 1 } });
    
    // Se não existir, cria uma vazia para evitar erros na tela
    if (!metas) {
      metas = await prisma.metasGerais.create({ data: { id: 1 } });
    }
    
    return NextResponse.json(metas);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// SALVAR METAS GERAIS (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Atualiza se existir, cria se não existir
    const atualizada = await prisma.metasGerais.upsert({
      where: { id: 1 },
      update: {
        objetivo: body.objetivo,
        meta_faturamento: parseFloat(body.meta_faturamento) || 0,
        meta_lucro: parseFloat(body.meta_lucro) || 0
      },
      create: {
        id: 1,
        objetivo: body.objetivo,
        meta_faturamento: parseFloat(body.meta_faturamento) || 0,
        meta_lucro: parseFloat(body.meta_lucro) || 0
      }
    });
    
    return NextResponse.json(atualizada);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}