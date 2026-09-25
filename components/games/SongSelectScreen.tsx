'use client';

import { useSongs } from '@/hooks/use-games';
import type { Song } from '@/lib/types';
import { GameButton, GameTextBox } from '@/components/GameUI';

interface Props {
  onSelect: (song: Song) => void;
  onExit?: () => void;
}

export function SongSelectScreen({ onSelect, onExit }: Props) {
  const { songs, loading } = useSongs();

  const handleRandom = () => {
    if (!songs.length) return;
    onSelect(songs[Math.floor(Math.random() * songs.length)]);
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
        {loading ? (
          <p className="text-center text-gray-400">Carregando músicas...</p>
        ) : songs.length === 0 ? (
          <p className="text-center text-gray-400">Nenhuma música cadastrada ainda.</p>
        ) : (
          <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
            {songs.map((song) => (
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
