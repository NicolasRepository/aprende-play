export type UserRole = 'usuario_comum' | 'usuario_autorizado';

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

export interface LiteracyLevel {
  id: string;
  slug: string;
  name: string;
  order_index: number;
}

export type Difficulty = 'facil' | 'medio' | 'dificil';

export interface Song {
  id: string;
  title: string;
  artist: string | null;
  literacy_level_id: string | null;
  literacy_level?: LiteracyLevel | null;
  difficulty: Difficulty;
}

export interface SongLine {
  id: string;
  song_id: string;
  line_order: number;
  text: string;
  gap_word: string | null;
  gap_options: string[];
}

export type GameType = 'texto_lacunado' | 'texto_fatiado' | 'fatiado_lacunado';

export interface GameRecord {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  subject_id: string | null;
  subject?: Subject | null;
  game_type: GameType;
  thumbnail: string | null;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  game_id: string;
  score: number;
  completed: boolean;
  played_at: string;
  game?: GameRecord | null;
}

// --- Acessibilidade ---
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

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
};

export interface GameProps {
  game: GameRecord;
  onScore: (score: number) => void;
  onComplete: (finalScore: number) => void;
  onExit?: () => void;
}

export function isAuthorized(role: UserRole | undefined | null): boolean {
  return role === 'usuario_autorizado';
}
