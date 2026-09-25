'use client';

import { useMemo, useState } from 'react';
import { useLotoleituraWords } from '@/hooks/use-games';
import type { LotoleituraWord } from '@/lib/types';
import { GameButton } from '@/components/GameUI';
import { Search } from 'lucide-react';

interface Props {
  onSelect: (word: LotoleituraWord) => void;
  onExit?: () => void;
}

export function LotoleituraSelectScreen({ onSelect, onExit }: Props) {
  const { words, loading } = useLotoleituraWords();
  const [query, setQuery] = useState('');

  const filteredWords = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return words;
    return words.filter((w) => w.word.toLowerCase().includes(q));
  }, [words, query]);

  const handleRandom = () => {
    const pool = filteredWords.length ? filteredWords : words;
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

      <GameButton variant="primary" size="xl" onClick={handleRandom} disabled={loading || !words.length}>
        🎲 Sortear Imagem
      </GameButton>

      <div className="w-full max-w-2xl">
        <p className="text-sm font-semibold text-gray-600 mb-3 text-center">ou escolha uma imagem</p>

        <div className="relative mb-3 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por palavra..."
            className="w-full rounded-xl border-2 border-brand-200 pl-9 pr-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Carregando imagens...</p>
        ) : filteredWords.length === 0 ? (
          <p className="text-center text-gray-400">
            {words.length === 0 ? 'Nenhuma imagem cadastrada ainda.' : 'Nenhuma imagem encontrada.'}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-1">
            {filteredWords.map((w) => (
              <button
                key={w.id}
                onClick={() => onSelect(w)}
                className="flex flex-col items-center gap-2 rounded-xl border-2 border-brand-200 bg-white p-2 hover:border-brand-400 transition-colors"
              >
                <img src={w.image_url} alt={w.word} className="h-20 w-full object-contain rounded-lg" />
                <span className="text-sm font-semibold text-gray-700 capitalize">{w.word}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
