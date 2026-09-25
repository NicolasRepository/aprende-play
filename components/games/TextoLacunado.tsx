'use client';

import { useMemo, useState } from 'react';
import type { GameProps, Song, PlayLine, CorrectionMode } from '@/lib/types';
import { GameShell, GameButton, GameTextBox, GameFooterBar } from '@/components/GameUI';
import { SongSelectScreen } from './SongSelectScreen';
import { useSongLinesWithGaps } from '@/hooks/use-games';
import { normalize, replaceWord, blankOutWord } from '@/lib/game-utils';
import { cn } from '@/lib/utils';

export function TextoLacunado({ game, onScore, onComplete, onExit }: GameProps) {
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
        <LacunadoLoader
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

function LacunadoLoader(props: Omit<Parameters<typeof LacunadoContent>[0], 'lines'> & { songId: string }) {
  const { playLines, loading } = useSongLinesWithGaps(props.songId);
  if (loading) return <p className="p-6 text-center">Carregando música...</p>;
  if (!playLines.some((l) => l.gap)) return <p className="p-6 text-center">Nenhuma lacuna cadastrada para esta música.</p>;
  return <LacunadoContent {...props} lines={playLines} />;
}

export function LacunadoContent({
  lines,
  isHighContrast,
  isFixedFooter,
  isLousa,
  correctionMode,
  addScore,
  complete,
}: {
  lines: PlayLine[];
  isHighContrast: boolean;
  isFixedFooter: boolean;
  isLousa: boolean;
  correctionMode: CorrectionMode;
  addScore: (p: number) => void;
  complete: (s: number) => void;
}) {
  const gapLines = useMemo(() => lines.filter((l) => l.gap), [lines]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);

  const current = gapLines[step];

  const handlePick = (option: string) => {
    if (!current?.gap) return;
    const isCorrect = normalize(option) === normalize(current.gap.word);

    // modo imediato: ignora resposta errada, deixa tentar de novo
    if (correctionMode === 'imediata' && !isCorrect) return;

    const points = isCorrect ? 10 : 0;
    addScore(points);
    const newScore = score + points;
    setScore(newScore);
    setAnswers((a) => ({ ...a, [current.id]: option }));

    setTimeout(() => {
      if (step + 1 < gapLines.length) setStep((s) => s + 1);
      else complete(newScore);
    }, 500);
  };

  return (
    <div className={cn('flex flex-col gap-6 p-4 md:p-8', isFixedFooter && 'pb-32 md:pb-36')}>
      <div className="flex flex-col gap-2">
        {lines.map((line) => {
          const answer = answers[line.id];
          const isCurrent = current?.id === line.id;
          const isCorrectAnswer = !!answer && line.gap && normalize(answer) === normalize(line.gap.word);

          let display = line.text;
          if (line.gap) {
            display = answer ? replaceWord(line.text, line.gap.word, answer) : blankOutWord(line.text, line.gap.word);
          }

          return (
            <GameTextBox
              key={line.id}
              highContrast={isHighContrast}
              variant={answer ? (isCorrectAnswer ? 'success' : 'error') : isCurrent ? 'highlight' : 'default'}
              size={isLousa ? 'lg' : 'md'}
            >
              {display}
              {answer && !isCorrectAnswer && <span className="ml-2 text-sm opacity-70">(correto: {line.gap!.word})</span>}
            </GameTextBox>
          );
        })}
      </div>

      {current?.gap && (
        <GameFooterBar isFixedFooter={isFixedFooter} isHighContrast={isHighContrast}>
          <div className={cn('grid gap-2', isLousa ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-3 md:grid-cols-4')}>
            {current.gap.options.map((opt) => (
              <GameButton key={opt} highContrast={isHighContrast} size={isLousa ? 'xl' : 'md'} variant="secondary" onClick={() => handlePick(opt)}>
                {opt}
              </GameButton>
            ))}
          </div>
        </GameFooterBar>
      )}
    </div>
  );
}
