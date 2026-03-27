import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [metasGclick, zappyAtual] = await Promise.all([
      prisma.metasGclick.findMany({ orderBy: { obrigacao: 'asc' } }),
      // indicadores_zappy usa estrutura legada: cliente = total msgs, atendente = média
      prisma.indicadoresZappy.findFirst({
        orderBy: { ticket_id: 'desc' },
      }),
    ]);

    // Converte os campos legados para nomes semânticos
    const zappy = zappyAtual
      ? {
          Total_Absoluto: parseInt(zappyAtual.cliente) || 0,
          Colaboradores: 0, // não armazenado na estrutura legada
          Mensagens_Por_Colaborador: parseFloat(zappyAtual.atendente) || 0,
          mes_referencia: zappyAtual.ticket_id.replace('MENSAGENS_', ''),
        }
      : null;

    return NextResponse.json({
      gclick: metasGclick,
      zappy,
      ultima_sincronizacao: null,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}