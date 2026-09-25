'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { AccessibilitySettings, DeviceMode, VisualMode, LayoutMode } from '@/lib/types';

interface AccessibilityPanelProps {
  settings: AccessibilitySettings;
  onSettingsChange: (settings: AccessibilitySettings) => void;
}

const deviceOptions: { value: DeviceMode; label: string; icon: string }[] = [
  { value: 'pc', label: 'PC', icon: '🖥️' },
  { value: 'lousa', label: 'Lousa', icon: '📋' },
];

const visualOptions: { value: VisualMode; label: string }[] = [
  { value: 'cores_vivas', label: 'Cores Vivas' },
  { value: 'alto_contraste', label: 'Alto Contraste' },
];

const layoutOptions: { value: LayoutMode; label: string }[] = [
  { value: 'tela_cheia', label: 'Tela Cheia' },
  { value: 'rodape_fixo', label: 'Rodapé Fixo' },
];

export function AccessibilityPanel({
  settings,
  onSettingsChange,
}: AccessibilityPanelProps) {
  const [open, setOpen] = useState(false);
  const isHighContrast = settings.visualMode === 'alto_contraste';

  const update = (patch: Partial<AccessibilitySettings>) => {
    onSettingsChange({ ...settings, ...patch });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'p-2 rounded-lg transition-colors',
          isHighContrast
            ? 'text-white border-2 border-white hover:bg-white hover:text-black'
            : 'text-brand-600 hover:bg-brand-50 border-2 border-transparent'
        )}
        aria-label="Configurações de acessibilidade"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className={cn(
              'absolute right-0 top-full mt-2 w-72 rounded-xl border-2 shadow-xl z-50 p-4 space-y-4',
              isHighContrast
                ? 'bg-black border-white text-white'
                : 'bg-white border-brand-200 text-gray-900'
            )}
          >
            <h3 className={cn('font-bold text-sm uppercase tracking-wide', isHighContrast ? 'text-white' : 'text-brand-600')}>
              Configurações do Jogo
            </h3>

            {/* Modo Dispositivo */}
            <div>
              <label className={cn('text-xs font-semibold mb-2 block', isHighContrast ? 'text-gray-300' : 'text-gray-500')}>
                Modo Dispositivo
              </label>
              <div className="grid grid-cols-2 gap-2">
                {deviceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update({ deviceMode: opt.value })}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      settings.deviceMode === opt.value
                        ? isHighContrast
                          ? 'bg-white text-black border-2 border-white'
                          : 'bg-brand-500 text-white'
                        : isHighContrast
                          ? 'border-2 border-white text-white hover:bg-white hover:text-black'
                          : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                    )}
                  >
                    <span className="block text-lg mb-0.5">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modo Visual */}
            <div>
              <label className={cn('text-xs font-semibold mb-2 block', isHighContrast ? 'text-gray-300' : 'text-gray-500')}>
                Modo Visual
              </label>
              <div className="grid grid-cols-2 gap-2">
                {visualOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update({ visualMode: opt.value })}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      settings.visualMode === opt.value
                        ? isHighContrast
                          ? 'bg-white text-black border-2 border-white'
                          : 'bg-brand-500 text-white'
                        : isHighContrast
                          ? 'border-2 border-white text-white hover:bg-white hover:text-black'
                          : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Posicionamento */}
            <div>
              <label className={cn('text-xs font-semibold mb-2 block', isHighContrast ? 'text-gray-300' : 'text-gray-500')}>
                Posicionamento
              </label>
              <div className="grid grid-cols-2 gap-2">
                {layoutOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update({ layoutMode: opt.value })}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      settings.layoutMode === opt.value
                        ? isHighContrast
                          ? 'bg-white text-black border-2 border-white'
                          : 'bg-brand-500 text-white'
                        : isHighContrast
                          ? 'border-2 border-white text-white hover:bg-white hover:text-black'
                          : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
