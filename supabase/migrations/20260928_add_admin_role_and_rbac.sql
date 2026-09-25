-- supabase/migrations/20260928_add_admin_role_and_rbac.sql

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('usuario_comum', 'usuario_autorizado', 'usuario_admin'));

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR role IN ('usuario_autorizado', 'usuario_admin'));

DROP POLICY IF EXISTS "insert_games_authorized" ON games;
CREATE POLICY "insert_games_authorized" ON games
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('usuario_autorizado', 'usuario_admin'))
  );

DROP POLICY IF EXISTS "update_games_authorized" ON games;
CREATE POLICY "update_games_authorized" ON games
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('usuario_autorizado', 'usuario_admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('usuario_autorizado', 'usuario_admin')));

DROP POLICY IF EXISTS "delete_games_authorized" ON games;
CREATE POLICY "delete_games_authorized" ON games
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('usuario_autorizado', 'usuario_admin'))
  );

DROP POLICY IF EXISTS "write_songs_authorized" ON songs;
CREATE POLICY "write_songs_authorized" ON songs
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('usuario_autorizado', 'usuario_admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('usuario_autorizado', 'usuario_admin')));

DROP POLICY IF EXISTS "write_song_lines_authorized" ON song_lines;
CREATE POLICY "write_song_lines_authorized" ON song_lines
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('usuario_autorizado', 'usuario_admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('usuario_autorizado', 'usuario_admin')));

DROP POLICY IF EXISTS "write_song_line_gaps_authorized" ON song_line_gaps;
CREATE POLICY "write_song_line_gaps_authorized" ON song_line_gaps
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('usuario_autorizado', 'usuario_admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('usuario_autorizado', 'usuario_admin')));
