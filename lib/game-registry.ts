'use client';

import type { GameProps, GameType } from '@/lib/types';
import { TextoLacunado } from '@/components/games/TextoLacunado';
import { TextoFatiado } from '@/components/games/TextoFatiado';
import { FatiadoELacunado } from '@/components/games/FatiadoELacunado';

export const GAME_TYPE_COMPONENTS: Record<GameType, React.ComponentType<GameProps>> = {
  texto_lacunado: TextoLacunado,
  texto_fatiado: TextoFatiado,
  fatiado_lacunado: FatiadoELacunado,
};

export function getGameComponent(gameType: GameType): React.ComponentType<GameProps> | null {
  return GAME_TYPE_COMPONENTS[gameType] ?? null;
}
