import { NextResponse } from 'next/server';
import { getRequestProfile } from '@/lib/supabase/auth-helpers';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const caller = await getRequestProfile(request);
  if (!caller || caller.role !== 'usuario_admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  const { password } = await request.json();
  if (!password || password.length < 6) {
    return NextResponse.json({ error: 'Senha inválida' }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.auth.admin.updateUserById(params.id, { password });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
