'use client';

import { useMemo, useRef, useState } from 'react';
import type { GameProps, LotoleituraWord } from '@/lib/types';
import { GameShell, GameTextBox, GameFooterBar, VirtualKeyboard } from '@/components/GameUI';
import { LotoleituraSelectScreen } from './LotoleituraSelectScreen';
import { maskWord, stripAccents } from '@/lib/game-utils';
import { cn } from '@/lib/utils';

type LotoMode = 'lotoleitura_vogais' | 'lotoleitura_consoantes' | 'lotoleitura_completa';

export function Lotoleitura({ game, onScore, onComplete, onExit }: GameProps) {
  const mode = game.game_type as LotoMode;
  const [word, setWord] = useState<LotoleituraWord | null>(null);

  if (!word) return <LotoleituraSelectScreen onSelect={setWord} onExit={onExit} />;

  return (
    <GameShell
      title={game.title}
      description={game.description ?? undefined}
      onScore={onScore}
      onComplete={onComplete}
      onExit={onExit}
      extraCompleteAction={{ label: 'Escolher Outra Imagem', onClick: () => setWord(null) }}
    >
      {({ isHighContrast, isFixedFooter, isLousa, addScore, complete }) => (
        <LotoleituraContent
          word={word}
          mode={mode}
          isHighContrast={isHighContrast}
          isFixedFooter={isFixedFooter}
          isLousa={isLousa}
          addScore={addScore}
          complete={complete}
        />
      )}
    </GameShell>
  );
}

function LotoleituraContent({
  word,
  mode,
  isHighContrast,
  isFixedFooter,
  isLousa,
  addScore,
  complete,
}: {
  word: LotoleituraWord;
  mode: LotoMode;
  isHighContrast: boolean;
  isFixedFooter: boolean;
  isLousa: boolean;
  addScore: (p: number) => void;
  complete: (s: number) => void;
}) {
  const [typed, setTyped] = useState<string[]>([]);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const scoreRef = useRef(0);

  const mask = useMemo(() => maskWord(word.word, mode), [word, mode]);
  const blankIndexes = useMemo(
    () => mask.map((m, i) => (m.hidden ? i : -1)).filter((i) => i !== -1),
    [mask]
  );

  const handlePress = (letter: string) => {
    if (typed.length >= blankIndexes.length) return;
    const targetIndex = blankIndexes[typed.length];
    const expected = word.word[targetIndex];

    // compara ignorando acento (teclado não tem vogais acentuadas),
    // mas guarda o caractere original da palavra para exibir corretamente
    if (stripAccents(letter).toLowerCase() !== stripAccents(expected).toLowerCase()) {
      setShakeIndex(targetIndex);
      setTimeout(() => setShakeIndex(null), 400);
      return;
    }

    scoreRef.current += 2;
    addScore(2);
    const nextTyped = [...typed, expected];
    setTyped(nextTyped);

    if (nextTyped.length === blankIndexes.length) {
      setTimeout(() => complete(scoreRef.current), 600);
    }
  };

  const handleBackspace = () => setTyped((prev) => prev.slice(0, -1));

  return (
    <div className={cn('flex flex-col items-center gap-8 p-4 md:p-8', isFixedFooter && 'pb-40 md:pb-48')}>
      <img
        src={word.image_url}
        alt={word.word}
        className={cn(
          'rounded-2xl object-contain shadow-lg bg-white',
          isLousa ? 'h-64 md:h-80' : 'h-48 md:h-64'
        )}
      />

      <div className="flex flex-wrap justify-center gap-2">
        {mask.map((m, i) => {
          if (!m.hidden) {
            return (
              <GameTextBox
                key={i}
                highContrast={isHighContrast}
                size={isLousa ? 'lg' : 'md'}
                className="w-12 md:w-14 text-center"
