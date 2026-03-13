import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET() {
  
  const [gerais, produtos, canais, w2h] = await Promise.all([
    prisma.metasGerais.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
    prisma.metasProduto.findMany(),
    prisma.metasCanal.findMany(),
    prisma.objetivo5W2H.findMany(),
  ]);
  return NextResponse.json({ gerais, produtos, canais, w2h });
}

export async function PUT(request: Request) {
  
  const { gerais } = await request.json();
  const atualizado = await prisma.metasGerais.update({ where: { id: 1 }, data: gerais });
  return NextResponse.json(atualizado);
}

export async function POST(request: Request) {
  
  const { tipo, dados } = await request.json();
  let item;
  if (tipo === 'produto') item = await prisma.metasProduto.create({ data: dados });
  else if (tipo === 'canal') item = await prisma.metasCanal.create({ data: dados });
  else if (tipo === '5w2h') item = await prisma.objetivo5W2H.create({ data: dados });
  else return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
  return NextResponse.json(item, { status: 201 });
}

export async function DELETE(request: Request) {
  
  const { tipo, id } = await request.json();
  if (tipo === 'produto') await prisma.metasProduto.delete({ where: { id } });
  else if (tipo === 'canal') await prisma.metasCanal.delete({ where: { id } });
  else if (tipo === '5w2h') await prisma.objetivo5W2H.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}