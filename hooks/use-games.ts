'use client';

import { useEffect, useState } from 'react';
import {
  fetchGames,
  fetchGameBySlug,
  fetchSongs,
  fetchSongLines,
} from '@/lib/supabase/queries';
import type { GameRecord, Song, SongLine } from '@/lib/types';

export function useGames() {
  const [games, setGames] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchGames().then(setGames).finally(() => setLoading(false));
  }, []);
  return { games, loading };
}

export function useGameBySlug(slug: string) {
  const [game, setGame] = useState<GameRecord | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetchGameBySlug(slug).then((g) => {
      setGame(g);
      setLoading(false);
    });
  }, [slug]);
  return { game, loading };
}

export function useSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchSongs().then(setSongs).finally(() => setLoading(false));
  }, []);
  return { songs, loading };
}

export function useSongLines(songId: string | null | undefined) {
  const [lines, setLines] = useState<SongLine[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!songId) {
      setLines([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchSongLines(songId).then((l) => {
      setLines(l);
      setLoading(false);
    });
  }, [songId]);
  return { lines, loading };
}
