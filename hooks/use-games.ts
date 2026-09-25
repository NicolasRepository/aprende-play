'use client';

import { useEffect, useState } from 'react';
import { fetchGames, fetchGameBySlug, fetchSongs, fetchSongLinesWithGaps, fetchLotoleituraWords } from '@/lib/supabase/queries';
import type { GameRecord, Song, PlayLine, LotoleituraWord } from '@/lib/types';
import { buildGapOptions, shuffle } from '@/lib/game-utils';

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

// substitui o antigo useSongLines: já sorteia a lacuna de cada linha e monta as opções
export function useSongLinesWithGaps(songId: string | null | undefined) {
  const [playLines, setPlayLines] = useState<PlayLine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!songId) {
      setPlayLines([]);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    fetchSongLinesWithGaps(songId).then((rawLines) => {
      if (!active) return;
      const allOptions = rawLines.flatMap((l) => l.gaps.flatMap((g) => [g.gap_word, ...g.gap_options]));
      const enriched: PlayLine[] = rawLines.map((line) => {
        if (!line.gaps.length) {
          return { id: line.id, line_order: line.line_order, text: line.text, gap: null };
        }
        const chosen = line.gaps[Math.floor(Math.random() * line.gaps.length)];
        return {
          id: line.id,
          line_order: line.line_order,
          text: line.text,
          gap: { word: chosen.gap_word, options: buildGapOptions(chosen.gap_word, chosen.gap_options, allOptions) },
        };
      });
      setPlayLines(enriched);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [songId]);

  return { playLines, loading };
}

export function useLotoleituraWords() {
  const [words, setWords] = useState<LotoleituraWord[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchLotoleituraWords()
      .then((w) => setWords(shuffle(w)))
      .finally(() => setLoading(false));
  }, []);
  return { words, loading };
}
