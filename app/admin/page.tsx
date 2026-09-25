'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { isAdmin, type UserRole } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

const ROLES: UserRole[] = ['usuario_comum', 'usuario_autorizado', 'usuario_admin'];

export default function AdminPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin(profile?.role))) {
      router.push('/');
    }
  }, [user, profile, loading, router]);

  const authHeader = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return { Authorization: `Bearer ${session?.access_token ?? ''}` };
  }, []);

  const loadUsers = useCallback(async () => {
    const headers = await authHeader();
    const res = await fetch('/api/admin/users', { headers });
    const data = await res.json();
    if (res.ok) setUsers(data.users);
    else toast.error(data.error ?? 'Erro ao carregar usuários');
  }, [authHeader]);

  useEffect(() => {
    if (user && isAdmin(profile?.role)) loadUsers();
  }, [user, profile, loadUsers]);

  if (loading || !user || !isAdmin(profile?.role)) return null;

  const handleRoleChange = async (id: string, role: UserRole) => {
    setBusyId(id);
    const headers = await authHeader();
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    setBusyId(null);
    if (res.ok) {
      toast.success('Role atualizada');
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } else {
      toast.error(data.error ?? 'Erro ao atualizar role');
    }
  };

  const handlePasswordReset = async (id: string) => {
    const password = passwords[id];
    if (!password || password.length < 6) {
      toast.error('Senha deve ter ao menos 6 caracteres');
      return;
    }
    setBusyId(id);
    const headers = await authHeader();
    const res = await fetch(`/api/admin/users/${id}/password`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    setBusyId(null);
    if (res.ok) {
      toast.success('Senha atualizada');
      setPasswords((prev) => ({ ...prev, [id]: '' }));
    } else {
      toast.error(data.error ?? 'Erro ao atualizar senha');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Administração de Usuários</h1>
        <Card className="p-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Nova Senha</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.full_name ?? '-'}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Select
                      value={u.role}
                      onValueChange={(v) => handleRoleChange(u.id, v as UserRole)}
                      disabled={busyId === u.id}
                    >
                      <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="password"
                      placeholder="••••••"
                      value={passwords[u.id] ?? ''}
                      onChange={(e) =>
                        setPasswords((prev) => ({ ...prev, [u.id]: e.target.value }))
                      }
                      className="w-40"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      disabled={busyId === u.id}
                      onClick={() => handlePasswordReset(u.id)}
                    >
                      Redefinir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
