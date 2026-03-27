import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = await prisma.configuracoes.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });
    return NextResponse.json(config);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const dados = await request.json();
    const config = await prisma.configuracoes.update({
      where: { id: 1 },
      data: {
        nome_empresa: dados.nome_empresa,
        cor_primaria: dados.cor_primaria,
        cor_secundaria: dados.cor_secundaria,
        logo_url: dados.logo_url,
        conta_asaas_ativa: dados.conta_asaas_ativa,
      },
    });
    return NextResponse.json(config);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}