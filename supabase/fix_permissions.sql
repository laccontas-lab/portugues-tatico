-- ==============================================================================
-- Português Tático - Correção Definitiva de Permissões e Ativação de Contas
-- Execute este script no SQL Editor do seu projeto Supabase (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Conceder permissões para o schema public e todas as tabelas
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 2. Garantir permissões automáticas para quaisquer novas tabelas criadas
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- 3. Confirmar o e-mail do administrador (lac.contas@gmail.com)
UPDATE auth.users
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, timezone('utc'::text, now())),
  confirmed_at = COALESCE(confirmed_at, timezone('utc'::text, now())),
  updated_at = timezone('utc'::text, now())
WHERE LOWER(email) = 'lac.contas@gmail.com';

-- 4. Garantir que a conta do administrador esteja com perfil de professor ativo
INSERT INTO public.profiles (id, name, email, role, status, payment_confirmed, created_at, updated_at)
SELECT 
  id,
  'Prof. Gabriel Figueiredo (Admin)',
  email,
  'professor',
  'ativo',
  true,
  timezone('utc'::text, now()),
  timezone('utc'::text, now())
FROM auth.users
WHERE LOWER(email) = 'lac.contas@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'professor',
  status = 'ativo',
  payment_confirmed = true,
  updated_at = timezone('utc'::text, now());

-- 5. Auto-confirmar todos os demais usuários para eliminar a barreira de confirmação de e-mail
UPDATE auth.users
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, timezone('utc'::text, now())),
  confirmed_at = COALESCE(confirmed_at, timezone('utc'::text, now()))
WHERE email_confirmed_at IS NULL;
