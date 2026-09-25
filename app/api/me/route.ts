import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    const { data: progress } = await supabase
      .from('user_progress')
      .select('id, game_id, score, completed, played_at, games(id, title, slug)')
      .eq('user_id', user.id)
      .order('played_at', { ascending: false })
      .limit(20);

    return NextResponse.json({ profile, progress: progress ?? [] });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
