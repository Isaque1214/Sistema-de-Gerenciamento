-- =============================================================
-- MIGRAÇÃO DE DADOS: SQLite → Supabase PostgreSQL
-- Gerado em: 2026-03-27
-- Fonte: sistema_estrategico.db + frontend/prisma/dev.db
-- =============================================================

-- Desabilita checagem de FK durante a importação
SET session_replication_role = replica;

-- =============================================================
-- Configuracoes (1 registro)
-- =============================================================
INSERT INTO "Configuracoes" (id, nome_empresa, cor_primaria, cor_secundaria, logo_url, conta_asaas_ativa)
VALUES (1, 'EloGestão', '#026232', '#00542a', NULL, 1)
ON CONFLICT DO NOTHING;

-- =============================================================
-- identidade_organizacional (1 registro)
-- =============================================================
INSERT INTO identidade_organizacional (id, ano, missao, visao, valores)
VALUES (
  1,
  2026,
  'Entender as necessidades de cada clientes, gerando informações de forma personalizadas.',
  'Consolidar nossa marca nos próximos 2 anos',
  E'Personalização\nagilidade\nsegurança\ndisponibilidade\ncomprometimento'
)
ON CONFLICT DO NOTHING;

-- =============================================================
-- kpis_estrategicos (36 registros)
-- =============================================================
INSERT INTO kpis_estrategicos (id, indicador, mes, meta, realizado) VALUES
  (1,  'Faturamento',        'Jan', 85333.0,  0.0),
  (2,  'Custos e Despesas',  'Jan', 59733.0,  0.0),
  (3,  'Lucro Líquido',      'Jan', 25600.0,  0.0),
  (4,  'Faturamento',        'Fev', 178333.0, 0.0),
  (5,  'Custos e Despesas',  'Fev', 124833.0, 0.0),
  (6,  'Lucro Líquido',      'Fev', 53500.0,  0.0),
  (7,  'Faturamento',        'Mar', 111333.0, 0.0),
  (8,  'Custos e Despesas',  'Mar', 77933.0,  0.0),
  (9,  'Lucro Líquido',      'Mar', 33400.0,  0.0),
  (10, 'Faturamento',        'Abr', 234333.0, 0.0),
  (11, 'Custos e Despesas',  'Abr', 164033.0, 0.0),
  (12, 'Lucro Líquido',      'Abr', 70300.0,  0.0),
  (13, 'Faturamento',        'Mai', 127333.0, 0.0),
  (14, 'Custos e Despesas',  'Mai', 89133.0,  0.0),
  (15, 'Lucro Líquido',      'Mai', 38200.0,  0.0),
  (16, 'Faturamento',        'Jun', 150333.0, 0.0),
  (17, 'Custos e Despesas',  'Jun', 105233.0, 0.0),
  (18, 'Lucro Líquido',      'Jun', 45100.0,  0.0),
  (19, 'Faturamento',        'Jul', 143333.0, 0.0),
  (20, 'Custos e Despesas',  'Jul', 100333.0, 0.0),
  (21, 'Lucro Líquido',      'Jul', 43000.0,  0.0),
  (22, 'Faturamento',        'Ago', 266333.0, 0.0),
  (23, 'Custos e Despesas',  'Ago', 186433.0, 0.0),
  (24, 'Lucro Líquido',      'Ago', 79900.0,  0.0),
  (25, 'Faturamento',        'Set', 179333.0, 0.0),
  (26, 'Custos e Despesas',  'Set', 125533.0, 0.0),
  (27, 'Lucro Líquido',      'Set', 53800.0,  0.0),
  (28, 'Faturamento',        'Out', 342333.0, 0.0),
  (29, 'Custos e Despesas',  'Out', 239633.0, 0.0),
  (30, 'Lucro Líquido',      'Out', 102700.0, 0.0),
  (31, 'Faturamento',        'Nov', 365333.0, 0.0),
  (32, 'Custos e Despesas',  'Nov', 255733.0, 0.0),
  (33, 'Lucro Líquido',      'Nov', 109600.0, 0.0),
  (34, 'Faturamento',        'Dez', 155333.0, 0.0),
  (35, 'Custos e Despesas',  'Dez', 108733.0, 0.0),
  (36, 'Lucro Líquido',      'Dez', 46600.0,  0.0)
