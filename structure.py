import os

def criar_estrutura():
    print("Iniciando a construcao da arquitetura EloGestao SaaS...")

    pastas = [
        "frontend/prisma/migrations",
        "frontend/src/app/(auth)/login",
        "frontend/src/app/(dashboard)/operacional",
        "frontend/src/app/(dashboard)/gclick",
        "frontend/src/app/(dashboard)/financeiro",
        "frontend/src/app/(dashboard)/identidade",
        "frontend/src/app/(dashboard)/raio-x",
        "frontend/src/app/(dashboard)/metas",
        "frontend/src/app/(dashboard)/kpis",
        "frontend/src/app/(dashboard)/indicadores",
        "frontend/src/app/(dashboard)/plano-acao",
        "frontend/src/app/(dashboard)/agenda",
        "frontend/src/app/(dashboard)/configuracoes",
        "frontend/src/app/api/auth/[...nextauth]",
        "frontend/src/app/api/dashboard",
        "frontend/src/app/api/gclick/clientes",
        "frontend/src/app/api/gclick/tarefas",
        "frontend/src/app/api/financeiro/resumo",
        "frontend/src/app/api/financeiro/cobrancas",
        "frontend/src/app/api/financeiro/clientes",
        "frontend/src/app/api/financeiro/inadimplentes",
        "frontend/src/app/api/estrategia/identidade",
        "frontend/src/app/api/estrategia/swot",
        "frontend/src/app/api/estrategia/riscos",
        "frontend/src/app/api/estrategia/raiox",
        "frontend/src/app/api/estrategia/metas",
        "frontend/src/app/api/estrategia/kpis",
        "frontend/src/app/api/estrategia/kpis-setoriais",
        "frontend/src/app/api/estrategia/diretrizes",
        "frontend/src/app/api/estrategia/agenda",
        "frontend/src/app/api/cron/sincronizar",
        "frontend/src/app/api/configuracoes",
        "frontend/src/components/layout",
        "frontend/src/components/ui",
        "frontend/src/components/charts",
        "frontend/src/components/operacional",
        "frontend/src/components/financeiro",
        "frontend/src/components/gclick",
        "frontend/src/components/configuracoes",
        "frontend/src/hooks",
        "frontend/src/store",
        "frontend/src/lib",
        "frontend/src/types",
        "frontend/public/icons",
        "backend/services",
        "backend/routers",
        "backend/models",
        "backend/core"
    ]

    arquivos = {
        "iniciar.bat": "@echo off\necho Iniciar sistema Windows...\n",
        "iniciar.sh": "#!/bin/bash\necho Iniciar sistema Mac/Linux...\n",
        ".env.local": "DATABASE_URL=sua_url_neon\n",
        ".env.example": "DATABASE_URL=\n",
        ".gitignore": "node_modules/\n.env.local\n__pycache__/\n.next/\n",
        "README.md": "# EloGestao SaaS\n",
        
        # Arquivos Frontend
        "frontend/package.json": "{\n  \"name\": \"elogestao-frontend\",\n  \"version\": \"1.0.0\"\n}\n",
        "frontend/tsconfig.json": "{\n  \"compilerOptions\": {}\n}\n",
        "frontend/next.config.js": "module.exports = {};\n",
        "frontend/tailwind.config.js": "module.exports = {};\n",
        "frontend/postcss.config.js": "module.exports = {};\n",
        "frontend/prisma/schema.prisma": "generator client {\n  provider = \"prisma-client-js\"\n}\n",
        
        "frontend/src/app/layout.tsx": "export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang=\"pt-BR\"><body>{children}</body></html>; }\n",
        "frontend/src/app/globals.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n",
        "frontend/src/app/(auth)/login/page.tsx": "export default function Login() { return <div>Login</div>; }\n",
        "frontend/src/app/(dashboard)/layout.tsx": "export default function DashboardLayout({ children }: { children: React.ReactNode }) { return <div>{children}</div>; }\n",
        "frontend/src/app/(dashboard)/page.tsx": "export default function Page() { return <div>Home</div>; }\n",
        
        # Arquivos vazios para as telas do Dashboard
        "frontend/src/app/(dashboard)/operacional/page.tsx": "",
        "frontend/src/app/(dashboard)/gclick/page.tsx": "",
        "frontend/src/app/(dashboard)/financeiro/page.tsx": "",
        "frontend/src/app/(dashboard)/identidade/page.tsx": "",
        "frontend/src/app/(dashboard)/raio-x/page.tsx": "",
        "frontend/src/app/(dashboard)/metas/page.tsx": "",
        "frontend/src/app/(dashboard)/kpis/page.tsx": "",
        "frontend/src/app/(dashboard)/indicadores/page.tsx": "",
        "frontend/src/app/(dashboard)/plano-acao/page.tsx": "",
        "frontend/src/app/(dashboard)/agenda/page.tsx": "",
        "frontend/src/app/(dashboard)/configuracoes/page.tsx": "",
        
        # Arquivos de API do Frontend
        "frontend/src/app/api/auth/[...nextauth]/route.ts": "",
        "frontend/src/app/api/dashboard/route.ts": "",
        
        # Componentes
        "frontend/src/components/layout/Sidebar.tsx": "",
        "frontend/src/components/layout/Header.tsx": "",
        "frontend/src/components/layout/PageWrapper.tsx": "",
        
        # Bibliotecas e Estado
        "frontend/src/store/useAppStore.ts": "",
        "frontend/src/store/useToastStore.ts": "",
        "frontend/src/lib/prisma.ts": "",
        "frontend/src/lib/auth.ts": "",
        "frontend/src/lib/formatters.ts": "",
        "frontend/src/lib/validators.ts": "",
        
        # Tipos
        "frontend/src/types/gclick.ts": "",
        "frontend/src/types/asaas.ts": "",
        "frontend/src/types/zappy.ts": "",
        "frontend/src/types/estrategia.ts": "",
        "frontend/src/types/configuracoes.ts": "",
        
        "frontend/public/logo.svg": "",
        
        # Arquivos Backend
        "backend/main.py": "from fastapi import FastAPI\napp = FastAPI()\n",
        "backend/requirements.txt": "fastapi\nuvicorn\npydantic\npydantic-settings\nrequests\n",
        "backend/.env": "",
        "backend/services/gclick_service.py": "",
        "backend/services/zappy_service.py": "",
        "backend/services/asaas_service.py": "",
        "backend/services/sincronizacao_service.py": "",
        "backend/routers/gclick_router.py": "",
        "backend/routers/asaas_router.py": "",
        "backend/routers/cron_router.py": "",
        "backend/models/gclick_models.py": "",
        "backend/models/asaas_models.py": "",
        "backend/core/config.py": "",
        "backend/core/http_client.py": ""
    }

    # Criar todas as pastas
    for pasta in pastas:
        os.makedirs(pasta, exist_ok=True)
        print(f"Pasta criada: {pasta}")

    # Criar todos os arquivos
    for caminho, conteudo in arquivos.items():
        with open(caminho, 'w', encoding='utf-8') as f:
            f.write(conteudo)
        print(f"Arquivo criado: {caminho}")

    print("\nArquitetura gerada com sucesso! Todas as pastas e arquivos estao no lugar.")

if __name__ == "__main__":
    criar_estrutura()