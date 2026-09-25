-- Níveis de Alfabetização (substitui "1º ao 5º ano")
CREATE TABLE IF NOT EXISTS literacy_levels (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  order_index INT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE literacy_levels ENABLE ROW LEVEL SECURITY;

INSERT INTO literacy_levels (slug, name, order_index) VALUES
  ('pre_silabico', 'Pré-silábico', 1),
  ('silabico', 'Silábico', 2),
  ('silabico_alfabetico', 'Silábico-alfabético', 3),
  ('alfabetico', 'Alfabético', 4),
  ('ortografico', 'Ortográfico', 5)
ON CONFLICT (slug) DO NOTHING;

-- Músicas (conteúdo-fonte dos jogos)
CREATE TABLE IF NOT EXISTS songs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  artist      TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Linhas/frases da música (usadas para Fatiado e Lacunado)
CREATE TABLE IF NOT EXISTS song_lines (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id     UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  line_order  INT NOT NULL,
  text        TEXT NOT NULL,
  gap_word    TEXT,           -- palavra a ser lacunada (deve existir em "text")
  gap_options TEXT[] DEFAULT '{}', -- alternativas (inclui gap_word)
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (song_id, line_order)
);
ALTER TABLE song_lines ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_song_lines_song_id ON song_lines(song_id, line_order);

-- Games: remove ano escolar, adiciona nível de alfabetização, tipo de jogo e música
ALTER TABLE games DROP COLUMN IF EXISTS school_year;
ALTER TABLE games
  ADD COLUMN IF NOT EXISTS literacy_level_id UUID REFERENCES literacy_levels(id),
  ADD COLUMN IF NOT EXISTS song_id UUID REFERENCES songs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS game_type TEXT NOT NULL DEFAULT 'texto_lacunado'
      CHECK (game_type IN ('texto_lacunado', 'texto_fatiado', 'fatiado_lacunado'));
CREATE INDEX IF NOT EXISTS idx_games_literacy_level_id ON games(literacy_level_id);

-- RLS (mesmo padrão de subjects/games: leitura pública, escrita só usuario_autorizado)
DROP POLICY IF EXISTS "select_literacy_levels" ON literacy_levels;
CREATE POLICY "select_literacy_levels" ON literacy_levels FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "select_songs" ON songs;
CREATE POLICY "select_songs" ON songs FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "write_songs_authorized" ON songs;
CREATE POLICY "write_songs_authorized" ON songs FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'usuario_autorizado'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'usuario_autorizado'));

DROP POLICY IF EXISTS "select_song_lines" ON song_lines;
CREATE POLICY "select_song_lines" ON song_lines FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "write_song_lines_authorized" ON song_lines;
CREATE POLICY "write_song_lines_authorized" ON song_lines FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'usuario_autorizado'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'usuario_autorizado'));

-- Seed de disciplinas (icon = nome do ícone lucide-react)
INSERT INTO subjects (name, slug, icon, color) VALUES
  ('Português', 'portugues', 'BookOpen', '#FF6600'),
  ('Matemática', 'matematica', 'Calculator', '#3B82F6'),
  ('Ciências', 'ciencias', 'FlaskConical', '#10B981'),
  ('História', 'historia', 'Landmark', '#F59E0B'),
  ('Geografia', 'geografia', 'Globe', '#8B5CF6')
ON CONFLICT (slug) DO NOTHING;

-- Exemplo de conteúdo (professor pode duplicar este padrão)
INSERT INTO songs (id, title, artist) VALUES
  ('00000000-0000-0000-0000-000000000001', 'A Barata', 'Cantiga popular')
ON CONFLICT (id) DO NOTHING;

INSERT INTO song_lines (song_id, line_order, text, gap_word, gap_options) VALUES
  ('00000000-0000-0000-0000-000000000001', 1, 'A barata diz que tem', 'tem', ARRAY['tem','viu','fez']),
  ('00000000-0000-0000-0000-000000000001', 2, 'Sete saias de filó', 'filó', ARRAY['filó','ouro','pano']),
  ('00000000-0000-0000-0000-000000000001', 3, 'É mentira da barata', 'mentira', ARRAY['mentira','verdade','festa']),
  ('00000000-0000-0000-0000-000000000001', 4, 'Ela tem é um só', 'só', ARRAY['só','dois','nada'])
ON CONFLICT (song_id, line_order) DO NOTHING;

INSERT INTO games (title, slug, description, subject_id, literacy_level_id, game_type, song_id, difficulty)
SELECT 'Texto Lacunado: A Barata', 'texto-lacunado-a-barata', 'Complete as palavras que faltam na música!',
  (SELECT id FROM subjects WHERE slug='portugues'),
  (SELECT id FROM literacy_levels WHERE slug='silabico_alfabetico'),
  'texto_lacunado', '00000000-0000-0000-0000-000000000001', 'facil'
WHERE NOT EXISTS (SELECT 1 FROM games WHERE slug='texto-lacunado-a-barata');

INSERT INTO games (title, slug, description, subject_id, literacy_level_id, game_type, song_id, difficulty)
SELECT 'Texto Fatiado: A Barata', 'texto-fatiado-a-barata', 'Coloque as frases da música na ordem certa!',
  (SELECT id FROM subjects WHERE slug='portugues'),
  (SELECT id FROM literacy_levels WHERE slug='silabico'),
  'texto_fatiado', '00000000-0000-0000-0000-000000000001', 'facil'
WHERE NOT EXISTS (SELECT 1 FROM games WHERE slug='texto-fatiado-a-barata');

INSERT INTO games (title, slug, description, subject_id, literacy_level_id, game_type, song_id, difficulty)
SELECT 'Fatiado e Lacunado: A Barata', 'fatiado-lacunado-a-barata', 'Primeiro ordene, depois complete!',
  (SELECT id FROM subjects WHERE slug='portugues'),
  (SELECT id FROM literacy_levels WHERE slug='alfabetico'),
  'fatiado_lacunado', '00000000-0000-0000-0000-000000000001', 'medio'
WHERE NOT EXISTS (SELECT 1 FROM games WHERE slug='fatiado-lacunado-a-barata');
