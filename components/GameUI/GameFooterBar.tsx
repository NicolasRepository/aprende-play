'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  isFixedFooter: boolean;
  isHighContrast: boolean;
  children: ReactNode;
}

export function GameFooterBar({ isFixedFooter, isHighContrast, children }: Props) {
  return (
    <div
      className={cn(
        'w-full border-t-2 shadow-lg',
        isFixedFooter
          ? 'fixed bottom-0 left-0 right-0 z-30 max-h-36 overflow-y-auto py-3 px-3 md:py-4 md:px-6'
          : 'mt-6 py-3 px-3 rounded-xl border-2',
        isHighContrast ? 'bg-white border-black' : 'bg-white border-brand-200'
      )}
    >
      {children}
    </div>
  );
}
