'use client';

import { useMemo, useState } from 'react';
import type { GameProps, Song, PlayLine, CorrectionMode } from '@/lib/types';
import { GameShell, GameButton, GameTextBox, GameFooterBar } from '@/components/GameUI';
import { SongSelectScreen } from './SongSelectScreen';
import { useSongLinesWithGaps } from '@/hooks/use-games';
import { shuffle, blankOutWord } from '@/lib/game-utils';
import { cn } from '@/lib/utils';

export function TextoFatiado({ game, onScore, onComplete, onExit }: GameProps) {
  const [song, setSong] = useState<Song | null>(null);
  if (!song) return <SongSelectScreen onSelect={setSong} onExit={onExit} />;

  return (
    <GameShell
      title={game.title}
      description={game.description ?? undefined}
      onScore={onScore}
      onComplete={onComplete}
      onExit={onExit}
      extraCompleteAction={{ label: 'Escolher Outra Música', onClick: () => setSong(null) }}
    >
      {({ isHighContrast, isFixedFooter, isLousa, addScore, complete, settings }) => (
        <FatiadoLoader
          songId={song.id}
          isHighContrast={isHighContrast}
          isFixedFooter={isFixedFooter}
          isLousa={isLousa}
          correctionMode={settings.correctionMode}
          addScore={addScore}
          complete={complete}
        />
      )}
    </GameShell>
  );
}

function FatiadoLoader(props: Omit<Parameters<typeof FatiadoContent>[0], 'lines'> & { songId: string }) {
  const { playLines, loading } = useSongLinesWithGaps(props.songId);
  if (loading) return <p className="p-6 text-center">Carregando música...</p>;
  if (!playLines.length) return <p className="p-6 text-center">Nenhuma frase cadastrada para esta música.</p>;
  return <FatiadoContent {...props} lines={playLines} />;
}

export function FatiadoContent({
  lines,
  isHighContrast,
  isFixedFooter,
  isLousa,
  correctionMode,
  addScore,
  complete,
  onOrdered,
  blankGapWords = false,
}: {
  lines: PlayLine[];
  isHighContrast: boolean;
  isFixedFooter: boolean;
  isLousa: boolean;
  correctionMode: CorrectionMode;
  addScore: (p: number) => void;
  complete: (s: number) => void;
  onOrdered?: () => void;
  blankGapWords?: boolean;
}) {
  const shuffled = useMemo(() => shuffle(lines), [lines.length]);
  const [pickedIds, setPickedIds] = useState<string[]>([]);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  const displayText = (line: PlayLine) => (blankGapWords && line.gap ? blankOutWord(line.text, line.gap.word) : line.text).toUpperCase(); // ALTERADO

  const finish = (correctCount: number) => {
    const finalScore = correctCount * 10;
    addScore(finalScore);
    if (onOrdered) onOrdered();
    else complete(finalScore);
  };

  const handlePick = (id: string) => {
    if (correctionMode === 'imediata') {
      const nextExpectedId = lines[pickedIds.length].id;
      if (id !== nextExpectedId) {
        setWrongFlash(id);
        setTimeout(() => setWrongFlash(null), 400);
        return;
      }
      addScore(10);
      const nextIds = [...pickedIds, id];
      setPickedIds(nextIds);
      if (nextIds.length === lines.length) {
        if (onOrdered) onOrdered();
        else complete(nextIds.length * 10);
      }
    } else {
      const nextIds = [...pickedIds, id];
      setPickedIds(nextIds);
      if (nextIds.length === lines.length) {
        const correctCount = nextIds.filter((pid, idx) => pid === lines[idx].id).length;
        finish(correctCount);
      }
    }
  };

  const remaining = shuffled.filter((l) => !pickedIds.includes(l.id));
  const done = pickedIds.length === lines.length;

  return (
    <div className={cn('flex flex-col gap-6 p-4 md:p-8', isFixedFooter && 'pb-32 md:pb-36')}>
      <div className="flex flex-col gap-2">
        {pickedIds.map((id, idx) => {
          const line = lines.find((l) => l.id === id)!;
          const isCorrectPosition = correctionMode === 'livre' ? id === lines[idx].id : true;
          return (
            <GameTextBox key={id} highContrast={isHighContrast} variant={isCorrectPosition ? 'success' : 'error'} size={isLousa ? 'lg' : 'md'}>
              {idx + 1}. {displayText(line)}
            </GameTextBox>
          );
        })}
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
              <GameButton key={line.id} highContrast={isHighContrast} size={isLousa ? 'xl' : 'md'} variant={wrongFlash === line.id ? 'danger' : 'secondary'} onClick={() => handlePick(line.id)}>
                {displayText(line)}
              </GameButton>
            ))}
          </div>
        </GameFooterBar>
      )}
    </div>
  );
}
