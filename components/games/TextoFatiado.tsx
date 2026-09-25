'use client';

import { useMemo, useState } from 'react';
import type { GameProps } from '@/lib/types';
import { GameShell, GameButton, GameTextBox, GameFooterBar } from '@/components/GameUI';
import { useSongLines } from '@/hooks/use-games';
import { shuffle } from '@/lib/game-utils';
import { cn } from '@/lib/utils';

export function TextoFatiado({ game, onScore, onComplete, onExit }: GameProps) {
  return (
    <GameShell title={game.title} description={game.description ?? undefined} onScore={onScore} onComplete={onComplete} onExit={onExit}>
      {({ isHighContrast, isFixedFooter, isLousa, addScore, complete }) => (
        <FatiadoContent
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

export function FatiadoContent({
  songId,
  isHighContrast,
  isFixedFooter,
  isLousa,
  addScore,
  complete,
  onOrdered,
}: {
  songId: string | null;
  isHighContrast: boolean;
  isFixedFooter: boolean;
  isLousa: boolean;
  addScore: (p: number) => void;
  complete: (s: number) => void;
  onOrdered?: () => void;
}) {
  const { lines, loading } = useSongLines(songId);
  const shuffled = useMemo(() => shuffle(lines), [lines.length]);
  const [pickedIds, setPickedIds] = useState<string[]>([]);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  if (loading) return <p className="p-6 text-center">Carregando música...</p>;
  if (!lines.length) return <p className="p-6 text-center">Nenhuma frase cadastrada para esta música.</p>;

  const nextExpected = lines[pickedIds.length];
  const remaining = shuffled.filter((l) => !pickedIds.includes(l.id));
  const done = pickedIds.length === lines.length;

  const handlePick = (id: string) => {
    if (id === nextExpected.id) {
      addScore(10);
      const newScore = score + 10;
      setScore(newScore);
      const nextIds = [...pickedIds, id];
      setPickedIds(nextIds);
      if (nextIds.length === lines.length) {
        if (onOrdered) onOrdered();
        else complete(newScore);
      }
    } else {
      setWrongFlash(id);
      setTimeout(() => setWrongFlash(null), 400);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6 p-4 md:p-8', isFixedFooter && 'pb-28')}>
      <div className="flex flex-col gap-2">
        {pickedIds.map((id, idx) => (
          <GameTextBox key={id} highContrast={isHighContrast} variant="success" size={isLousa ? 'lg' : 'md'}>
            {idx + 1}. {lines.find((l) => l.id === id)?.text}
          </GameTextBox>
        ))}
        {!done && (
          <GameTextBox highContrast={isHighContrast} variant="highlight" size={isLousa ? 'lg' : 'md'}>
            {pickedIds.length + 1}. ?
          </GameTextBox>
        )}
      </div>

      {!done && (
        <GameFooterBar isFixedFooter={isFixedFooter} isHighContrast={isHighContrast}>
          <div className={cn('grid gap-2', isLousa ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-3')}>
            {remaining.map((line) => (
              <GameButton
                key={line.id}
                highContrast={isHighContrast}
                size={isLousa ? 'xl' : 'md'}
                variant={wrongFlash === line.id ? 'danger' : 'secondary'}
                onClick={() => handlePick(line.id)}
              >
                {line.text}
              </GameButton>
            ))}
          </div>
        </GameFooterBar>
      )}
    </div>
  );
}
