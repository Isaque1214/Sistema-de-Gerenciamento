import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  
  const [visao, produtos] = await Promise.all([
    prisma.raioXVisao.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
    prisma.raioXProduto.findMany(),
  ]);
  return NextResponse.json({ visao, produtos });
}

export async function PUT(request: Request) {
  
  const { visao } = await request.json();
  const atualizado = await prisma.raioXVisao.update({ where: { id: 1 }, data: visao });
  return NextResponse.json(atualizado);
}

export async function POST(request: Request) {
  
  const dados = await request.json();
  const item = await prisma.raioXProduto.create({ data: dados });
  return NextResponse.json(item, { status: 201 });
}

export async function DELETE(request: Request) {
  
  const { id } = await request.json();
  await prisma.raioXProduto.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}