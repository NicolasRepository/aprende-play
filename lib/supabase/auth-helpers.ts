import { createClient } from '@supabase/supabase-js';
import { createSupabaseAdminClient } from './admin';
import type { UserRole } from '@/lib/types';

export async function getRequestProfile(
  request: Request
): Promise<{ id: string; role: UserRole } | null> {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') ?? '';
  if (!token) return null;

  const anon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
  const { data: { user } } = await anon.auth.getUser(token);
  if (!user) return null;

  const admin = createSupabaseAdminClient();
  const { data: profile } = await admin
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .maybeSingle();

  return profile as { id: string; role: UserRole } | null;
}
