'use client';

import { GameButton } from './GameButton';
import { cn } from '@/lib/utils';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ç'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

interface Props {
  onPress: (letter: string) => void;
  onBackspace: () => void;
  isHighContrast?: boolean;
  isLousa?: boolean;
}

export function VirtualKeyboard({ onPress, onBackspace, isHighContrast, isLousa }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-1.5 md:gap-2">
          {row.map((letter) => (
            <GameButton
              key={letter}
              variant="secondary"
              size={isLousa ? 'lg' : 'sm'}
              highContrast={isHighContrast}
              className="w-8 md:w-11 px-0"
              onClick={() => onPress(letter)}
            >
              {letter}
            </GameButton>
          ))}
        </div>
      ))}
      <GameButton
        variant="danger"
        size={isLousa ? 'lg' : 'sm'}
        highContrast={isHighContrast}
        onClick={onBackspace}
      >
        ⌫ Apagar
      </GameButton>
    </div>
  );
}
