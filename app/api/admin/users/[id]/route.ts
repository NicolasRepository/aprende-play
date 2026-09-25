import { NextResponse } from 'next/server';
import { getRequestProfile } from '@/lib/supabase/auth-helpers';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const VALID_ROLES = ['usuario_comum', 'usuario_autorizado', 'usuario_admin'];

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const caller = await getRequestProfile(request);
  if (!caller || caller.role !== 'usuario_admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  const { role } = await request.json();
  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: 'Role inválida' }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from('profiles').update({ role }).eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
