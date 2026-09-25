'use client';

import { useEffect, useState } from 'react';
import {
  fetchGames,
  fetchGameBySlug,
  fetchLiteracyLevels,
  fetchSubjects,
  fetchSongLines,
} from '@/lib/supabase/queries';
import type { GameRecord, LiteracyLevel, Subject, SongLine } from '@/lib/types';

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchSubjects().then(setSubjects).finally(() => setLoading(false));
  }, []);
  return { subjects, loading };
}

export function useLiteracyLevels() {
  const [levels, setLevels] = useState<LiteracyLevel[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchLiteracyLevels().then(setLevels).finally(() => setLoading(false));
  }, []);
  return { levels, loading };
}

export function useGames(filters?: { subjectSlug?: string; literacyLevelSlug?: string }) {
  const [games, setGames] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchGames().then((all) => {
      if (!active) return;
      const filtered = all.filter((g) => {
        const subjectOk =
          !filters?.subjectSlug || filters.subjectSlug === 'todos' || g.subject?.slug === filters.subjectSlug;
        const levelOk =
          !filters?.literacyLevelSlug ||
          filters.literacyLevelSlug === 'todos' ||
          g.literacy_level?.slug === filters.literacyLevelSlug;
        return subjectOk && levelOk;
      });
      setGames(filtered);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [filters?.subjectSlug, filters?.literacyLevelSlug]);

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
