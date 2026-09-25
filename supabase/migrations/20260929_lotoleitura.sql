-- supabase/migrations/20260929_lotoleitura.sql

CREATE TABLE IF NOT EXISTS lotoleitura_words (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word              TEXT NOT NULL,
  image_url         TEXT NOT NULL,
  literacy_level_id UUID REFERENCES literacy_levels(id),
  created_at        TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE lotoleitura_words ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_lotoleitura_words" ON lotoleitura_words;
CREATE POLICY "select_lotoleitura_words" ON lotoleitura_words
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "write_lotoleitura_words_authorized" ON lotoleitura_words;
CREATE POLICY "write_lotoleitura_words_authorized" ON lotoleitura_words
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('usuario_autorizado', 'usuario_admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('usuario_autorizado', 'usuario_admin')));

-- supabase/migrations/20260929_lotoleitura.sql
-- adicionar antes do "INSERT INTO games (...) VALUES ('Lotoleitura - Vogais', ...":

ALTER TABLE games DROP CONSTRAINT IF EXISTS games_game_type_check;
ALTER TABLE games ADD CONSTRAINT games_game_type_check
  CHECK (game_type IN (
    'texto_lacunado',
    'texto_fatiado',
    'fatiado_lacunado',
    'lotoleitura_vogais',
    'lotoleitura_consoantes',
    'lotoleitura_completa'
  ));

INSERT INTO games (title, slug, description, subject_id, game_type) VALUES
  ('Lotoleitura - Vogais', 'lotoleitura-vogais', 'Complete a palavra digitando as vogais que faltam!',
    (SELECT id FROM subjects WHERE slug = 'portugues'), 'lotoleitura_vogais'),
  ('Lotoleitura - Consoantes', 'lotoleitura-consoantes', 'Complete a palavra digitando as consoantes que faltam!',
    (SELECT id FROM subjects WHERE slug = 'portugues'), 'lotoleitura_consoantes'),
  ('Lotoleitura - Completa', 'lotoleitura-completa', 'Digite a palavra inteira, letra por letra!',
    (SELECT id FROM subjects WHERE slug = 'portugues'), 'lotoleitura_completa')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('lotoleitura-images', 'lotoleitura-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "select_lotoleitura_images" ON storage.objects;
CREATE POLICY "select_lotoleitura_images" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'lotoleitura-images');

DROP POLICY IF EXISTS "write_lotoleitura_images_authorized" ON storage.objects;
CREATE POLICY "write_lotoleitura_images_authorized" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'lotoleitura-images' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('usuario_autorizado', 'usuario_admin')))
  WITH CHECK (bucket_id = 'lotoleitura-images' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('usuario_autorizado', 'usuario_admin')));
