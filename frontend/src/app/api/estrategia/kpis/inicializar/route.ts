// Arquivo: route.ts
// Caminho: frontend/src/app/api/estrategia/kpis/inicializar/

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const INDICADORES = ["Faturamento","Recebimentos","Custos e Despesas","Lucro Líquido"];

export async function POST() {
  try {
    let criados = 0;
    for (const indicador of INDICADORES) {
      for (const mes of MESES) {
        const existe = await prisma.kpiEstrategico.findUnique({
          where: { indicador_mes: { indicador, mes } },
        });
        if (!existe) {
          await prisma.kpiEstrategico.create({
            data: { indicador, mes, meta: 0, realizado: 0 },
          });
          criados++;
        }
      }
    }
    return NextResponse.json({ status: "sucesso", criados });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }
}