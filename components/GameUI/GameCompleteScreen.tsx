'use client';

import { GameButton } from './GameButton';
import { cn } from '@/lib/utils';

interface Props {
  score: number;
  isHighContrast: boolean;
  onPlayAgain: () => void;
  onExit?: () => void;
  extraAction?: { label: string; onClick: () => void };
}

export function GameCompleteScreen({ score, isHighContrast, onPlayAgain, onExit, extraAction }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6 text-center animate-pop-in">
      <div className="text-6xl">🎉</div>
      <h2 className={cn('text-3xl md:text-4xl font-bold', isHighContrast ? 'text-black' : 'text-brand-600')}>
        Você concluiu!
      </h2>
      <p className={cn('text-lg', isHighContrast ? 'text-black' : 'text-gray-600')}>
        Pontuação final: <span className="font-bold">{score}</span> pontos
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <GameButton variant="primary" highContrast={isHighContrast} size="lg" onClick={onPlayAgain}>
          Jogar Novamente
        </GameButton>
        {extraAction && (
          <GameButton variant="secondary" highContrast={isHighContrast} size="lg" onClick={extraAction.onClick}>
            {extraAction.label}
          </GameButton>
        )}
        {onExit && (
          <GameButton variant="ghost" highContrast={isHighContrast} size="lg" onClick={onExit}>
            Voltar ao Menu
          </GameButton>
        )}
      </div>
    </div>
  );
}
