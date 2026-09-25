'use client';

import type { GameDefinition, GameProps } from '@/lib/types';
import { ForcaDasLetras } from '@/components/games/ForcaDasLetras';
import { SomaDivertida } from '@/components/games/SomaDivertida';
import { MemoriaDosAnimais } from '@/components/games/MemoriaDosAnimais';

// ============================================================
// REGISTRY DE JOGOS — Factory Pattern
// ============================================================
// Para adicionar um novo jogo:
// 1. Crie o componente em components/games/
// 2. Importe aqui e adicione ao array GAME_REGISTRY
// O novo jogo herda automaticamente a interface base (GameProps)
// e a lógica de acessibilidade do GameShell.
// ============================================================

export const GAME_REGISTRY: GameDefinition[] = [
  {
    slug: 'forca-das-letras',
    title: 'Forca das Letras',
    description: 'Adivinhe a palavra letra por letra!',
    subjectSlug: 'portugues',
    schoolYear: '1_ano',
    difficulty: 'facil',
    icon: 'Type',
    color: '#FF6600',
    component: ForcaDasLetras,
  },
  {
    slug: 'soma-divertida',
    title: 'Soma Divertida',
    description: 'Pratique a adição de forma divertida!',
    subjectSlug: 'matematica',
    schoolYear: '1_ano',
    difficulty: 'facil',
    icon: 'Plus',
    color: '#3B82F6',
    component: SomaDivertida,
  },
  {
    slug: 'memoria-dos-animais',
    title: 'Memória dos Animais',
    description: 'Combine os pares de animais e seus nomes!',
    subjectSlug: 'ciencias',
    schoolYear: '1_ano',
    difficulty: 'facil',
    icon: 'Brain',
    color: '#10B981',
    component: MemoriaDosAnimais,
  },
];

export function getGameBySlug(slug: string): GameDefinition | undefined {
  return GAME_REGISTRY.find((g) => g.slug === slug);
}

export function getGamesBySubject(subjectSlug: string): GameDefinition[] {
  return GAME_REGISTRY.filter((g) => g.subjectSlug === subjectSlug);
}

export function getGamesByYear(year: string): GameDefinition[] {
  return GAME_REGISTRY.filter((g) => g.schoolYear === year || year === 'todos');
}

export function getFilteredGames(
  subjectSlug?: string,
  year?: string
): GameDefinition[] {
  return GAME_REGISTRY.filter((g) => {
    const subjectMatch = !subjectSlug || subjectSlug === 'todos' || g.subjectSlug === subjectSlug;
    const yearMatch = !year || year === 'todos' || g.schoolYear === year;
    return subjectMatch && yearMatch;
  });
}

// Factory function — returns the React component for a given slug
export function createGameComponent(slug: string): React.ComponentType<GameProps> | null {
  const game = getGameBySlug(slug);
  return game?.component ?? null;
}
