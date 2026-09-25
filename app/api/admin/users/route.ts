import { NextResponse } from 'next/server';
import { getRequestProfile } from '@/lib/supabase/auth-helpers';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const caller = await getRequestProfile(request);
  if (!caller || caller.role !== 'usuario_admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from('profiles')
    .select('id, email, full_name, role, created_at')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data });
}
