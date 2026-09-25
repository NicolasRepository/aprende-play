import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { gameSlug, score, completed } = body as {
      gameSlug: string;
      score: number;
      completed: boolean;
    };

    if (!gameSlug || typeof score !== 'number') {
      return NextResponse.json(
        { error: 'gameSlug e score são obrigatórios' },
        { status: 400 }
      );
    }

    const { data: game } = await supabase
      .from('games')
      .select('id')
      .eq('slug', gameSlug)
      .maybeSingle();

    if (!game) {
      return NextResponse.json({ error: 'Jogo não encontrado' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('user_progress')
      .insert({
        user_id: user.id,
        game_id: game.id,
        score,
        completed: completed ?? true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