ON CONFLICT DO NOTHING;

-- =============================================================
-- kpis_setoriais (48 registros)
-- =============================================================
INSERT INTO kpis_setoriais (id, setor, indicador, mes, meta, realizado) VALUES
  (1,  'Vendas',              'Nº de Clientes Fechados',              'Jan', 10.0,  0.0),
  (2,  'Vendas',              'Nº de Clientes Fechados',              'Fev', 10.0,  0.0),
  (3,  'Vendas',              'Nº de Clientes Fechados',              'Mar', 10.0,  0.0),
  (4,  'Vendas',              'Nº de Clientes Fechados',              'Abr', 10.0,  0.0),
  (5,  'Vendas',              'Nº de Clientes Fechados',              'Mai', 10.0,  0.0),
  (6,  'Vendas',              'Nº de Clientes Fechados',              'Jun', 10.0,  0.0),
  (7,  'Vendas',              'Nº de Clientes Fechados',              'Jul', 10.0,  0.0),
  (8,  'Vendas',              'Nº de Clientes Fechados',              'Ago', 10.0,  0.0),
  (9,  'Vendas',              'Nº de Clientes Fechados',              'Set', 10.0,  0.0),
  (10, 'Vendas',              'Nº de Clientes Fechados',              'Out', 10.0,  0.0),
  (11, 'Vendas',              'Nº de Clientes Fechados',              'Nov', 10.0,  0.0),
  (12, 'Vendas',              'Nº de Clientes Fechados',              'Dez', 10.0,  0.0),
  (13, 'Vendas',              'Eficácia das Vendas (Novos Contratos)','Jan', 4.0,   0.0),
  (14, 'Vendas',              'Eficácia das Vendas (Novos Contratos)','Fev', 5.0,   0.0),
  (15, 'Vendas',              'Eficácia das Vendas (Novos Contratos)','Mar', 5.0,   0.0),
  (16, 'Vendas',              'Eficácia das Vendas (Novos Contratos)','Abr', 6.0,   0.0),
  (17, 'Vendas',              'Eficácia das Vendas (Novos Contratos)','Mai', 6.0,   0.0),
  (18, 'Vendas',              'Eficácia das Vendas (Novos Contratos)','Jun', 7.0,   0.0),
  (19, 'Vendas',              'Eficácia das Vendas (Novos Contratos)','Jul', 7.0,   0.0),
  (20, 'Vendas',              'Eficácia das Vendas (Novos Contratos)','Ago', 8.0,   0.0),
  (21, 'Vendas',              'Eficácia das Vendas (Novos Contratos)','Set', 8.0,   0.0),
  (22, 'Vendas',              'Eficácia das Vendas (Novos Contratos)','Out', 9.0,   0.0),
  (23, 'Vendas',              'Eficácia das Vendas (Novos Contratos)','Nov', 9.0,   0.0),
  (24, 'Vendas',              'Eficácia das Vendas (Novos Contratos)','Dez', 10.0,  0.0),
  (25, 'Departamento Pessoal','Admissões realizadas no Prazo',        'Jan', 100.0, 0.0),
  (26, 'Departamento Pessoal','Admissões realizadas no Prazo',        'Fev', 100.0, 0.0),
  (27, 'Departamento Pessoal','Admissões realizadas no Prazo',        'Mar', 100.0, 0.0),
  (28, 'Departamento Pessoal','Admissões realizadas no Prazo',        'Abr', 100.0, 0.0),
  (29, 'Departamento Pessoal','Admissões realizadas no Prazo',        'Mai', 100.0, 0.0),
  (30, 'Departamento Pessoal','Admissões realizadas no Prazo',        'Jun', 100.0, 0.0),
  (31, 'Departamento Pessoal','Admissões realizadas no Prazo',        'Jul', 100.0, 0.0),
  (32, 'Departamento Pessoal','Admissões realizadas no Prazo',        'Ago', 100.0, 0.0),
  (33, 'Departamento Pessoal','Admissões realizadas no Prazo',        'Set', 100.0, 0.0),
  (34, 'Departamento Pessoal','Admissões realizadas no Prazo',        'Out', 100.0, 0.0),
  (35, 'Departamento Pessoal','Admissões realizadas no Prazo',        'Nov', 100.0, 0.0),
  (36, 'Departamento Pessoal','Admissões realizadas no Prazo',        'Dez', 100.0, 0.0),
  (37, 'Gestão de Pessoas',   'Treinamento de Equipe (Horas)',         'Jan', 30.0,  0.0),
  (38, 'Gestão de Pessoas',   'Treinamento de Equipe (Horas)',         'Fev', 30.0,  0.0),
  (39, 'Gestão de Pessoas',   'Treinamento de Equipe (Horas)',         'Mar', 30.0,  0.0),
  (40, 'Gestão de Pessoas',   'Treinamento de Equipe (Horas)',         'Abr', 30.0,  0.0),
  (41, 'Gestão de Pessoas',   'Treinamento de Equipe (Horas)',         'Mai', 30.0,  0.0),
  (42, 'Gestão de Pessoas',   'Treinamento de Equipe (Horas)',         'Jun', 30.0,  0.0),
  (43, 'Gestão de Pessoas',   'Treinamento de Equipe (Horas)',         'Jul', 30.0,  0.0),
  (44, 'Gestão de Pessoas',   'Treinamento de Equipe (Horas)',         'Ago', 30.0,  0.0),
  (45, 'Gestão de Pessoas',   'Treinamento de Equipe (Horas)',         'Set', 30.0,  0.0),
  (46, 'Gestão de Pessoas',   'Treinamento de Equipe (Horas)',         'Out', 30.0,  0.0),
  (47, 'Gestão de Pessoas',   'Treinamento de Equipe (Horas)',         'Nov', 30.0,  0.0),
  (48, 'Gestão de Pessoas',   'Treinamento de Equipe (Horas)',         'Dez', 30.0,  0.0)
