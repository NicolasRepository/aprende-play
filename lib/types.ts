// ============================================================
// Aprende Play — Tipos TypeScript do Sistema
// ============================================================

// --- Sistema de Roles (Permissões de Usuário) ---
export type UserRole = 'usuario_comum' | 'usuario_autorizado';

// usuario_comum: apenas joga e acessa o básico
// usuario_autorizado: pode adicionar conteúdos customizados (fotos, letras de músicas, etc.)

// --- Tipos de Banco de Dados ---
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  created_at: string;
}

export interface Game {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  subject_id: string | null;
  school_year: string;
  difficulty: string;
  thumbnail: string | null;
  created_at: string;
  subject?: Subject | null;
}

export interface UserProgress {
  id: string;
  user_id: string;
  game_id: string;
  score: number;
  completed: boolean;
  played_at: string;
  game?: Game | null;
}

// --- Tipos de Disciplina e Ano Escolar ---
export type SchoolYear =
  | '1_ano'
  | '2_ano'
  | '3_ano'
  | '4_ano'
  | '5_ano'
  | 'todos';

export type Difficulty = 'facil' | 'medio' | 'dificil';

// --- Tipos de Acessibilidade ---
export type DeviceMode = 'pc' | 'lousa';
export type VisualMode = 'cores_vivas' | 'alto_contraste';
export type LayoutMode = 'tela_cheia' | 'rodape_fixo';

export interface AccessibilitySettings {
  deviceMode: DeviceMode;
  visualMode: VisualMode;
  layoutMode: LayoutMode;
}

export const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  deviceMode: 'pc',
  visualMode: 'cores_vivas',
  layoutMode: 'tela_cheia',
};

// --- Tipos do Sistema de Jogos ---
export interface GameDefinition {
  slug: string;
  title: string;
  description: string;
  subjectSlug: string;
  schoolYear: SchoolYear;
  difficulty: Difficulty;
  icon: string;
  color: string;
  component: React.ComponentType<GameProps>;
}

export interface GameProps {
  settings: AccessibilitySettings;
  onScore: (score: number) => void;
  onComplete: (finalScore: number) => void;
}

// --- Helpers ---
export const SCHOOL_YEAR_LABELS: Record<string, string> = {
  '1_ano': '1º Ano',
  '2_ano': '2º Ano',
  '3_ano': '3º Ano',
  '4_ano': '4º Ano',
  '5_ano': '5º Ano',
  todos: 'Todos os Anos',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
};

export function isAuthorized(role: UserRole | undefined | null): boolean {
  return role === 'usuario_autorizado';
}
