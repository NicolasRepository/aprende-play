'use client';

import { useState } from 'react';
import type { GameProps, Song, CorrectionMode } from '@/lib/types';
import { GameShell } from '@/components/GameUI';
import { SongSelectScreen } from './SongSelectScreen';
import { FatiadoContent } from './TextoFatiado';
import { LacunadoContent } from './TextoLacunado';
import { useSongLinesWithGaps } from '@/hooks/use-games';

export function FatiadoELacunado({ game, onScore, onComplete, onExit }: GameProps) {
  const [song, setSong] = useState<Song | null>(null);
  const [phase, setPhase] = useState<'ordering' | 'filling'>('ordering');

  if (!song) return <SongSelectScreen onSelect={setSong} onExit={onExit} />;

  return (
    <GameShell
      title={game.title}
      description={game.description ?? undefined}
      onScore={onScore}
      onComplete={onComplete}
      onExit={onExit}
      extraCompleteAction={{
        label: 'Escolher Outra Música',
        onClick: () => { setSong(null); setPhase('ordering'); },
      }}
    >
      {({ isHighContrast, isFixedFooter, isLousa, addScore, complete, settings }) => (
        <Loader
          songId={song.id}
          phase={phase}
          setPhase={setPhase}
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

function Loader({
  songId,
  phase,
  setPhase,
  ...rest
}: {
  songId: string;
  phase: 'ordering' | 'filling';
  setPhase: (p: 'ordering' | 'filling') => void;
  isHighContrast: boolean;
  isFixedFooter: boolean;
  isLousa: boolean;
  correctionMode: CorrectionMode;
  addScore: (p: number) => void;
  complete: (s: number) => void;
}) {
  const { playLines, loading } = useSongLinesWithGaps(songId);

  if (loading) return <p className="p-6 text-center">Carregando música...</p>;
  if (!playLines.length) return <p className="p-6 text-center">Nenhuma linha cadastrada para esta música.</p>;

  return phase === 'ordering' ? (
    <FatiadoContent lines={playLines} blankGapWords onOrdered={() => setPhase('filling')} {...rest} />
  ) : (
    <LacunadoContent lines={playLines} {...rest} />
  );
}
