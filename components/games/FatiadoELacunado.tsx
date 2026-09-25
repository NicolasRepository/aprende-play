'use client';

import { useState } from 'react';
import type { GameProps } from '@/lib/types';
import { GameShell } from '@/components/GameUI';
import { FatiadoContent } from './TextoFatiado';
import { LacunadoContent } from './TextoLacunado';

export function FatiadoELacunado({ game, onScore, onComplete }: GameProps) {
  return (
    <GameShell title={game.title} description={game.description ?? undefined} onScore={onScore} onComplete={onComplete}>
      {({ isHighContrast, isFixedFooter, isLousa, addScore, complete }) => (
        <Phases
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

function Phases(props: {
  songId: string | null;
  isHighContrast: boolean;
  isFixedFooter: boolean;
  isLousa: boolean;
  addScore: (p: number) => void;
  complete: (s: number) => void;
}) {
  const [phase, setPhase] = useState<'ordering' | 'filling'>('ordering');

  if (phase === 'ordering') {
    return <FatiadoContent {...props} onOrdered={() => setPhase('filling')} />;
  }
  return <LacunadoInner {...props} />;
}
