'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { AccessibilitySettings, DeviceMode, VisualMode, LayoutMode, CorrectionMode } from '@/lib/types';

interface AccessibilityPanelProps {
  settings: AccessibilitySettings;
  onSettingsChange: (settings: AccessibilitySettings) => void;
}

const deviceOptions: { value: DeviceMode; label: string }[] = [
  { value: 'pc', label: '🖥️ PC' },
  { value: 'lousa', label: '📋 Lousa' },
];
const visualOptions: { value: VisualMode; label: string }[] = [
  { value: 'cores_vivas', label: 'Cores Vivas' },
  { value: 'alto_contraste', label: 'Alto Contraste' },
];
const layoutOptions: { value: LayoutMode; label: string }[] = [
  { value: 'tela_cheia', label: 'Tela Cheia' },
  { value: 'rodape_fixo', label: 'Rodapé Fixo' },
];
const correctionOptions: { value: CorrectionMode; label: string }[] = [
  { value: 'imediata', label: 'Bloqueio Imediato' },
  { value: 'livre', label: 'Correção Livre' },
];

export function AccessibilityPanel({ settings, onSettingsChange }: AccessibilityPanelProps) {
  const [open, setOpen] = useState(false);
  const isHighContrast = settings.visualMode === 'alto_contraste';
  const update = (patch: Partial<AccessibilitySettings>) => onSettingsChange({ ...settings, ...patch });

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'p-2 rounded-lg transition-colors',
          isHighContrast ? 'text-black border-2 border-black hover:bg-black hover:text-white' : 'text-brand-600 hover:bg-brand-50 border-2 border-transparent'
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
              'absolute right-0 top-full mt-2 w-72 rounded-xl border-2 shadow-xl z-50 p-4 space-y-4 max-h-[80vh] overflow-y-auto',
              isHighContrast ? 'bg-white border-black text-black' : 'bg-white border-brand-200 text-gray-900'
            )}
          >
            <h3 className={cn('font-bold text-sm uppercase tracking-wide', isHighContrast ? 'text-black' : 'text-brand-600')}>
              Configurações do Jogo
            </h3>
            <SettingGroup label="Modo Dispositivo" options={deviceOptions} value={settings.deviceMode} onChange={(v) => update({ deviceMode: v as DeviceMode })} isHighContrast={isHighContrast} />
            <SettingGroup label="Modo Visual" options={visualOptions} value={settings.visualMode} onChange={(v) => update({ visualMode: v as VisualMode })} isHighContrast={isHighContrast} />
            <SettingGroup label="Posicionamento" options={layoutOptions} value={settings.layoutMode} onChange={(v) => update({ layoutMode: v as LayoutMode })} isHighContrast={isHighContrast} />
            <SettingGroup label="Modo de Correção" options={correctionOptions} value={settings.correctionMode} onChange={(v) => update({ correctionMode: v as CorrectionMode })} isHighContrast={isHighContrast} />
          </div>
        </>
      )}
    </div>
  );
}

function SettingGroup({
  label,
  options,
  value,
  onChange,
  isHighContrast,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  isHighContrast: boolean;
}) {
  return (
    <div>
      <label className={cn('text-xs font-semibold mb-2 block', isHighContrast ? 'text-gray-700' : 'text-gray-500')}>{label}</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium transition-all',
              value === opt.value
                ? isHighContrast ? 'bg-black text-white border-2 border-black' : 'bg-brand-500 text-white'
                : isHighContrast ? 'border-2 border-black text-black hover:bg-black hover:text-white' : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
