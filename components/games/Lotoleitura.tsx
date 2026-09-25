'use client';

import { useMemo, useRef, useState } from 'react';
import type { GameProps, LotoleituraWord } from '@/lib/types';
import { GameShell, GameTextBox, GameFooterBar, VirtualKeyboard } from '@/components/GameUI';
import { useLotoleituraWords } from '@/hooks/use-games';
import { maskWord, stripAccents } from '@/lib/game-utils';
import { cn } from '@/lib/utils';

type LotoMode = 'lotoleitura_vogais' | 'lotoleitura_consoantes' | 'lotoleitura_completa';

export function Lotoleitura({ game, onScore, onComplete, onExit }: GameProps) {
  const mode = game.game_type as LotoMode;

  return (
    <GameShell
      title={game.title}
      description={game.description ?? undefined}
      onScore={onScore}
      onComplete={onComplete}
      onExit={onExit}
    >
      {({ isHighContrast, isFixedFooter, isLousa, addScore, complete }) => (
        <LotoleituraLoader
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

function LotoleituraLoader(props: Omit<Parameters<typeof LotoleituraContent>[0], 'words'>) {
  const { words, loading } = useLotoleituraWords();
  if (loading) return <p className="p-6 text-center">Carregando palavras...</p>;
  if (!words.length) return <p className="p-6 text-center">Nenhuma palavra cadastrada ainda.</p>;
  return <LotoleituraContent {...props} words={words} />;
}

function LotoleituraContent({
  words,
  mode,
  isHighContrast,
  isFixedFooter,
  isLousa,
  addScore,
  complete,
}: {
  words: LotoleituraWord[];
  mode: LotoMode;
  isHighContrast: boolean;
  isFixedFooter: boolean;
  isLousa: boolean;
  addScore: (p: number) => void;
  complete: (s: number) => void;
}) {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState<string[]>([]);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const scoreRef = useRef(0);

  const current = words[step];
  const mask = useMemo(() => maskWord(current.word, mode), [current, mode]);
  const blankIndexes = useMemo(
    () => mask.map((m, i) => (m.hidden ? i : -1)).filter((i) => i !== -1),
    [mask]
  );

  const goNext = () => {
    setTyped([]);
    setTimeout(() => {
      if (step + 1 < words.length) setStep((s) => s + 1);
      else complete(scoreRef.current);
    }, 600);
  };

  const handlePress = (letter: string) => {
    if (typed.length >= blankIndexes.length) return;
    const targetIndex = blankIndexes[typed.length];
    const expected = current.word[targetIndex];

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
    if (nextTyped.length === blankIndexes.length) goNext();
  };

  const handleBackspace = () => setTyped((prev) => prev.slice(0, -1));

  return (
    <div className={cn('flex flex-col items-center gap-8 p-4 md:p-8', isFixedFooter && 'pb-40 md:pb-48')}>
      <img
        src={current.image_url}
        alt={current.word}
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
              >
                {m.char.toUpperCase()}
              </GameTextBox>
            );
          }
          const blankPos = blankIndexes.indexOf(i);
          const letter = typed[blankPos];
          return (
            <GameTextBox
              key={i}
              highContrast={isHighContrast}
              size={isLousa ? 'lg' : 'md'}
              variant={letter ? 'success' : 'highlight'}
              className={cn('w-12 md:w-14 text-center', shakeIndex === i && 'animate-bounce')}
            >
              {letter ? letter.toUpperCase() : ''}
            </GameTextBox>
          );
        })}
      </div>

      <GameFooterBar isFixedFooter={isFixedFooter} isHighContrast={isHighContrast}>
        <VirtualKeyboard
          onPress={handlePress}
          onBackspace={handleBackspace}
          isHighContrast={isHighContrast}
          isLousa={isLousa}
        />
      </GameFooterBar>
    </div>
  );
}
