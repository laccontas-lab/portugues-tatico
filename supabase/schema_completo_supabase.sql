-- ==============================================================================
-- PORTUGUÊS TÁTICO — SCRIPT SQL COMPLETO CONSOLIDADO (SUPABASE)
-- Aplicação: Português Tático - Gestão de Redações e Preparação para Concursos
-- Etapa 1: Estrutura de Dados & Autenticação Inicial com Segurança Avançada
--
-- COMO EXECUTAR NO SUPABASE:
-- 1. Acesse o painel do Supabase: https://supabase.com/dashboard/project/_/sql
-- 2. Abra a aba "SQL Editor" e crie uma "New query".
-- 3. Cole todo o conteúdo deste arquivo e clique no botão "RUN".
-- ==============================================================================

-- 1. EXTENSÕES DO POSTGRESQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. ESQUEMA PRIVADO (app_private)
-- Mantido FORA dos esquemas expostos pelo PostgREST para segurança máxima
-- ==============================================================================
CREATE SCHEMA IF NOT EXISTS app_private;

-- Revoga acesso público e anônimo do esquema privado
REVOKE ALL ON SCHEMA app_private FROM PUBLIC;
REVOKE ALL ON SCHEMA app_private FROM anon;

-- Concede apenas USAGE aos papéis autenticados e ao serviço do backend
GRANT USAGE ON SCHEMA app_private TO authenticated, service_role;

-- ==============================================================================
-- 2.1 COMPATIBILIDADE: Garante colunas caso as tabelas já tenham sido criadas anteriormente
-- Evita o erro 42703 (column proposal_id does not exist)
-- ==============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'proposal_criteria') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'proposal_criteria' AND column_name = 'proposal_id') THEN
      DROP TABLE public.proposal_criteria CASCADE;
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'essays') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'essays' AND column_name = 'proposal_id') THEN
      DROP TABLE public.essays CASCADE;
    END IF;
  END IF;
END $$;

