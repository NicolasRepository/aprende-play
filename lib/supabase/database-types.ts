export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'usuario_comum' | 'usuario_autorizado' | 'usuario_admin';
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: 'usuario_comum' | 'usuario_autorizado' | 'usuario_admin';
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          role?: 'usuario_comum' | 'usuario_autorizado' | 'usuario_admin';
          avatar_url?: string | null;
        };
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon?: string | null;
          color?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          icon?: string | null;
          color?: string | null;
        };
      };
      games: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          subject_id: string | null;
          school_year: string;
          difficulty: string;
          thumbnail: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          subject_id?: string | null;
          school_year: string;
          difficulty?: string;
          thumbnail?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          description?: string | null;
          subject_id?: string | null;
          school_year?: string;
          difficulty?: string;
          thumbnail?: string | null;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          game_id: string;
          score: number;
          completed: boolean;
          played_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          game_id: string;
          score?: number;
          completed?: boolean;
          played_at?: string;
        };
        Update: {
          score?: number;
          completed?: boolean;
          played_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
