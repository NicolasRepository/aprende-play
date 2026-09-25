'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Navbar } from '@/components/site/Navbar';
import { Mail, Lock, User, ArrowRight, AlertCircle, Check } from 'lucide-react';

export default function CadastroPage() {
  const router = useRouter();
  const { user, signUp, loading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.push('/dashboard');
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setSubmitting(true);
    const { error } = await signUp(email, password, fullName);
    if (error) {
      setError(
        error.includes('already')
          ? 'Este email já está cadastrado'
          : error
      );
      setSubmitting(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-50 to-white">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-2 border-brand-100 shadow-xl shadow-brand-500/10">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
              <User className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl font-bold">Criar conta grátis</CardTitle>
            <CardDescription>Comece a aprender brincando hoje mesmo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 border-2 border-red-200 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 border-brand-200 focus:border-brand-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-brand-200 focus:border-brand-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-brand-200 focus:border-brand-400"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/30"
              >
                {submitting ? 'Criando conta...' : 'Criar Conta Grátis'}
                {!submitting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Check className="h-3.5 w-3.5 text-brand-500" /> Acesso a todos os jogos
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Check className="h-3.5 w-3.5 text-brand-500" /> Acompanhamento de progresso
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Check className="h-3.5 w-3.5 text-brand-500" /> Grátis
              </div>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Já tem uma conta?{' '}
              <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
                Fazer login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
