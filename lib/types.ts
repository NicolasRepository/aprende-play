export interface Song {
  id: string;
  title: string;
  artist: string | null;
  literacy_level_id: string | null;
  literacy_level?: LiteracyLevel | null;
  difficulty: Difficulty;
}

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
  // song_id, literacy_level_id e difficulty saíram daqui — agora ficam em Song
}

export interface GameProps {
  game: GameRecord;
  onScore: (score: number) => void;
  onComplete: (finalScore: number) => void;
  onExit?: () => void;
}
