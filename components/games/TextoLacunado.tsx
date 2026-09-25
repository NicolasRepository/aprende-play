'use client';

import { useMemo, useState } from 'react';
import type { GameProps } from '@/lib/types';
import { GameShell, GameButton, GameTextBox, GameFooterBar } from '@/components/GameUI';
import { useSongLines } from '@/hooks/use-games';
import { shuffle, normalize } from '@/lib/game-utils';
import { cn } from '@/lib/utils';

export function TextoLacunado({ game, onScore, onComplete, onExit }: GameProps) {
  return (
    <GameShell title={game.title} description={game.description ?? undefined} onScore={onScore} onComplete={onComplete} onExit={onExit}>
      {({ isHighContrast, isFixedFooter, isLousa, addScore, complete }) => (
        <LacunadoContent
          songId={game.song_id}
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

export function LacunadoContent({
  songId,
  isHighContrast,
  isFixedFooter,
  isLousa,
  addScore,
  complete,
}: {
  songId: string | null;
  isHighContrast: boolean;
  isFixedFooter: boolean;
  isLousa: boolean;
  addScore: (p: number) => void;
  complete: (s: number) => void;
}) {
  const { lines, loading } = useSongLines(songId);
  const gapLines = useMemo(() => lines.filter((l) => l.gap_word), [lines]);
  const [step, setStep] = useState(0);
  const [filled, setFilled] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);

  const current = gapLines[step];
  const options = useMemo(() => (current ? shuffle(current.gap_options) : []), [current?.id]);

  if (loading) return <p className="p-6 text-center">Carregando música...</p>;
  if (!gapLines.length) return <p className="p-6 text-center">Nenhuma lacuna cadastrada para esta música.</p>;

  const handlePick = (option: string) => {
    if (!current) return;
    if (normalize(option) === normalize(current.gap_word!)) {
      addScore(10);
      setScore((s) => s + 10);
      setFilled((f) => ({ ...f, [current.id]: true }));
      setTimeout(() => {
        if (step + 1 < gapLines.length) setStep((s) => s + 1);
        else complete(score + 10);
      }, 500);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6 p-4 md:p-8', isFixedFooter && 'pb-28')}>
      <div className="flex flex-col gap-2">
        {lines.map((line) => {
          const isGap = !!line.gap_word;
          const isDone = filled[line.id];
          const isCurrent = current?.id === line.id;
          return (
            <GameTextBox
              key={line.id}
              highContrast={isHighContrast}
              variant={isCurrent ? 'highlight' : 'default'}
              size={isLousa ? 'lg' : 'md'}
            >
              {isGap
                ? line.text.replace(
                    new RegExp(line.gap_word!, 'i'),
                    isDone ? line.gap_word! : '_____'
                  )
                : line.text}
            </GameTextBox>
          );
        })}
      </div>

      <GameFooterBar isFixedFooter={isFixedFooter} isHighContrast={isHighContrast}>
        <div className={cn('grid gap-2', isLousa ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-3 md:grid-cols-4')}>
          {options.map((opt) => (
            <GameButton
              key={opt}
              highContrast={isHighContrast}
              size={isLousa ? 'xl' : 'md'}
              variant="secondary"
              onClick={() => handlePick(opt)}
            >
              {opt}
            </GameButton>
          ))}
        </div>
      </GameFooterBar>
    </div>
  );
}
