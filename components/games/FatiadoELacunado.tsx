'use client';

import { useState } from 'react';
import type { GameProps, Song } from '@/lib/types';
import { GameShell } from '@/components/GameUI';
import { SongSelectScreen } from './SongSelectScreen';
import { FatiadoContent } from './TextoFatiado';
import { LacunadoContent } from './TextoLacunado';

export function FatiadoELacunado({ game, onScore, onComplete, onExit }: GameProps) {
  const [song, setSong] = useState<Song | null>(null);
  const [phase, setPhase] = useState<'ordering' | 'filling'>('ordering');

  if (!song) {
    return <SongSelectScreen onSelect={setSong} onExit={onExit} />;
  }

  return (
    <GameShell
      title={game.title}
      description={game.description ?? undefined}
      onScore={onScore}
      onComplete={onComplete}
      onExit={onExit}
      extraCompleteAction={{ label: 'Escolher Outra Música', onClick: () => { setSong(null); setPhase('ordering'); } }}
    >
      {({ isHighContrast, isFixedFooter, isLousa, addScore, complete }) =>
        phase === 'ordering' ? (
          <FatiadoContent
            songId={song.id}
            isHighContrast={isHighContrast}
            isFixedFooter={isFixedFooter}
            isLousa={isLousa}
            addScore={addScore}
            complete={complete}
            onOrdered={() => setPhase('filling')}
          />
        ) : (
          <LacunadoContent
            songId={song.id}
            isHighContrast={isHighContrast}
            isFixedFooter={isFixedFooter}
            isLousa={isLousa}
            addScore={addScore}
            complete={complete}
          />
        )
      }
    </GameShell>
  );
}
