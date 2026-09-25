'use client';

import { useState, useCallback, type ReactNode } from 'react';
import type { AccessibilitySettings, GameProps } from '@/lib/types';
import { DEFAULT_ACCESSIBILITY } from '@/lib/types';
import { GameLayout } from './GameLayout';

interface GameShellProps {
  title: string;
  description?: string;
  onExit?: () => void;
  onScore?: (score: number) => void;
  onComplete?: (finalScore: number) => void;
  children: (props: {
    settings: AccessibilitySettings;
    score: number;
    setScore: (score: number) => void;
    addScore: (points: number) => void;
    complete: (finalScore: number) => void;
    isHighContrast: boolean;
    isFixedFooter: boolean;
  }) => ReactNode;
}

export function GameShell({
  title,
  description,
  onExit,
  onScore,
  onComplete,
  children,
}: GameShellProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY);
  const [score, setScore] = useState(0);

  const handleScore = useCallback(
    (newScore: number) => {
      setScore(newScore);
      onScore?.(newScore);
    },
    [onScore]
  );

  const handleAddScore = useCallback(
    (points: number) => {
      setScore((prev) => {
        const next = prev + points;
        onScore?.(next);
        return next;
      });
    },
    [onScore]
  );

  const handleComplete = useCallback(
    (finalScore: number) => {
      onComplete?.(finalScore);
    },
    [onComplete]
  );

  const isHighContrast = settings.visualMode === 'alto_contraste';
  const isFixedFooter = settings.layoutMode === 'rodape_fixo';

  return (
    <GameLayout
      title={title}
      description={description}
      settings={settings}
      onSettingsChange={setSettings}
      score={score}
      onExit={onExit}
    >
      {children({
        settings,
        score,
        setScore: handleScore,
        addScore: handleAddScore,
        complete: handleComplete,
        isHighContrast,
        isFixedFooter,
      })}
    </GameLayout>
  );
}