ON CONFLICT DO NOTHING;

-- =============================================================
-- analise_swot (21 registros)
-- =============================================================
INSERT INTO analise_swot (id, categoria, descricao) VALUES
  (1,  'Força',       'Ambiente trabalho'),
  (2,  'Força',       'Agilidade'),
  (3,  'Força',       'Personalização'),
  (4,  'Força',       'Transparencia'),
  (5,  'Força',       'Sistemas'),
  (6,  'Força',       'Meio de comunicação'),
  (7,  'Força',       'Trabalho em equipe'),
  (8,  'Fraqueza',    'Comunicação Interna'),
  (9,  'Fraqueza',    'Transparencia'),
  (10, 'Fraqueza',    'Engajamento com Cultura'),
  (11, 'Fraqueza',    'Area Comercial'),
  (12, 'Fraqueza',    'Atendimento Societario'),
  (13, 'Fraqueza',    'Sobrecarga equipe'),
  (14, 'Oportunidade','Tecnologia'),
  (15, 'Oportunidade','IA'),
  (16, 'Oportunidade','Verticalização'),
  (17, 'Oportunidade','Automação de Rotinas e Processos'),
  (18, 'Ameaça',      'Concorrentes'),
  (19, 'Ameaça',      'Legislação'),
  (20, 'Ameaça',      'Retenção de Equipe'),
  (21, 'Ameaça',      'Processo de contratação')
ON CONFLICT DO NOTHING;

