import { supabase } from './client';
import type { LiteracyLevel, Subject, GameRecord, SongLine } from '@/lib/types';

export async function fetchSubjects(): Promise<Subject[]> {
  const { data, error } = await supabase.from('subjects').select('*').order('name');
  if (error) throw error;
  return data ?? [];
}

export async function fetchLiteracyLevels(): Promise<LiteracyLevel[]> {
  const { data, error } = await supabase
    .from('literacy_levels')
    .select('*')
    .order('order_index');
  if (error) throw error;
  return data ?? [];
}

export async function fetchGames(): Promise<GameRecord[]> {
  const { data, error } = await supabase
    .from('games')
    .select('*, subject:subjects(*), literacy_level:literacy_levels(*)')
    .order('created_at');
  if (error) throw error;
  return (data ?? []) as GameRecord[];
}

export async function fetchGameBySlug(slug: string): Promise<GameRecord | null> {
  const { data, error } = await supabase
    .from('games')
    .select('*, subject:subjects(*), literacy_level:literacy_levels(*)')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as GameRecord | null;
}

export async function fetchSongLines(songId: string): Promise<SongLine[]> {
  const { data, error } = await supabase
    .from('song_lines')
    .select('*')
    .eq('song_id', songId)
    .order('line_order');
  if (error) throw error;
  return data ?? [];
}
