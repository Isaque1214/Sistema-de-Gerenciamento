-- CreateTable
CREATE TABLE "Configuracoes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "nome_empresa" TEXT NOT NULL DEFAULT 'EloGestão',
    "cor_primaria" TEXT NOT NULL DEFAULT '#1C3D5A',
    "cor_secundaria" TEXT NOT NULL DEFAULT '#2563eb',
    "logo_url" TEXT,
    "conta_asaas_ativa" INTEGER NOT NULL DEFAULT 1
);

-- CreateTable
CREATE TABLE "metas_gclick" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "obrigacao" TEXT NOT NULL,
    "meta_percentual" REAL NOT NULL DEFAULT 100,
    "valor_atual" REAL NOT NULL DEFAULT 0,
    "prazo_dias" INTEGER NOT NULL DEFAULT 30,
    "escopo" TEXT NOT NULL DEFAULT 'Empresa'
);

-- CreateTable
CREATE TABLE "indicadores_zappy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ticket_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'LOG_MENSAL',
    "cliente" TEXT NOT NULL DEFAULT '0',
    "atendente" TEXT NOT NULL DEFAULT '0.0'
);

-- CreateTable
CREATE TABLE "kpis_estrategicos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "indicador" TEXT NOT NULL,
    "mes" TEXT NOT NULL,
    "meta" REAL NOT NULL DEFAULT 0,
    "realizado" REAL NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "kpis_setoriais" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "setor" TEXT NOT NULL,
    "indicador" TEXT NOT NULL,
    "mes" TEXT NOT NULL,
    "meta" REAL NOT NULL DEFAULT 0,
    "realizado" REAL NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "identidade_organizacional" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "ano" INTEGER NOT NULL DEFAULT 2026,
    "missao" TEXT NOT NULL DEFAULT '',
    "visao" TEXT NOT NULL DEFAULT '',
    "valores" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "analise_swot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categoria" TEXT NOT NULL,
    "descricao" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "matriz_risco" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "risco" TEXT NOT NULL,
    "probabilidade" TEXT NOT NULL,
    "medidas_redutoras" TEXT NOT NULL,
    "medidas_exposicao" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "raiox_visao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "faturamento" REAL NOT NULL DEFAULT 0,
    "meses" INTEGER NOT NULL DEFAULT 12,
    "clientes" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "raiox_produtos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "faturamento" REAL NOT NULL DEFAULT 0,
    "vendas" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "metas_gerais" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "objetivo" TEXT NOT NULL DEFAULT '',
    "meta_faturamento" REAL NOT NULL DEFAULT 0,
    "meta_lucro" REAL NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "metas_produtos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "faturamento" REAL NOT NULL DEFAULT 0,
    "ticket" REAL NOT NULL DEFAULT 0,
    "clientes" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "metas_canais" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "canal" TEXT NOT NULL,
    "meta_anual" REAL NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "objetivos_5w2h" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "o_que" TEXT NOT NULL,
    "quem" TEXT NOT NULL,
    "quando" TEXT NOT NULL,
    "onde" TEXT NOT NULL,
    "como" TEXT NOT NULL,
    "indicador" TEXT NOT NULL,
    "meta" TEXT NOT NULL,
    "realizado" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "diretrizes_estrategicas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "macro_area" TEXT NOT NULL,
    "sub_area" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pendente'
);

-- CreateTable
CREATE TABLE "agenda_impacto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "evento" TEXT NOT NULL,
    "data_evento" TEXT NOT NULL,
    "tipo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ChavePix" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "apelido" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "metas_gclick_obrigacao_key" ON "metas_gclick"("obrigacao");

-- CreateIndex
CREATE UNIQUE INDEX "indicadores_zappy_ticket_id_key" ON "indicadores_zappy"("ticket_id");

-- CreateIndex
CREATE UNIQUE INDEX "kpis_estrategicos_indicador_mes_key" ON "kpis_estrategicos"("indicador", "mes");

-- CreateIndex
CREATE UNIQUE INDEX "kpis_setoriais_setor_indicador_mes_key" ON "kpis_setoriais"("setor", "indicador", "mes");