-- =============================================================
-- matriz_risco (2 registros)
-- =============================================================
INSERT INTO matriz_risco (id, risco, probabilidade, medidas_redutoras, medidas_exposicao) VALUES
  (
    1,
    'Perder clientes',
    'Alto',
    E'• Ter processos bem definidos / Acompanhar\n• Cuidado no atendimento\n• Atualização equipe / Legislação\n• Proatividade em captar clientes\n• Ter um CS\n• Fazer cliente enxergar valor no serviço ao inves de preço',
    E'• Identificar motivos e causas\n• Trabalhar motivos com Time'
  ),
  (
    2,
    'Perder equipe',
    'Média',
    E'• Cultura de feedback / Avaliações\n• Integrações / Endomkt\n• On boarding com acompanhamento\n• Treinamento e Capacitação\n• Contratações',
    E'• Contratar novas pessoas\n• Cultura de entender motivos da saída'
  )
ON CONFLICT DO NOTHING;

-- =============================================================
-- raiox_visao (1 registro)
-- =============================================================
INSERT INTO raiox_visao (id, faturamento, meses, clientes)
VALUES (1, 923700.94, 12, 1200)
ON CONFLICT DO NOTHING;

-- =============================================================
-- raiox_produtos (5 registros)
-- =============================================================
INSERT INTO raiox_produtos (id, nome, faturamento, vendas) VALUES
  (1, 'Mensalidade',           150000.0, 0),
  (2, 'BPO',                   300000.0, 0),
  (3, 'Imposto de Renda',      150000.0, 0),
  (4, 'Parcelamento',          100000.0, 200),
  (5, 'Contratos e Alterações', 50000.0, 85)
ON CONFLICT DO NOTHING;

-- =============================================================
-- metas_gerais (1 registro)
-- =============================================================
INSERT INTO metas_gerais (id, objetivo, meta_faturamento, meta_lucro)
VALUES (
  1,
  'Faturar 2 Milhões de reais no ano com 30% de Margem Líquida e Geração caixa em 12 meses.',
  2000000.0,
  600000.0
)
ON CONFLICT DO NOTHING;

-- =============================================================
-- metas_produtos (7 registros)
-- =============================================================
INSERT INTO metas_produtos (id, nome, faturamento, ticket, clientes) VALUES
  (1, 'Mensalidade',            400000.0,  0.0,    0),
  (2, 'BPO',                    800000.0,  0.0,    0),
  (3, 'Imposto de Renda',       400000.0,  0.0,    0),
  (4, 'Parcelamento',           266667.0,  500.0,  533),
  (5, 'Contratos e Alterações', 133333.0,  588.0,  227),
  (6, 'Alvarás',                     0.0, 1750.0,    0),
  (7, 'Produto Lançamentos',    100000.0, 5000.0,   20)
ON CONFLICT DO NOTHING;

-- =============================================================
-- metas_canais (2 registros)
-- =============================================================
INSERT INTO metas_canais (id, canal, meta_anual) VALUES
  (1, 'Indicação', 339000.0),
  (2, 'Eventos',   960000.0)
ON CONFLICT DO NOTHING;

-- =============================================================
-- objetivos_5w2h (3 registros)
-- =============================================================
INSERT INTO objetivos_5w2h (id, o_que, quem, quando, onde, como, indicador, meta, realizado) VALUES
  (
    1,
    'Estudo da equipe / Atualização de legislação',
    'Encarregados de departamento',
    'A cada 4 meses',
    'Internamente',
    'Treinamentos internos por grupo de colaboradores',
    'Somatório de horas de estudo',
    '360 Horas/Ano',
    '0 Horas'
  ),
  (
    2,
    'Pesquisa de Avaliação de Clima Organizacional',
    'Gestão de Pessoas',
    'Anualmente até 31/10',
    'Internamente',
    'Enviar questionário de Clima para todos os colaboradores',
    'Percentual de pontuação permitida',
    '90%',
    '0%'
  ),
  (
    3,
    'Pesquisa de Satisfação de Clientes (NPS)',
    'Comercial / CS',
    'Anualmente até 31/10',
    'Nos clientes',
    'Enviar questionário de Satisfação para a base',
    'Percentual de promotores',
    '95%',
    '0%'
  )