-- ==============================================================================
-- 3. TABELA: profiles (Usuários / Professor / Alunos)
-- Vinculada aos UUIDs oficiais do Supabase Auth (auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'aluno' CHECK (role IN ('professor', 'aluno')),
  cpf TEXT,
  phone TEXT,
  target_exam TEXT,
  status TEXT NOT NULL DEFAULT 'pendente_aprovacao' CHECK (status IN ('ativo', 'inativo', 'pendente_aprovacao')),
  payment_confirmed BOOLEAN DEFAULT false,
  must_change_password BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- ==============================================================================
-- 3.1 TRIGGER DE CRIAÇÃO AUTOMÁTICA DE PERFIL (Supabase Auth -> public.profiles)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user_fn()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, name, email, role, cpf, phone, target_exam, status, created_at, updated_at
  ) VALUES (
    NEW.id::text,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'aluno',
    NEW.raw_user_meta_data->>'cpf',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'target_exam',
    'pendente_aprovacao',
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = timezone('utc'::text, now());

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_fn();

-- Procedimento administrativo seguro para atribuir papel de professor
CREATE OR REPLACE FUNCTION app_private.promote_user_to_teacher(p_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id TEXT;
BEGIN
  IF current_user <> 'service_role' AND current_setting('request.jwt.claim.role', true) <> 'service_role' THEN
    RAISE EXCEPTION 'Acesso negado: somente o procedimento administrativo pode promover um professor.';
  END IF;

  SELECT id INTO v_user_id FROM public.profiles WHERE LOWER(email) = LOWER(p_email);
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário com e-mail % não encontrado na base de perfis.', p_email;
  END IF;

  UPDATE public.profiles
  SET 
    role = 'professor',
    status = 'ativo',
    payment_confirmed = true,
    updated_at = timezone('utc'::text, now())
  WHERE id = v_user_id;

  RETURN jsonb_build_object('success', true, 'email', p_email, 'role', 'professor', 'status', 'ativo');
END;
$$;

REVOKE ALL ON FUNCTION app_private.promote_user_to_teacher(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION app_private.promote_user_to_teacher(TEXT) FROM anon;
REVOKE ALL ON FUNCTION app_private.promote_user_to_teacher(TEXT) FROM authenticated;
GRANT EXECUTE ON FUNCTION app_private.promote_user_to_teacher(TEXT) TO service_role;

-- ==============================================================================
-- 4. FUNÇÃO AUXILIAR DE AUTORIZAÇÃO: app_private.is_teacher()
-- SECURITY DEFINER, search_path='', qualificação completa, sem recursão
-- ==============================================================================
CREATE OR REPLACE FUNCTION app_private.is_teacher(p_user_id text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = p_user_id
      AND role = 'professor'
      AND status = 'ativo'
  );
$$;

-- Sobrecarga para compatibilidade com tipo UUID
CREATE OR REPLACE FUNCTION app_private.is_teacher(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT app_private.is_teacher(p_user_id::text);
$$;

-- Helper que identifica o usuário autenticado na requisição atual
CREATE OR REPLACE FUNCTION app_private.current_user_is_teacher()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT app_private.is_teacher(nullif(current_setting('request.jwt.claim.sub', true), ''));
$$;

-- Restringe estritamente os privilégios de execução das funções de autorização
REVOKE ALL ON FUNCTION app_private.is_teacher(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION app_private.is_teacher(text) FROM anon;
GRANT EXECUTE ON FUNCTION app_private.is_teacher(text) TO authenticated, service_role;

REVOKE ALL ON FUNCTION app_private.is_teacher(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION app_private.is_teacher(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION app_private.is_teacher(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION app_private.current_user_is_teacher() FROM PUBLIC;
REVOKE ALL ON FUNCTION app_private.current_user_is_teacher() FROM anon;
GRANT EXECUTE ON FUNCTION app_private.current_user_is_teacher() TO authenticated, service_role;

-- ==============================================================================
-- 5. TRIGGER DE PROTEÇÃO DE CAMPOS DO PERFIL
-- Impede elevação de privilégios ou autoaprovação por alunos
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.trg_protect_profile_fields_fn()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_caller_id text;
  v_is_admin boolean;
BEGIN
  -- Se executado pelo service_role (backend confiável), permite alteração administrativa
  IF current_user = 'service_role' OR current_setting('request.jwt.claim.role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  v_caller_id := nullif(current_setting('request.jwt.claim.sub', true), '');
  v_is_admin := app_private.is_teacher(v_caller_id);

  -- Se o chamador não for professor, bloqueia alteração de campos privilegiados
  IF NOT v_is_admin THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Operação não permitida: somente o professor pode alterar papéis de usuário.';
    END IF;

    IF NEW.status IS DISTINCT FROM OLD.status THEN
      RAISE EXCEPTION 'Operação não permitida: somente o professor pode aprovar ou inativar contas.';
    END IF;

    IF NEW.email IS DISTINCT FROM OLD.email THEN
      RAISE EXCEPTION 'Operação não permitida: alteração de e-mail requer procedimento específico.';
    END IF;

    IF NEW.payment_confirmed IS DISTINCT FROM OLD.payment_confirmed THEN
      RAISE EXCEPTION 'Operação não permitida: confirmação de acesso é restrita ao professor.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_fields ON public.profiles;
CREATE TRIGGER trg_protect_profile_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.trg_protect_profile_fields_fn();

-- ==============================================================================
-- 6. TABELA: proposals (Propostas de Redação)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.proposals (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  instructions TEXT NOT NULL,
  deadline TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'ativa', 'arquivada')),
  created_by TEXT REFERENCES public.profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_proposals_status ON public.proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON public.proposals(created_at DESC);

-- ==============================================================================
-- 7. TABELA: proposal_criteria (Rubrica e Critérios de Avaliação por Proposta)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.proposal_criteria (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  proposal_id TEXT NOT NULL REFERENCES public.proposals(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  description TEXT,
  max_points NUMERIC(4,2) NOT NULL CHECK (max_points > 0 AND max_points <= 10.00),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_proposal_criteria_proposal_id ON public.proposal_criteria(proposal_id);

-- ==============================================================================
-- 8. VALIDAÇÃO DE ESCALA DA RUBRICA (Soma exata de 10,00 pontos para ativação)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.trg_validate_proposal_rubric_sum_fn()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_sum NUMERIC(6,2);
BEGIN
  IF NEW.status = 'ativa' THEN
    SELECT COALESCE(SUM(max_points), 0)
    INTO v_sum
    FROM public.proposal_criteria
    WHERE proposal_id = NEW.id;

    IF v_sum <> 10.00 THEN
      RAISE EXCEPTION 'A proposta só pode ser ativada se a soma dos critérios da rubrica for exatamente 10,00 pontos. Soma atual: %', v_sum;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_proposal_rubric_sum ON public.proposals;
CREATE TRIGGER trg_validate_proposal_rubric_sum
  BEFORE INSERT OR UPDATE ON public.proposals
  FOR EACH ROW EXECUTE FUNCTION public.trg_validate_proposal_rubric_sum_fn();

-- ==============================================================================
-- 9. TABELA: essays (Redações enviadas pelos alunos)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.essays (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  proposal_id TEXT REFERENCES public.proposals(id) ON DELETE RESTRICT,
  student_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  student_name TEXT NOT NULL,
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  exam_target TEXT,
  text_content TEXT NOT NULL CHECK (length(trim(text_content)) > 0),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  status TEXT NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Em correção', 'Corrigida', 'enviada', 'em_correcao', 'corrigida')),
  original_file JSONB NOT NULL DEFAULT '{}'::jsonb,
  correction JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_essays_student_id ON public.essays(student_id);
CREATE INDEX IF NOT EXISTS idx_essays_proposal_id ON public.essays(proposal_id);
CREATE INDEX IF NOT EXISTS idx_essays_status ON public.essays(status);
CREATE INDEX IF NOT EXISTS idx_essays_submitted_at ON public.essays(submitted_at DESC);

-- ==============================================================================
-- 10. IMUTABILIDADE DA RUBRICA APÓS A PRIMEIRA SUBMISSÃO
-- Bloqueia alterações de critérios em propostas com redações já vinculadas
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.trg_lock_criteria_on_submission_fn()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_prop_id text;
  v_has_submissions boolean;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_prop_id := OLD.proposal_id;
  ELSE
    v_prop_id := NEW.proposal_id;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.essays WHERE proposal_id = v_prop_id
  ) INTO v_has_submissions;

  IF v_has_submissions THEN
    RAISE EXCEPTION 'A rubrica não pode ser alterada ou excluída após o recebimento da primeira redação para esta proposta.';
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_lock_criteria_on_submission ON public.proposal_criteria;
CREATE TRIGGER trg_lock_criteria_on_submission
  BEFORE INSERT OR UPDATE OR DELETE ON public.proposal_criteria
  FOR EACH ROW EXECUTE FUNCTION public.trg_lock_criteria_on_submission_fn();

-- ==============================================================================
-- 11. TABELA: corrections (Correção vigente da redação)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.corrections (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  essay_id TEXT NOT NULL UNIQUE REFERENCES public.essays(id) ON DELETE RESTRICT,
  teacher_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  general_feedback TEXT,
  strengths TEXT,
  improvements TEXT,
  final_grade NUMERIC(4,2) CHECK (final_grade >= 0.00 AND final_grade <= 10.00),
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'finalizada')),
  corrected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_corrections_essay_id ON public.corrections(essay_id);
CREATE INDEX IF NOT EXISTS idx_corrections_status ON public.corrections(status);

-- ==============================================================================
-- 12. TABELA: correction_criteria_scores (Notas e Comentários Detalhados por Critério)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.correction_criteria_scores (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  correction_id TEXT NOT NULL REFERENCES public.corrections(id) ON DELETE CASCADE,
  criterion_id TEXT NOT NULL REFERENCES public.proposal_criteria(id) ON DELETE RESTRICT,
  score NUMERIC(4,2) NOT NULL CHECK (score >= 0.00),
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_correction_criterion UNIQUE (correction_id, criterion_id)
);

CREATE INDEX IF NOT EXISTS idx_corr_crit_corr_id ON public.correction_criteria_scores(correction_id);

-- ==============================================================================
-- 13. TABELA: correction_versions (Histórico Imutável de Versões Anteriores)
-- Restrita exclusivamente ao professor para consulta e auditoria
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.correction_versions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  essay_id TEXT NOT NULL REFERENCES public.essays(id) ON DELETE RESTRICT,
  correction_id TEXT NOT NULL REFERENCES public.corrections(id) ON DELETE RESTRICT,
  teacher_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  version_number INTEGER NOT NULL,
  general_feedback TEXT,
  strengths TEXT,
  improvements TEXT,
  final_grade NUMERIC(4,2) NOT NULL,
  criteria_snapshot JSONB NOT NULL,
  archived_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_essay_version UNIQUE (essay_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_correction_versions_essay_id ON public.correction_versions(essay_id);

-- ==============================================================================
-- 14. TABELAS DE APOIO PEDAGÓGICO
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.exam_boards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('civil', 'militar')),
  slug TEXT NOT NULL UNIQUE,
  characteristics TEXT NOT NULL,
  scoring_criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_structure TEXT NOT NULL,
  tactical_tips JSONB NOT NULL DEFAULT '[]'::jsonb,
  sample_theme TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.text_guides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  key_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  practical_example TEXT NOT NULL,
  checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.tactical_method (
  id TEXT PRIMARY KEY,
  number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  objective TEXT NOT NULL,
  execution_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  model_template TEXT NOT NULL,
  golden_rule TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.weekly_missions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  objective TEXT NOT NULL,
  target_subject TEXT NOT NULL,
  tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
  start_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  end_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.student_stats (
  student_id TEXT PRIMARY KEY REFERENCES public.profiles(id) ON DELETE RESTRICT,
  essays_submitted INTEGER NOT NULL DEFAULT 0,
  essays_corrected INTEGER NOT NULL DEFAULT 0,
  average_grade NUMERIC(4,2) NOT NULL DEFAULT 0.00,
  highest_grade NUMERIC(4,2) NOT NULL DEFAULT 0.00,
  lowest_grade NUMERIC(4,2) NOT NULL DEFAULT 0.00,
  latest_grade NUMERIC(4,2),
  grade_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  questions_answered INTEGER NOT NULL DEFAULT 0,
  questions_correct INTEGER NOT NULL DEFAULT 0,
  accuracy_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  subject_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
  critical_weaknesses JSONB NOT NULL DEFAULT '[]'::jsonb,
  frequent_attention_points JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 15. TRIGGERS AUTOMÁTICOS DE updated_at
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_proposals_updated_at ON public.proposals;
CREATE TRIGGER set_proposals_updated_at BEFORE UPDATE ON public.proposals FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_proposal_criteria_updated_at ON public.proposal_criteria;
CREATE TRIGGER set_proposal_criteria_updated_at BEFORE UPDATE ON public.proposal_criteria FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_essays_updated_at ON public.essays;
CREATE TRIGGER set_essays_updated_at BEFORE UPDATE ON public.essays FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_corrections_updated_at ON public.corrections;
CREATE TRIGGER set_corrections_updated_at BEFORE UPDATE ON public.corrections FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_correction_criteria_scores_updated_at ON public.correction_criteria_scores;
CREATE TRIGGER set_correction_criteria_scores_updated_at BEFORE UPDATE ON public.correction_criteria_scores FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 16. OPERAÇÃO TRANSACIONAL ATÔMICA: save_correction_transaction()
-- Gravação segura com validação de notas na rubrica do banco e arquivamento de versões
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.save_correction_transaction(
  p_essay_id TEXT,
  p_status TEXT, -- 'rascunho' | 'finalizada'
  p_general_feedback TEXT,
  p_strengths TEXT,
  p_improvements TEXT,
  p_criteria_scores JSONB -- Array: [{"criterion_id": "...", "score": 2.5, "comments": "..."}]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_caller_id text;
  v_essay RECORD;
  v_prop_criteria_count integer;
  v_item JSONB;
  v_crit_id text;
  v_score NUMERIC(4,2);
  v_crit_max NUMERIC(4,2);
  v_total_grade NUMERIC(4,2) := 0.00;
  v_existing_corr RECORD;
  v_next_version integer := 1;
  v_prior_snapshot JSONB;
  v_corr_id text;
  v_scores_received_count integer := 0;
BEGIN
  -- 1. Valida identidade e permissão de professor
  v_caller_id := nullif(current_setting('request.jwt.claim.sub', true), '');
  IF current_user <> 'service_role' AND current_setting('request.jwt.claim.role', true) <> 'service_role' THEN
    IF NOT app_private.is_teacher(v_caller_id) THEN
      RAISE EXCEPTION 'Acesso negado: apenas o professor autorizado pode registrar ou finalizar correções.';
    END IF;
  END IF;

  -- 2. Valida existência da redação
  SELECT id, proposal_id, student_id, student_name, status
  INTO v_essay
  FROM public.essays
  WHERE id = p_essay_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Redação com ID % não encontrada.', p_essay_id;
  END IF;

  IF p_status NOT IN ('rascunho', 'finalizada') THEN
    RAISE EXCEPTION 'Status de correção inválido: %. Permitido: rascunho ou finalizada.', p_status;
  END IF;

  -- 3. Validação dos critérios e notas baseada na rubrica oficial do banco
  IF p_criteria_scores IS NOT NULL AND jsonb_typeof(p_criteria_scores) = 'array' THEN
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_criteria_scores)
    LOOP
      v_crit_id := v_item->>'criterion_id';
      v_score := (v_item->>'score')::NUMERIC(4,2);

      -- Busca o critério na rubrica oficial da proposta
      SELECT max_points INTO v_crit_max
      FROM public.proposal_criteria
      WHERE id = v_crit_id AND proposal_id = v_essay.proposal_id;

      IF NOT FOUND THEN
        RAISE EXCEPTION 'Critério % não pertence à proposta da redação avaliada.', v_crit_id;
      END IF;

      IF v_score < 0.00 THEN
        RAISE EXCEPTION 'A pontuação do critério % não pode ser negativa.', v_crit_id;
      END IF;

      IF v_score > v_crit_max THEN
        RAISE EXCEPTION 'A pontuação informada (%) excede a pontuação máxima permitida (%) para o critério %.', v_score, v_crit_max, v_crit_id;
      END IF;

      v_total_grade := v_total_grade + v_score;
      v_scores_received_count := v_scores_received_count + 1;
    END LOOP;
  END IF;

  -- 4. Validações adicionais para finalização definitiva
  IF p_status = 'finalizada' THEN
    IF p_general_feedback IS NULL OR length(trim(p_general_feedback)) = 0 THEN
      RAISE EXCEPTION 'A devolutiva geral é obrigatória para finalizar a correção.';
    END IF;

    -- Garante que todos os critérios da proposta foram preenchidos
    SELECT count(*) INTO v_prop_criteria_count
    FROM public.proposal_criteria
    WHERE proposal_id = v_essay.proposal_id;

    IF v_scores_received_count < v_prop_criteria_count THEN
      RAISE EXCEPTION 'Todos os % critérios da rubrica devem ser avaliados para finalizar a correção (recebidos: %).', v_prop_criteria_count, v_scores_received_count;
    END IF;
  END IF;

  -- 5. Consulta correção vigente atual
  SELECT id, general_feedback, strengths, improvements, final_grade, status
  INTO v_existing_corr
  FROM public.corrections
  WHERE essay_id = p_essay_id;

  -- 6. Arquivamento seguro de histórico se a versão existente já estiver finalizada
  IF FOUND AND v_existing_corr.status = 'finalizada' THEN
    -- Calcula próximo número de versão
    SELECT COALESCE(MAX(version_number), 0) + 1
    INTO v_next_version
    FROM public.correction_versions
    WHERE essay_id = p_essay_id;

    -- Constrói snapshot detalhado dos critérios anteriores
    SELECT jsonb_agg(
      jsonb_build_object(
        'criterion_id', cs.criterion_id,
        'criterion_name', pc.name,
        'max_points', pc.max_points,
        'score', cs.score,
        'comments', cs.comments
      )
    )
    INTO v_prior_snapshot
    FROM public.correction_criteria_scores cs
    JOIN public.proposal_criteria pc ON pc.id = cs.criterion_id
    WHERE cs.correction_id = v_existing_corr.id;

    -- Salva na tabela imutável de versões
    INSERT INTO public.correction_versions (
      essay_id,
      correction_id,
      teacher_id,
      version_number,
      general_feedback,
      strengths,
      improvements,
      final_grade,
      criteria_snapshot,
      archived_at
    ) VALUES (
      p_essay_id,
      v_existing_corr.id,
      COALESCE(v_caller_id, 'servico'),
      v_next_version,
      v_existing_corr.general_feedback,
      v_existing_corr.strengths,
      v_existing_corr.improvements,
      v_existing_corr.final_grade,
      COALESCE(v_prior_snapshot, '[]'::jsonb),
      timezone('utc'::text, now())
    );
  END IF;

  -- 7. Gravação ou atualização da correção vigente
  IF v_existing_corr.id IS NOT NULL THEN
    v_corr_id := v_existing_corr.id;
    UPDATE public.corrections
    SET
      teacher_id = COALESCE(v_caller_id, teacher_id),
      general_feedback = p_general_feedback,
      strengths = p_strengths,
      improvements = p_improvements,
      final_grade = CASE WHEN p_status = 'finalizada' THEN v_total_grade ELSE v_total_grade END,
      status = p_status,
      corrected_at = CASE WHEN p_status = 'finalizada' THEN timezone('utc'::text, now()) ELSE corrected_at END,
      updated_at = timezone('utc'::text, now())
    WHERE id = v_corr_id;
  ELSE
    v_corr_id := gen_random_uuid()::text;
    INSERT INTO public.corrections (
      id,
      essay_id,
      teacher_id,
      general_feedback,
      strengths,
      improvements,
      final_grade,
      status,
      corrected_at
    ) VALUES (
      v_corr_id,
      p_essay_id,
      COALESCE(v_caller_id, 'user_prof_gabriel'),
      p_general_feedback,
      p_strengths,
      p_improvements,
      v_total_grade,
      p_status,
      CASE WHEN p_status = 'finalizada' THEN timezone('utc'::text, now()) ELSE NULL END
    );
  END IF;

  -- 8. Atualiza ou insere pontuações dos critérios detalhados
  IF p_criteria_scores IS NOT NULL AND jsonb_typeof(p_criteria_scores) = 'array' THEN
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_criteria_scores)
    LOOP
      v_crit_id := v_item->>'criterion_id';
      v_score := (v_item->>'score')::NUMERIC(4,2);

      INSERT INTO public.correction_criteria_scores (
        correction_id,
        criterion_id,
        score,
        comments,
        updated_at
      ) VALUES (
        v_corr_id,
        v_crit_id,
        v_score,
        v_item->>'comments',
        timezone('utc'::text, now())
      )
      ON CONFLICT (correction_id, criterion_id)
      DO UPDATE SET
        score = EXCLUDED.score,
        comments = EXCLUDED.comments,
        updated_at = timezone('utc'::text, now());
    END LOOP;
  END IF;

  -- 9. Atualiza status na tabela de redações
  UPDATE public.essays
  SET
    status = CASE 
      WHEN p_status = 'finalizada' THEN 'Corrigida'
      ELSE 'Em correção'
    END,
    updated_at = timezone('utc'::text, now())
  WHERE id = p_essay_id;

  RETURN jsonb_build_object(
    'success', true,
    'correction_id', v_corr_id,
    'essay_id', p_essay_id,
    'final_grade', v_total_grade,
    'status', p_status,
    'version_archived', (v_existing_corr.status = 'finalizada')
  );
END;
$$;

-- Restringe estritamente execução de save_correction_transaction()
REVOKE ALL ON FUNCTION public.save_correction_transaction(TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.save_correction_transaction(TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) FROM anon;
GRANT EXECUTE ON FUNCTION public.save_correction_transaction(TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) TO authenticated, service_role;

-- ==============================================================================
-- 17. OPERAÇÕES CONTROLADAS: APROVAÇÃO E INATIVAÇÃO DE ALUNOS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.approve_student_account(p_student_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_caller_id text;
BEGIN
  v_caller_id := nullif(current_setting('request.jwt.claim.sub', true), '');
  IF current_user <> 'service_role' AND current_setting('request.jwt.claim.role', true) <> 'service_role' THEN
    IF NOT app_private.is_teacher(v_caller_id) THEN
      RAISE EXCEPTION 'Apenas o professor tem permissão para aprovar alunos.';
    END IF;
  END IF;

  UPDATE public.profiles
  SET
    status = 'ativo',
    payment_confirmed = true,
    updated_at = timezone('utc'::text, now())
  WHERE id = p_student_id AND role = 'aluno';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Aluno com ID % não encontrado ou já com outro papel.', p_student_id;
  END IF;

  RETURN jsonb_build_object('success', true, 'student_id', p_student_id, 'status', 'ativo');
END;
$$;

REVOKE ALL ON FUNCTION public.approve_student_account(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.approve_student_account(TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.approve_student_account(TEXT) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.toggle_student_status(p_student_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_caller_id text;
  v_current_status text;
  v_new_status text;
BEGIN
  v_caller_id := nullif(current_setting('request.jwt.claim.sub', true), '');
  IF current_user <> 'service_role' AND current_setting('request.jwt.claim.role', true) <> 'service_role' THEN
    IF NOT app_private.is_teacher(v_caller_id) THEN
      RAISE EXCEPTION 'Apenas o professor tem permissão para alterar o status de alunos.';
    END IF;
  END IF;

  SELECT status INTO v_current_status
  FROM public.profiles
  WHERE id = p_student_id AND role = 'aluno';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Aluno com ID % não encontrado.', p_student_id;
  END IF;

  v_new_status := CASE WHEN v_current_status = 'ativo' THEN 'inativo' ELSE 'ativo' END;

  UPDATE public.profiles
  SET
    status = v_new_status,
    updated_at = timezone('utc'::text, now())
  WHERE id = p_student_id;

  RETURN jsonb_build_object('success', true, 'student_id', p_student_id, 'new_status', v_new_status);
END;
$$;

REVOKE ALL ON FUNCTION public.toggle_student_status(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.toggle_student_status(TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.toggle_student_status(TEXT) TO authenticated, service_role;

-- ==============================================================================
-- 18. POLÍTICAS DE SEGURANÇA ROW LEVEL SECURITY (RLS)
-- Execução 100% idempotente (Prevenção definitiva do Erro 42710)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.essays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.correction_criteria_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.correction_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.text_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tactical_method ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_stats ENABLE ROW LEVEL SECURITY;

-- Limpeza segura de todas as políticas anteriores
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'profiles', 'proposals', 'proposal_criteria', 'essays', 
        'corrections', 'correction_criteria_scores', 'correction_versions',
        'exam_boards', 'text_guides', 'tactical_method', 'weekly_missions', 'student_stats'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

-- --- Políticas para PROFILES ---
CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT USING (
    id = nullif(current_setting('request.jwt.claim.sub', true), '')
    OR app_private.current_user_is_teacher()
    OR current_user = 'service_role'
  );

CREATE POLICY "profiles_insert_registration" ON public.profiles
  FOR INSERT WITH CHECK (
    role = 'aluno' AND status = 'pendente_aprovacao'
    OR app_private.current_user_is_teacher()
    OR current_user = 'service_role'
  );

CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE USING (
    id = nullif(current_setting('request.jwt.claim.sub', true), '')
    OR app_private.current_user_is_teacher()
    OR current_user = 'service_role'
  );

-- --- Políticas para PROPOSALS ---
CREATE POLICY "proposals_select_policy" ON public.proposals
  FOR SELECT USING (
    app_private.current_user_is_teacher()
    OR (status IN ('ativa', 'arquivada') AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = nullif(current_setting('request.jwt.claim.sub', true), '')
        AND status = 'ativo'
    ))
    OR current_user = 'service_role'
  );

CREATE POLICY "proposals_teacher_modify" ON public.proposals
  FOR ALL USING (
    app_private.current_user_is_teacher()
    OR current_user = 'service_role'
  );

-- --- Políticas para PROPOSAL_CRITERIA ---
CREATE POLICY "proposal_criteria_select_policy" ON public.proposal_criteria
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.proposals p
      WHERE p.id = proposal_criteria.proposal_id
        AND (
          app_private.current_user_is_teacher()
          OR (p.status IN ('ativa', 'arquivada'))
          OR current_user = 'service_role'
        )
    )
  );

CREATE POLICY "proposal_criteria_teacher_modify" ON public.proposal_criteria
  FOR ALL USING (
    app_private.current_user_is_teacher()
    OR current_user = 'service_role'
  );

-- --- Políticas para ESSAYS ---
CREATE POLICY "essays_select_policy" ON public.essays
  FOR SELECT USING (
    student_id = nullif(current_setting('request.jwt.claim.sub', true), '')
    OR app_private.current_user_is_teacher()
    OR current_user = 'service_role'
  );

CREATE POLICY "essays_insert_student" ON public.essays
  FOR INSERT WITH CHECK (
    student_id = nullif(current_setting('request.jwt.claim.sub', true), '')
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = nullif(current_setting('request.jwt.claim.sub', true), '')
        AND status = 'ativo'
    )
    OR app_private.current_user_is_teacher()
    OR current_user = 'service_role'
  );

CREATE POLICY "essays_update_policy" ON public.essays
  FOR UPDATE USING (
    (student_id = nullif(current_setting('request.jwt.claim.sub', true), '') AND status = 'Pendente')
    OR app_private.current_user_is_teacher()
    OR current_user = 'service_role'
  );

-- --- Políticas para CORRECTIONS ---
CREATE POLICY "corrections_select_policy" ON public.corrections
  FOR SELECT USING (
    app_private.current_user_is_teacher()
    OR (
      status = 'finalizada'
      AND EXISTS (
        SELECT 1 FROM public.essays e
        WHERE e.id = corrections.essay_id
          AND e.student_id = nullif(current_setting('request.jwt.claim.sub', true), '')
      )
    )
    OR current_user = 'service_role'
  );

CREATE POLICY "corrections_block_direct_insert" ON public.corrections
  FOR INSERT WITH CHECK (current_user = 'service_role');

CREATE POLICY "corrections_block_direct_update" ON public.corrections
  FOR UPDATE USING (current_user = 'service_role');

-- --- Políticas para CORRECTION_CRITERIA_SCORES ---
CREATE POLICY "criteria_scores_select_policy" ON public.correction_criteria_scores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.corrections c
      WHERE c.id = correction_criteria_scores.correction_id
        AND (
          app_private.current_user_is_teacher()
          OR (
            c.status = 'finalizada'
            AND EXISTS (
              SELECT 1 FROM public.essays e
              WHERE e.id = c.essay_id
                AND e.student_id = nullif(current_setting('request.jwt.claim.sub', true), '')
            )
          )
          OR current_user = 'service_role'
        )
    )
  );

CREATE POLICY "criteria_scores_block_direct_insert" ON public.correction_criteria_scores
  FOR INSERT WITH CHECK (current_user = 'service_role');

CREATE POLICY "criteria_scores_block_direct_update" ON public.correction_criteria_scores
  FOR UPDATE USING (current_user = 'service_role');

-- --- Políticas para CORRECTION_VERSIONS ---
CREATE POLICY "correction_versions_teacher_select" ON public.correction_versions
  FOR SELECT USING (
    app_private.current_user_is_teacher()
    OR current_user = 'service_role'
  );

CREATE POLICY "correction_versions_block_direct_write" ON public.correction_versions
  FOR INSERT WITH CHECK (current_user = 'service_role');

-- --- Políticas para Guias de Apoio e Estatísticas ---
CREATE POLICY "exam_boards_select" ON public.exam_boards FOR SELECT USING (true);
CREATE POLICY "exam_boards_modify" ON public.exam_boards FOR ALL USING (app_private.current_user_is_teacher() OR current_user = 'service_role');

CREATE POLICY "text_guides_select" ON public.text_guides FOR SELECT USING (true);
CREATE POLICY "text_guides_modify" ON public.text_guides FOR ALL USING (app_private.current_user_is_teacher() OR current_user = 'service_role');

CREATE POLICY "tactical_method_select" ON public.tactical_method FOR SELECT USING (true);
CREATE POLICY "tactical_method_modify" ON public.tactical_method FOR ALL USING (app_private.current_user_is_teacher() OR current_user = 'service_role');

CREATE POLICY "weekly_missions_select" ON public.weekly_missions FOR SELECT USING (true);
CREATE POLICY "weekly_missions_modify" ON public.weekly_missions FOR ALL USING (app_private.current_user_is_teacher() OR current_user = 'service_role');

CREATE POLICY "student_stats_select" ON public.student_stats
  FOR SELECT USING (
    student_id = nullif(current_setting('request.jwt.claim.sub', true), '')
    OR app_private.current_user_is_teacher()
    OR current_user = 'service_role'
  );

CREATE POLICY "student_stats_modify" ON public.student_stats
  FOR ALL USING (app_private.current_user_is_teacher() OR current_user = 'service_role');

-- ==============================================================================
-- 19. SEED DE DADOS INICIAIS (Seguro: sem criação estática de usuários)
-- ==============================================================================
-- Propostas e critérios condicionais vinculados ao primeiro professor cadastrado
DO $$
DECLARE
  v_teacher_id TEXT;
BEGIN
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

    INSERT INTO public.proposal_criteria (id, proposal_id, name, description, max_points, order_index)
    VALUES 
      ('crit_01_tema', 'prop_tatica_01', 'Critério 1: Adequação Temática e Tipologia Textual', 'Compreensão da proposta, não tangenciamento do tema e domínio da estrutura dissertativo-argumentativa com tese explícita.', 2.50, 1),
      ('crit_02_coesao', 'prop_tatica_01', 'Critério 2: Coesão Interparágrafos e Intraparágrafos', 'Emprego diversificado e adequado de conectivos lógicos, pronomes anafóricos e concatenação de períodos.', 2.50, 2),
      ('crit_03_argumentacao', 'prop_tatica_01', 'Critério 3: Consistência Argumentativa e Repertório', 'Fundamentação com fatos, dados, legislação (CF/88) ou pensamento de autoridade, evitando senso comum.', 2.50, 3),
      ('crit_04_gramatica', 'prop_tatica_01', 'Critério 4: Norma Culta e Correção Gramatical', 'Domínio da concordância verbal/nominal, regência, crase, pontuação e precisão vocabular sem marcas de oralidade.', 2.50, 4)
    ON CONFLICT (id) DO NOTHING;

    UPDATE public.proposals SET status = 'ativa' WHERE id = 'prop_tatica_01';
  END IF;
END $$;

