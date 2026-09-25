'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { GameProps } from '@/lib/types';
import { GameShell, GameButton, GameTextBox } from '@/components/GameUI';
import { cn } from '@/lib/utils';

interface Card {
  id: number;
  label: string;
  emoji: string;
  matched: boolean;
}

const PAIRS = [
  { label: 'GATO', emoji: '🐱' },
  { label: 'CACHORRO', emoji: '🐶' },
  { label: 'ELEFANTE', emoji: '🐘' },
  { label: 'GIRAFA', emoji: '🦒' },
  { label: 'PEIXE', emoji: '🐟' },
  { label: 'PASSARO', emoji: '🐦' },
];

function buildDeck(): Card[] {
  const cards: Card[] = [];
  PAIRS.forEach((pair, idx) => {
    cards.push({ id: idx * 2, label: pair.label, emoji: pair.emoji, matched: false });
    cards.push({ id: idx * 2 + 1, label: pair.label, emoji: pair.emoji, matched: false });
  });
  return cards.sort(() => Math.random() - 0.5);
}

export function MemoriaDosAnimais({ onScore, onComplete }: GameProps) {
  return (
    <GameShell
      title="Memória dos Animais"
      description="Combine os pares de animais e seus nomes!"
      onScore={onScore}
      onComplete={onComplete}
    >
      {({ isHighContrast, isFixedFooter, addScore, complete, score }) => (
        <MemoriaGameContent
          isHighContrast={isHighContrast}
          isFixedFooter={isFixedFooter}
          addScore={addScore}
          complete={complete}
          score={score}
        />
      )}
    </GameShell>
  );
}

interface ContentProps {
  isHighContrast: boolean;
  isFixedFooter: boolean;
  addScore: (points: number) => void;
  complete: (finalScore: number) => void;
  score: number;
}

function MemoriaGameContent({ isHighContrast, isFixedFooter, addScore, complete, score }: ContentProps) {
  const [deck, setDeck] = useState<Card[]>(buildDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);

  const matchedCount = useMemo(() => deck.filter((c) => c.matched).length, [deck]);
  const totalPairs = PAIRS.length;

  const handleFlip = useCallback(
    (cardId: number) => {
      if (flipped.length === 2) return;
      if (flipped.includes(cardId)) return;
      const card = deck.find((c) => c.id === cardId);
      if (!card || card.matched) return;

      const newFlipped = [...flipped, cardId];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        setMoves((m) => m + 1);
        const [first, second] = newFlipped.map((id) => deck.find((c) => c.id === id)!);
        if (first.label === second.label) {
          setTimeout(() => {
            setDeck((prev) =>
              prev.map((c) =>
                c.id === first.id || c.id === second.id ? { ...c, matched: true } : c
              )
            );
            addScore(15);
            setFlipped([]);
          }, 600);
        } else {
          setTimeout(() => setFlipped([]), 1000);
        }
      }
    },
    [flipped, deck, addScore]
  );

  useEffect(() => {
    if (matchedCount === totalPairs * 2 && !finished) {
      setFinished(true);
      complete(score);
    }
  }, [matchedCount, totalPairs, finished, complete, score]);

  const restart = () => {
    setDeck(buildDeck());
    setFlipped([]);
    setMoves(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-4">
        <div className="text-6xl animate-bounce-soft">🎉</div>
        <div
          className={cn(
            'text-4xl md:text-5xl font-bold animate-pop-in',
            isHighContrast ? 'text-white' : 'text-brand-600'
          )}
        >
          Parabéns!
        </div>
        <GameTextBox variant="highlight" highContrast={isHighContrast} size="lg">
          <div className="text-center">
            <div className="text-lg">Pontuação Final</div>
            <div className="text-4xl font-bold">{score} pontos</div>
            <div className="text-sm mt-2">{moves} jogadas</div>
          </div>
        </GameTextBox>
        <GameButton variant="primary" highContrast={isHighContrast} size="lg" onClick={restart}>
          Jogar Novamente
        </GameButton>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col', isFixedFooter ? 'p-4 md:p-8' : '')}>
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-2">
        <div className={cn('text-sm font-semibold', isHighContrast ? 'text-gray-300' : 'text-gray-500')}>
          Pares encontrados: {matchedCount / 2} / {totalPairs} · Jogadas: {moves}
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 max-w-2xl">
          {deck.map((card) => {
            const isFlipped = flipped.includes(card.id) || card.matched;
            return (
              <button
                key={card.id}
                onClick={() => handleFlip(card.id)}
                disabled={isFlipped}
                className={cn(
                  'aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300 active:scale-95',
                  'disabled:cursor-not-allowed',
                  isFlipped
                    ? card.matched
                      ? isHighContrast ? 'bg-white text-black border-2 border-white' : 'bg-green-100 border-2 border-green-400'
                      : isHighContrast ? 'bg-white text-black border-2 border-white' : 'bg-brand-100 border-2 border-brand-400'
                    : isHighContrast
                      ? 'bg-black text-white border-2 border-white hover:bg-gray-900'
                      : 'bg-brand-500 text-white border-2 border-brand-500 hover:bg-brand-600 shadow-md shadow-brand-500/30'
                )}
              >
                {isFlipped ? (
                  <>
                    <span className="text-3xl md:text-5xl">{card.emoji}</span>
                    <span className={cn('text-xs md:text-sm font-bold mt-1', isHighContrast ? 'text-black' : 'text-gray-700')}>
                      {card.label}
                    </span>
                  </>
                ) : (
                  <span className={cn('text-3xl md:text-4xl', isHighContrast ? 'text-white' : 'text-white')}>
                    ?
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
