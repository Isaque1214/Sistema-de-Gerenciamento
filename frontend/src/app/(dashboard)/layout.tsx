import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const config = await prisma.configuracoes.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  const cssVars = {
    '--cor-primaria': config.cor_primaria,
    '--cor-secundaria': config.cor_secundaria,
  } as React.CSSProperties;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" style={cssVars}>
      <Sidebar nomeEmpresa={config.nome_empresa} logoUrl={config.logo_url} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header nomeEmpresa={config.nome_empresa} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}