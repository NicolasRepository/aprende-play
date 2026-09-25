'use client';

import { useState, useCallback, type ReactNode } from 'react';
import type { AccessibilitySettings } from '@/lib/types';
import { DEFAULT_ACCESSIBILITY } from '@/lib/types';
import { GameLayout } from './GameLayout';
import { GameCompleteScreen } from './GameCompleteScreen';

interface GameShellProps {
  title: string;
  description?: string;
  onExit?: () => void;
  onScore?: (score: number) => void;
  onComplete?: (finalScore: number) => void;
  extraCompleteAction?: { label: string; onClick: () => void }; // NOVO
  children: (props: {
    settings: AccessibilitySettings;
    score: number;
    setScore: (score: number) => void;
    addScore: (points: number) => void;
    complete: (finalScore: number) => void;
    isHighContrast: boolean;
    isFixedFooter: boolean;
    isLousa: boolean;
  }) => ReactNode;
}

export function GameShell({
  title,
  description,
  onExit,
  onScore,
  onComplete,
  extraCompleteAction,
  children,
}: GameShellProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const handleScore = useCallback((newScore: number) => {
    setScore(newScore);
    onScore?.(newScore);
  }, [onScore]);

  const handleAddScore = useCallback((points: number) => {
    setScore((prev) => {
      const next = prev + points;
      onScore?.(next);
      return next;
    });
  }, [onScore]);

  const handleComplete = useCallback((finishedScore: number) => {
    setFinalScore(finishedScore);
    setFinished(true);
    onComplete?.(finishedScore);
  }, [onComplete]);

  const handlePlayAgain = useCallback(() => {
    setFinished(false);
    setScore(0);
    setResetKey((k) => k + 1);
  }, []);

  const isHighContrast = settings.visualMode === 'alto_contraste';
  const isFixedFooter = settings.layoutMode === 'rodape_fixo';
  const isLousa = settings.deviceMode === 'lousa';

  return (
    <GameLayout title={title} description={description} settings={settings} onSettingsChange={setSettings} score={score} onExit={onExit}>
      {finished ? (
        <GameCompleteScreen
          score={finalScore}
          isHighContrast={isHighContrast}
          onPlayAgain={handlePlayAgain}
          onExit={onExit}
          extraAction={extraCompleteAction}
        />
      ) : (
        <div key={resetKey}>
          {children({ settings, score, setScore: handleScore, addScore: handleAddScore, complete: handleComplete, isHighContrast, isFixedFooter, isLousa })}
        </div>
      )}
    </GameLayout>
  );
}
