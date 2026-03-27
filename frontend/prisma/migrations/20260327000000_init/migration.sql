-- CreateTable
CREATE TABLE "Configuracoes" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "nome_empresa" TEXT NOT NULL DEFAULT 'SaaS Elo Gestão',
    "cor_primaria" TEXT NOT NULL DEFAULT '#026232',
    "cor_secundaria" TEXT NOT NULL DEFAULT '#00542A',
    "logo_url" TEXT,
    "conta_asaas_ativa" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Configuracoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metas_gclick" (
    "id" SERIAL NOT NULL,
    "obrigacao" TEXT NOT NULL,
    "meta_percentual" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "valor_atual" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "prazo_dias" INTEGER NOT NULL DEFAULT 30,
    "escopo" TEXT NOT NULL DEFAULT 'Empresa',

    CONSTRAINT "metas_gclick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicadores_zappy" (
    "id" SERIAL NOT NULL,
    "ticket_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'LOG_MENSAL',
    "cliente" TEXT NOT NULL DEFAULT '0',
    "atendente" TEXT NOT NULL DEFAULT '0.0',

    CONSTRAINT "indicadores_zappy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpis_estrategicos" (
    "id" SERIAL NOT NULL,
    "indicador" TEXT NOT NULL,
    "mes" TEXT NOT NULL,
    "meta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "realizado" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "kpis_estrategicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kpis_setoriais" (
    "id" SERIAL NOT NULL,
    "setor" TEXT NOT NULL,
    "indicador" TEXT NOT NULL,
    "mes" TEXT NOT NULL,
    "meta" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "realizado" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "kpis_setoriais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identidade_organizacional" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "ano" INTEGER NOT NULL DEFAULT 2026,
    "missao" TEXT NOT NULL DEFAULT '',
    "visao" TEXT NOT NULL DEFAULT '',
    "valores" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "identidade_organizacional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analise_swot" (
    "id" SERIAL NOT NULL,
    "categoria" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "analise_swot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matriz_risco" (
    "id" SERIAL NOT NULL,
    "risco" TEXT NOT NULL,
    "probabilidade" TEXT NOT NULL,
    "medidas_redutoras" TEXT NOT NULL,
    "medidas_exposicao" TEXT NOT NULL,

    CONSTRAINT "matriz_risco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raiox_visao" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "faturamento" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "meses" INTEGER NOT NULL DEFAULT 12,
    "clientes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "raiox_visao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raiox_produtos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "faturamento" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "vendas" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "raiox_produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metas_gerais" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "objetivo" TEXT NOT NULL DEFAULT '',
    "meta_faturamento" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "meta_lucro" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "metas_gerais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metas_produtos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "faturamento" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ticket" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "clientes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "metas_produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metas_canais" (
    "id" SERIAL NOT NULL,
    "canal" TEXT NOT NULL,
    "meta_anual" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "metas_canais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "objetivos_5w2h" (
    "id" SERIAL NOT NULL,
    "o_que" TEXT NOT NULL,
    "quem" TEXT NOT NULL,
    "quando" TEXT NOT NULL,
    "onde" TEXT NOT NULL,
    "como" TEXT NOT NULL,
    "indicador" TEXT NOT NULL,
    "meta" TEXT NOT NULL,
    "realizado" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "objetivos_5w2h_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diretrizes_estrategicas" (
    "id" SERIAL NOT NULL,
    "macro_area" TEXT NOT NULL,
    "sub_area" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pendente',

    CONSTRAINT "diretrizes_estrategicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agenda_impacto" (
    "id" SERIAL NOT NULL,
    "evento" TEXT NOT NULL,
    "data_evento" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "agenda_impacto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChavePix" (
    "id" SERIAL NOT NULL,
    "apelido" TEXT NOT NULL,
    "chave" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChavePix_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "metas_gclick_obrigacao_key" ON "metas_gclick"("obrigacao");

-- CreateIndex
CREATE UNIQUE INDEX "indicadores_zappy_ticket_id_key" ON "indicadores_zappy"("ticket_id");

-- CreateIndex
CREATE UNIQUE INDEX "kpis_estrategicos_indicador_mes_key" ON "kpis_estrategicos"("indicador", "mes");

-- CreateIndex
CREATE UNIQUE INDEX "kpis_setoriais_setor_indicador_mes_key" ON "kpis_setoriais"("setor", "indicador", "mes");
