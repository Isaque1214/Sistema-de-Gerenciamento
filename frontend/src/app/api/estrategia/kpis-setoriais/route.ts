import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  
  return NextResponse.json(await prisma.kpiSetorial.findMany({ orderBy: [{ setor: 'asc' }, { mes: 'asc' }] }));
}

export async function POST(request: Request) {
  
  const dados = await request.json();
  const kpi = await prisma.kpiSetorial.create({ data: dados });
  return NextResponse.json(kpi, { status: 201 });
}

export async function PUT(request: Request) {
  
  const { id, meta, realizado } = await request.json();
  const kpi = await prisma.kpiSetorial.update({ where: { id }, data: { meta, realizado } });
  return NextResponse.json(kpi);
}

export async function DELETE(request: Request) {
  
  const { id } = await request.json();
  await prisma.kpiSetorial.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}