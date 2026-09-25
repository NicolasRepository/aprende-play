-- ============================================================
-- Aprende Play — Schema do Banco de Dados (Neon / PostgreSQL)
-- ============================================================
-- Este arquivo documenta a modelagem completa do banco de dados.
-- As tabelas são criadas via Supabase (que usa PostgreSQL por baixo).
-- Compatível com Neon PostgreSQL.
-- ============================================================

-- 1. PROFILES (extensão de auth.users do Supabase)
--    Armazena dados extras do usuário, incluindo o sistema de roles.
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  role        TEXT NOT NULL DEFAULT 'usuario_comum'
              CHECK (role IN ('usuario_comum', 'usuario_autorizado')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. SUBJECTS (Disciplinas)
--    Disciplinas disponíveis na plataforma (Português, Matemática, etc.)
CREATE TABLE IF NOT EXISTS subjects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  icon        TEXT,
  color       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- 3. GAMES (Jogos disponíveis)
--    Catálogo de jogos educacionais.
CREATE TABLE IF NOT EXISTS games (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  subject_id  UUID REFERENCES subjects(id) ON DELETE SET NULL,
  school_year TEXT NOT NULL,
  difficulty  TEXT DEFAULT 'facil'
              CHECK (difficulty IN ('facil', 'medio', 'dificil')),
  thumbnail   TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- 4. USER_PROGRESS (Pontuações / Progresso)
--    Registra o progresso e pontuação de cada usuário em cada jogo.
CREATE TABLE IF NOT EXISTS user_progress (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL DEFAULT auth.uid()
              REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id     UUID REFERENCES games(id) ON DELETE CASCADE,
  score       INTEGER DEFAULT 0,
  completed   BOOLEAN DEFAULT false,
  played_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLÍTICAS DE SEGURANÇA (RLS - Row Level Security)
-- ============================================================

-- PROFILES: cada usuário vê e edita apenas seu próprio perfil.
-- Usuários autorizados (usuario_autorizado) podem ver todos os perfis.
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id OR role = 'usuario_autorizado');

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- SUBJECTS: leitura pública para usuários autenticados.
DROP POLICY IF EXISTS "select_subjects" ON subjects;
CREATE POLICY "select_subjects" ON subjects
  FOR SELECT TO authenticated USING (true);

-- GAMES: leitura pública para usuários autenticados.
-- Apenas usuários autorizados podem criar/editar/deletar jogos.
DROP POLICY IF EXISTS "select_games" ON games;
CREATE POLICY "select_games" ON games
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_games_authorized" ON games;
CREATE POLICY "insert_games_authorized" ON games
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'usuario_autorizado')
  );

DROP POLICY IF EXISTS "update_games_authorized" ON games;
CREATE POLICY "update_games_authorized" ON games
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'usuario_autorizado')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'usuario_autorizado')
  );

DROP POLICY IF EXISTS "delete_games_authorized" ON games;
CREATE POLICY "delete_games_authorized" ON games
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'usuario_autorizado')
  );

-- USER_PROGRESS: cada usuário vê apenas seu próprio progresso.
DROP POLICY IF EXISTS "select_own_progress" ON user_progress;
CREATE POLICY "select_own_progress" ON user_progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_progress" ON user_progress;
CREATE POLICY "insert_own_progress" ON user_progress
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_progress" ON user_progress;
CREATE POLICY "update_own_progress" ON user_progress
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_progress" ON user_progress;
CREATE POLICY "delete_own_progress" ON user_progress
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_games_subject_id ON games(subject_id);
CREATE INDEX IF NOT EXISTS idx_games_school_year ON games(school_year);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_game_id ON user_progress(game_id);

-- ============================================================
-- TRIGGER: criar profile automaticamente no signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'usuario_comum');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
