import { supabase } from './client';
import type { LiteracyLevel, Subject, GameRecord, Song, SongLine, RawSongLineWithGaps, LotoleituraWord } from '@/lib/types';

export async function fetchSongLinesWithGaps(songId: string): Promise<RawSongLineWithGaps[]> {
  const { data, error } = await supabase
    .from('song_lines')
    .select('*, gaps:song_line_gaps(*)')
    .eq('song_id', songId)
    .order('line_order');
  if (error) throw error;
  return (data ?? []) as RawSongLineWithGaps[];
}

export async function fetchSubjects(): Promise<Subject[]> {
  const { data, error } = await supabase.from('subjects').select('*').order('name');
  if (error) throw error;
  return data ?? [];
}

export async function fetchLiteracyLevels(): Promise<LiteracyLevel[]> {
  const { data, error } = await supabase.from('literacy_levels').select('*').order('order_index');
  if (error) throw error;
  return data ?? [];
}

// games agora só tem 3 linhas (módulos) — sem join de song/literacy_level
export async function fetchGames(): Promise<GameRecord[]> {
  const { data, error } = await supabase
    .from('games')
    .select('*, subject:subjects(*)')
    .order('created_at');
  if (error) throw error;
  return (data ?? []) as GameRecord[];
}

export async function fetchGameBySlug(slug: string): Promise<GameRecord | null> {
  const { data, error } = await supabase
    .from('games')
    .select('*, subject:subjects(*)')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as GameRecord | null;
}

// NOVO: catálogo de músicas p/ tela de seleção dentro do jogo
export async function fetchSongs(): Promise<Song[]> {
  const { data, error } = await supabase
    .from('songs')
    .select('*, literacy_level:literacy_levels(*)')
    .order('title');
  if (error) throw error;
  return (data ?? []) as Song[];
}
export async function fetchLotoleituraWords(): Promise<LotoleituraWord[]> {
  const { data, error } = await supabase.from('lotoleitura_words').select('*').order('created_at');
  if (error) throw error;
  return (data ?? []) as LotoleituraWord[];
}
