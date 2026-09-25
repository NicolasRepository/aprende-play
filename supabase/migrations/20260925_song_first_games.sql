-- Classificação de conteúdo migra de "games" para "songs"
ALTER TABLE songs
  ADD COLUMN IF NOT EXISTS literacy_level_id UUID REFERENCES literacy_levels(id),
  ADD COLUMN IF NOT EXISTS difficulty TEXT NOT NULL DEFAULT 'facil'
      CHECK (difficulty IN ('facil', 'medio', 'dificil'));

-- "games" agora representa só o módulo/mecânica (3 linhas), não 1 por música
ALTER TABLE games
  DROP COLUMN IF EXISTS song_id,
  DROP COLUMN IF EXISTS literacy_level_id,
  DROP COLUMN IF EXISTS difficulty;

-- Limpa os registros antigos (1 por música) e recria os 3 módulos genéricos
DELETE FROM games;

INSERT INTO games (title, slug, description, subject_id, game_type) VALUES
  ('Texto Lacunado', 'texto-lacunado', 'Complete as palavras que faltam na música!',
    (SELECT id FROM subjects WHERE slug = 'portugues'), 'texto_lacunado'),
  ('Texto Fatiado', 'texto-fatiado', 'Coloque as frases da música na ordem certa!',
    (SELECT id FROM subjects WHERE slug = 'portugues'), 'texto_fatiado'),
  ('Fatiado e Lacunado', 'fatiado-lacunado', 'Primeiro ordene, depois complete as palavras!',
    (SELECT id FROM subjects WHERE slug = 'portugues'), 'fatiado_lacunado');

-- Atualiza a música de exemplo com nível/dificuldade
UPDATE songs
SET literacy_level_id = (SELECT id FROM literacy_levels WHERE slug = 'silabico_alfabetico'),
    difficulty = 'facil'
WHERE id = '00000000-0000-0000-0000-000000000001';
