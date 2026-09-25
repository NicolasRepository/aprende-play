'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { AccessibilitySettings } from '@/lib/types';
import { AccessibilityPanel } from './AccessibilityPanel';

interface GameLayoutProps {
  title: string;
  description?: string;
  settings: AccessibilitySettings;
  onSettingsChange: (settings: AccessibilitySettings) => void;
  score: number;
  children: ReactNode;
  onExit?: () => void;
  showSettings?: boolean;
}

export function GameLayout({
  title,
  description,
  settings,
  onSettingsChange,
  score,
  children,
  onExit,
  showSettings = true,
}: GameLayoutProps) {
  const isHighContrast = settings.visualMode === 'alto_contraste';
  const isFixedFooter = settings.layoutMode === 'rodape_fixo';

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col transition-colors duration-300',
        isHighContrast ? 'bg-white text-black' : 'bg-gradient-to-b from-brand-50 to-white text-black-900'
      )}
    >
      {/* Header */}
      <header
        className={cn(
          'flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b-2 shrink-0',
          isHighContrast ? 'bg-white border-black' : 'bg-white border-brand-100 shadow-sm'
        )}
      >
        <div className="flex items-center gap-3">
          {onExit && (
            <button
              onClick={onExit}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isHighContrast ? 'bg-black text-white' : 'bg-brand-100 text-brand-700'  // mantém contraste no badge, ok
              )}
              aria-label="Sair do jogo"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
          <div>
            <h1 className={cn('text-lg md:text-xl font-bold', isHighContrast ? 'text-black' : 'text-brand-600')}>
              {title}
            </h1>
            {description && (
              <p className={cn('text-xs md:text-sm hidden sm:block', isHighContrast ? 'text-black-300' : 'text-black-500')}>
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-sm md:text-base',
              isHighContrast ? 'bg-black text-white' : 'bg-brand-100 text-brand-700' 
            )}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {score}
          </div>
          {showSettings && (
            <AccessibilityPanel
              settings={settings}
              onSettingsChange={onSettingsChange}
            />
          )}
        </div>
      </header>

      {/* Game content */}
      <main className={cn('flex-1 flex flex-col', isFixedFooter ? 'pb-24 md:pb-28' : 'p-4 md:p-8')}>
        <div className={cn('flex-1', !isFixedFooter && 'flex flex-col')}>
          {children}
        </div>
      </main>
    </div>
  );
}
