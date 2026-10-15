-- ==============================================================================
-- SUPABASE MIGRATION: 20261008000002_seed_initial_data.sql
-- Aplicação: Português Tático - Seed de Dados Iniciais Seguros
-- NOTA DE SEGURANÇA: Usuários NÃO são criados por este script.
-- O provisionamento de usuários é gerido exclusivamente via Supabase Auth (auth.users)
-- que dispara o trigger public.handle_new_user_fn().
-- ==============================================================================

-- 1. SEED CONDICIONAL: PROPOSTA DE REDAÇÃO INICIAL (Com Rubrica Dinâmica 0 a 10)
-- Apenas insere a proposta caso exista um professor provisionado no sistema
DO $$
DECLARE
  v_teacher_id TEXT;
BEGIN
  -- Identifica o primeiro professor cadastrado via Supabase Auth
  SELECT id INTO v_teacher_id FROM public.profiles WHERE role = 'professor' LIMIT 1;

  IF v_teacher_id IS NOT NULL THEN
    INSERT INTO public.proposals (
      id, title, theme, instructions, deadline, status, created_by, created_at
    ) VALUES (
      'prop_tatica_01',
      'A Atuação Integrada das Forças de Segurança Pública no Combate às Facções Criminosas',
      'O papel da inteligência policial e da cooperação interinstitucional no enfrentamento ao crime organizado no Brasil.',
      'Elabore um texto dissertativo-argumentativo em norma-padrão da Língua Portuguesa, contendo entre 20 e 30 linhas. Apresente posicionamento crítico embasado na Constituição Federal de 1988 e em dados doutrinários de segurança pública.',
      '2026-11-30T23:59:59.000Z',
      'rascunho',
      v_teacher_id,
      timezone('utc'::text, now())
    )
    ON CONFLICT (id) DO NOTHING;

    -- 2. CRITÉRIOS DA RUBRICA (4 critérios de 2,50 = 10,00 pontos exatos)
    INSERT INTO public.proposal_criteria (
      id, proposal_id, name, description, max_points, order_index
    ) VALUES 
    (
      'crit_01_tema',
      'prop_tatica_01',
      'Critério 1: Adequação Temática e Tipologia Textual',
      'Compreensão da proposta, não tangenciamento do tema e domínio da estrutura dissertativo-argumentativa com tese explícita.',
      2.50,
      1
    ),
    (
      'crit_02_coesao',
      'prop_tatica_01',
      'Critério 2: Coesão Interparágrafos e Intraparágrafos',
      'Emprego diversificado e adequado de conectivos lógicos, pronomes anafóricos e concatenação de períodos.',
      2.50,
      2
    ),
    (
      'crit_03_argumentacao',
      'prop_tatica_01',
      'Critério 3: Consistência Argumentativa e Repertório',
      'Fundamentação com fatos, dados, legislação (CF/88) ou pensamento de autoridade, evitando senso comum.',
      2.50,
      3
    ),
    (
      'crit_04_gramatica',
      'prop_tatica_01',
      'Critério 4: Norma Culta e Correção Gramatical',
      'Domínio da concordância verbal/nominal, regência, crase, pontuação e precisão vocabular sem marcas de oralidade.',
      2.50,
      4
    )
    ON CONFLICT (id) DO NOTHING;

    -- 3. ATIVAÇÃO DA PROPOSTA APÓS CONFIRMAÇÃO DOS 10,00 PONTOS
    UPDATE public.proposals
    SET status = 'ativa'
    WHERE id = 'prop_tatica_01';
  END IF;
END $$;

