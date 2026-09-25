CREATE TABLE IF NOT EXISTS song_line_gaps (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_line_id  UUID NOT NULL REFERENCES song_lines(id) ON DELETE CASCADE,
  gap_word      TEXT NOT NULL,
  gap_options   TEXT[] NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE song_line_gaps ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_song_line_gaps_line_id ON song_line_gaps(song_line_id);

DROP POLICY IF EXISTS "select_song_line_gaps" ON song_line_gaps;
CREATE POLICY "select_song_line_gaps" ON song_line_gaps FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "write_song_line_gaps_authorized" ON song_line_gaps;
CREATE POLICY "write_song_line_gaps_authorized" ON song_line_gaps FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'usuario_autorizado'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'usuario_autorizado'));

-- migra as lacunas antigas (1 por linha) pra nova tabela
INSERT INTO song_line_gaps (song_line_id, gap_word, gap_options)
SELECT id, gap_word, gap_options FROM song_lines WHERE gap_word IS NOT NULL;

ALTER TABLE song_lines DROP COLUMN IF EXISTS gap_word;
ALTER TABLE song_lines DROP COLUMN IF EXISTS gap_options;

-- exemplo: adicionar uma 2ª variante na linha 1 de "A Barata" (mais diversidade)
INSERT INTO song_line_gaps (song_line_id, gap_word, gap_options)
SELECT id, 'diz', ARRAY['diz', 'canta', 'grita']
FROM song_lines WHERE song_id = '00000000-0000-0000-0000-000000000001' AND line_order = 1;
