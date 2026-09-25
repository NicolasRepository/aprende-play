'use client';

import type { GameProps, GameType } from '@/lib/types';
import { TextoLacunado } from '@/components/games/TextoLacunado';
import { TextoFatiado } from '@/components/games/TextoFatiado';
import { FatiadoELacunado } from '@/components/games/FatiadoELacunado';
import { Lotoleitura } from '@/components/games/Lotoleitura';

export const GAME_TYPE_COMPONENTS: Record<GameType, React.ComponentType<GameProps>> = {
  texto_lacunado: TextoLacunado,
  texto_fatiado: TextoFatiado,
  fatiado_lacunado: FatiadoELacunado,
  lotoleitura_vogais: Lotoleitura,
  lotoleitura_consoantes: Lotoleitura,
  lotoleitura_completa: Lotoleitura,
};

export function getGameComponent(gameType: GameType): React.ComponentType<GameProps> | null {
  return GAME_TYPE_COMPONENTS[gameType] ?? null;
}