ON CONFLICT DO NOTHING;

-- =============================================================
-- diretrizes_estrategicas (32 registros)
-- =============================================================
INSERT INTO diretrizes_estrategicas (id, macro_area, sub_area, acao, status) VALUES
  (1,  'VENDAS',  'Canais de venda',         'Indicação + Recompensa',                                                   'Pendente'),
  (2,  'VENDAS',  'Canais de venda',         'Internet (Midias Sociais, Google, etc)',                                   'Pendente'),
  (3,  'VENDAS',  'Canais de venda',         'Boca-boca',                                                               'Pendente'),
  (4,  'VENDAS',  'Canais de venda',         'Participação Eventos',                                                    'Pendente'),
  (5,  'VENDAS',  'Canais de venda',         'Foco em vendas / CRM',                                                    'Pendente'),
  (6,  'VENDAS',  'Produtos',                'Honorário manutençao mensal',                                             'Pendente'),
  (7,  'VENDAS',  'Produtos',                'Parcelamentos + Acompanhamento',                                          'Pendente'),
  (8,  'VENDAS',  'Produtos',                'Bpo',                                                                     'Pendente'),
  (9,  'VENDAS',  'Produtos',                'Emissão de NFs',                                                          'Pendente'),
  (10, 'VENDAS',  'Produtos',                'Societário',                                                              'Pendente'),
  (11, 'VENDAS',  'Produtos',                'Cobranças Serv. Adicionais.',                                             'Pendente'),
  (12, 'VENDAS',  'Produtos',                'Certificado Digital (colocar meta mensal)',                               'Pendente'),
  (13, 'VENDAS',  'Produtos',                'Mentoria',                                                               'Pendente'),
  (14, 'VENDAS',  'Produtos',                'Treinamento',                                                            'Pendente'),
  (15, 'VENDAS',  'Preço',                   'Cuidado e Agregar valor ao serviço',                                      'Pendente'),
  (16, 'VENDAS',  'Parcerias',               'Indicaçao do Próprio cliente',                                           'Pendente'),
  (17, 'VENDAS',  'Parcerias',               'Explorar e rentabilizar parcerias (certificado, societario, juridico, etc)','Pendente'),
  (18, 'VENDAS',  'Cliente / Nicho',         'Especializar em outras areas (Holding, imobiliario, etc)',                'Pendente'),
  (19, 'VENDAS',  'Cliente / Nicho',         'Fomentar captaçao de Prestadores de serviço (Saude, educação, etc)',     'Pendente'),
  (20, 'PESSOAS', 'Desenvolvimento',         'Estruturar avaliaçao de perfomance e comportamental',                     'Pendente'),
  (21, 'PESSOAS', 'Desenvolvimento',         'PDI',                                                                     'Pendente'),
  (22, 'PESSOAS', 'Desenvolvimento',         'Estruturar cronograma + Investimento',                                    'Pendente'),
  (23, 'PESSOAS', 'Desenvolvimento',         'Dedicar horário/Agenda para curso',                                       'Pendente'),
  (24, 'PESSOAS', 'Desenvolvimento',         'Transformar o aprendizado continuo em pilar de cultura',                  'Pendente'),
  (25, 'PESSOAS', 'Desenvolvimento',         'Criar plano de cargos com critérios para evolução e promoção (atrelar a perfomance)', 'Pendente'),
  (26, 'PESSOAS', 'Estruturaçao RH interno', 'Avaliações Desempenho / Performance + Comportamento',                    'Pendente'),
  (27, 'PESSOAS', 'Estruturaçao RH interno', 'Avaliçao de Clima',                                                      'Pendente'),
  (28, 'PESSOAS', 'Estruturaçao RH interno', 'Acompanhamento de Beneficios',                                           'Pendente'),
  (29, 'PESSOAS', 'Estruturaçao RH interno', 'Açoes de EndoMkt',                                                       'Pendente'),
  (30, 'PESSOAS', 'Estruturaçao RH interno', 'Detalhemento de Cargos',                                                 'Pendente'),
  (31, 'PESSOAS', 'Estruturaçao RH interno', 'Políticas de convivio, conduta, etc.',                                   'Pendente'),
  (32, 'PESSOAS', 'Estruturaçao RH interno', 'Detalhemento de on boarding / Colaboradores',                            'Pendente')
