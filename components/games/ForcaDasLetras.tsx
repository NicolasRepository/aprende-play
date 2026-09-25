'use client';

import { useState, useCallback, useMemo } from 'react';
import type { GameProps } from '@/lib/types';
import { GameShell, GameButton, GameTextBox } from '@/components/GameUI';
import { cn } from '@/lib/utils';

const WORDS = [
  { word: 'GATO', hint: 'Animal que faz miau' },
  { word: 'CASA', hint: 'Onde a gente mora' },
  { word: 'BOLA', hint: 'Brinca de rolar' },
  { word: 'SOL', hint: 'Brilha no céu de dia' },
  { word: 'FOCA', hint: 'Animal marinho' },
  { word: 'PATO', hint: 'Animal que nada' },
  { word: 'UVA', hint: 'Fruta pequena e roxa' },
  { word: 'LEAO', hint: 'Rei da selva' },
];

export function ForcaDasLetras({ onScore, onComplete }: GameProps) {
  return (
    <GameShell
      title="Forca das Letras"
      description="Adivinhe a palavra letra por letra!"
      onScore={onScore}
      onComplete={onComplete}
    >
      {({ isHighContrast, isFixedFooter, addScore, complete }) => (
        <ForcaGameContent
          isHighContrast={isHighContrast}
          isFixedFooter={isFixedFooter}
          addScore={addScore}
          complete={complete}
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
}

function ForcaGameContent({ isHighContrast, isFixedFooter, addScore, complete }: ContentProps) {
  const [round, setRound] = useState(0);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState(0);
  const [finished, setFinished] = useState(false);
  const [won, setWon] = useState(false);

  const current = useMemo(() => WORDS[round % WORDS.length], [round]);
  const maxWrong = 6;

  const displayWord = useMemo(
    () =>
      current.word
        .split('')
        .map((letter) => (guessed.has(letter) ? letter : '_'))
        .join(' '),
    [current.word, guessed]
  );

  const isComplete = useMemo(
    () => current.word.split('').every((letter) => guessed.has(letter)),
    [current.word, guessed]
  );

  const handleGuess = useCallback(
    (letter: string) => {
      if (guessed.has(letter) || finished) return;
      const newGuessed = new Set(guessed);
      newGuessed.add(letter);
      setGuessed(newGuessed);

      if (current.word.includes(letter)) {
        addScore(10);
      } else {
        setWrong((w) => w + 1);
      }
    },
    [guessed, current.word, finished, addScore]
  );

  // Check win/lose
  useMemo(() => {
    if (isComplete && !finished) {
      setFinished(true);
      setWon(true);
    } else if (wrong >= maxWrong && !finished) {
      setFinished(true);
      setWon(false);
    }
  }, [isComplete, wrong, finished]);

  const nextRound = () => {
    setRound((r) => r + 1);
    setGuessed(new Set());
    setWrong(0);
    setFinished(false);
    setWon(false);
  };

  const finish = () => {
    complete(round > 0 ? round * 10 : 0);
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const usedLetters = new Set(current.word.split(''));

  const letterButtons = (
    <div className="grid grid-cols-7 sm:grid-cols-9 gap-2">
      {alphabet.map((letter) => {
        const isUsed = guessed.has(letter);
        const isCorrect = isUsed && usedLetters.has(letter);
        const isWrong = isUsed && !usedLetters.has(letter);
        return (
          <button
            key={letter}
            onClick={() => handleGuess(letter)}
            disabled={isUsed || finished}
            className={cn(
              'aspect-square rounded-lg font-bold text-lg md:text-xl transition-all active:scale-90',
              'disabled:cursor-not-allowed',
              isCorrect && (isHighContrast ? 'bg-white text-black border-2 border-white' : 'bg-green-500 text-white'),
              isWrong && (isHighContrast ? 'bg-white text-black opacity-50' : 'bg-red-300 text-white opacity-60'),
              !isUsed && !finished && (
                isHighContrast
                  ? 'bg-black text-white border-2 border-white hover:bg-white hover:text-black'
                  : 'bg-white text-brand-600 border-2 border-brand-200 hover:bg-brand-100 hover:border-brand-400'
              )
            )}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className={cn('flex flex-col', isFixedFooter ? 'p-4 md:p-8' : '')}>
      {/* Game area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-4">
        {/* Hint */}
        <GameTextBox variant="highlight" highContrast={isHighContrast} size="md">
          <span className="font-semibold">Dica: </span>
          {current.hint}
        </GameTextBox>

        {/* Word display */}
        <div
          className={cn(
            'text-4xl md:text-6xl font-bold tracking-widest py-4',
            isHighContrast ? 'text-white' : 'text-brand-600'
          )}
        >
          {displayWord}
        </div>

        {/* Wrong counter (hearts) */}
        <div className="flex gap-1">
          {Array.from({ length: maxWrong }).map((_, i) => (
            <span
              key={i}
              className={cn(
                'text-2xl',
                i < wrong ? (isHighContrast ? 'text-white opacity-30' : 'text-red-300') : isHighContrast ? 'text-white' : 'text-red-500'
              )}
            >
              {i < wrong ? '♡' : '♥'}
            </span>
          ))}
        </div>

        {/* Result overlay */}
        {finished && (
          <div
            className={cn(
              'flex flex-col items-center gap-4 animate-pop-in',
              isHighContrast ? 'text-white' : ''
            )}
          >
            <div
              className={cn(
                'text-3xl md:text-4xl font-bold',
                won ? (isHighContrast ? 'text-white' : 'text-green-500') : isHighContrast ? 'text-white' : 'text-red-500'
              )}
            >
              {won ? 'Você acertou!' : 'Quase! A palavra era ' + current.word}
            </div>
            <div className="flex gap-3">
              <GameButton variant="primary" highContrast={isHighContrast} size="lg" onClick={nextRound}>
                Próxima Palavra
              </GameButton>
              <GameButton variant="ghost" highContrast={isHighContrast} size="lg" onClick={finish}>
                Finalizar
              </GameButton>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard */}
      {!finished && (
        <div
          className={cn(
            isFixedFooter
              ? 'fixed bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-brand-200 shadow-lg z-30'
              : '',
            isHighContrast && isFixedFooter ? 'bg-black border-white' : ''
          )}
        >
          {letterButtons}
        </div>
      )}
    </div>
  );
}
