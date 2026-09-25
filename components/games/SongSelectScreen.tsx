'use client';

import { useMemo, useState } from 'react';
import { useSongs } from '@/hooks/use-games';
import type { Song } from '@/lib/types';
import { GameButton, GameTextBox } from '@/components/GameUI';
import { Search } from 'lucide-react';

interface Props {
  onSelect: (song: Song) => void;
  onExit?: () => void;
}

export function SongSelectScreen({ onSelect, onExit }: Props) {
  const { songs, loading } = useSongs();
  const [query, setQuery] = useState('');

  const filteredSongs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return songs;
    return songs.filter(
      (song) =>
        song.title.toLowerCase().includes(q) ||
        (song.artist ?? '').toLowerCase().includes(q)
    );
  }, [songs, query]);

  const handleRandom = () => {
    const pool = filteredSongs.length ? filteredSongs : songs;
    if (!pool.length) return;
    onSelect(pool[Math.floor(Math.random() * pool.length)]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 bg-gradient-to-b from-brand-50 to-white relative">
      {onExit && (
        <button
          onClick={onExit}
          className="absolute top-4 left-4 p-2 rounded-lg text-brand-600 hover:bg-brand-50"
          aria-label="Voltar"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">Escolha como começar</h1>

      <GameButton variant="primary" size="xl" onClick={handleRandom} disabled={loading || !songs.length}>
        🎲 Sortear Música
      </GameButton>

      <div className="w-full max-w-md">
        <p className="text-sm font-semibold text-gray-600 mb-3 text-center">ou escolha uma música</p>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título ou artista..."
            className="w-full rounded-xl border-2 border-brand-200 pl-9 pr-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Carregando músicas...</p>
        ) : filteredSongs.length === 0 ? (
          <p className="text-center text-gray-400">
            {songs.length === 0 ? 'Nenhuma música cadastrada ainda.' : 'Nenhuma música encontrada.'}
          </p>
        ) : (
          <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
            {filteredSongs.map((song) => (
              <button key={song.id} onClick={() => onSelect(song)} className="text-left">
                <GameTextBox variant="default" className="hover:border-brand-400 cursor-pointer transition-colors">
                  <span className="font-semibold">{song.title}</span>
                  {song.artist && <span className="text-gray-400 text-sm"> — {song.artist}</span>}
                  {song.literacy_level && (
                    <span className="ml-2 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-700">
                      {song.literacy_level.name}
                    </span>
                  )}
                </GameTextBox>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