ON CONFLICT DO NOTHING;

-- =============================================================
-- agenda_impacto (5 registros)
-- =============================================================
INSERT INTO agenda_impacto (id, evento, data_evento, tipo) VALUES
  (1, 'Feiras Anuais',              '2026-04-15', 'Evento'),
  (2, 'Eventos Anuais',             '2026-04-20', 'Evento'),
  (3, 'Inicio Projeto Contratação', '2026-04-10', 'Projeto'),
  (4, 'Inicio Projeto Marketing',   '2026-04-12', 'Projeto'),
  (5, 'Campanha dias Mães',         '2026-05-10', 'Campanha')
ON CONFLICT DO NOTHING;

-- =============================================================
-- metas_gclick (3 registros)
-- =============================================================
INSERT INTO metas_gclick (id, obrigacao, meta_percentual, valor_atual, prazo_dias, escopo) VALUES
  (1, 'Fechamento Contábil', 100.0, 0.0, 30, 'Empresa'),
  (2, 'Simples Nacional',    100.0, 0.0, 30, 'Empresa'),
  (3, 'Fechamento Folha',    100.0, 0.0, 30, 'Empresa')
ON CONFLICT DO NOTHING;

-- =============================================================
-- indicadores_zappy (2 registros)
-- =============================================================
INSERT INTO indicadores_zappy (id, ticket_id, status, cliente, atendente) VALUES
  (1, 'MENSAGENS_2026-02', 'LOG_MENSAL', '6194',  '774.25'),
  (2, 'MENSAGENS_2026-03', 'LOG_MENSAL', '2189',  '199.0')
ON CONFLICT DO NOTHING;

-- =============================================================
-- ChavePix (3 registros)
-- =============================================================
INSERT INTO "ChavePix" (id, apelido, chave, tipo, criado_em) VALUES
  (1, 'Isaque',  '13810654906',                    'CPF',   '2026-03-06 11:39:08'),
  (2, 'Inter',   '43652468000173',                 'CNPJ',  '2026-03-09 12:49:37'),
  (3, 'Unicred', 'gisele@elogestaocontabil.com.br','EMAIL', '2026-03-09 12:50:11')
ON CONFLICT DO NOTHING;

-- =============================================================
-- Resetar sequences para evitar conflito em futuros INSERTs
-- =============================================================
SELECT setval(pg_get_serial_sequence('metas_gclick',            'id'), 3);
SELECT setval(pg_get_serial_sequence('indicadores_zappy',       'id'), 2);
SELECT setval(pg_get_serial_sequence('kpis_estrategicos',       'id'), 36);
SELECT setval(pg_get_serial_sequence('kpis_setoriais',          'id'), 48);
SELECT setval(pg_get_serial_sequence('analise_swot',            'id'), 21);
SELECT setval(pg_get_serial_sequence('matriz_risco',            'id'), 2);
SELECT setval(pg_get_serial_sequence('raiox_produtos',          'id'), 5);
SELECT setval(pg_get_serial_sequence('metas_produtos',          'id'), 7);
SELECT setval(pg_get_serial_sequence('metas_canais',            'id'), 2);
SELECT setval(pg_get_serial_sequence('objetivos_5w2h',          'id'), 3);
SELECT setval(pg_get_serial_sequence('diretrizes_estrategicas', 'id'), 32);
SELECT setval(pg_get_serial_sequence('agenda_impacto',          'id'), 5);
SELECT setval(pg_get_serial_sequence('"ChavePix"',              'id'), 3);

-- Reabilita checagem de FK
SET session_replication_role = DEFAULT;
