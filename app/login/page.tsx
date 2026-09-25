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
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, signIn, loading } = useAuth();
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
    setSubmitting(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error === 'Invalid login credentials'
        ? 'Email ou senha incorretos'
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
              <Lock className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl font-bold">Bem-vindo de volta!</CardTitle>
            <CardDescription>Entre na sua conta para continuar jogando</CardDescription>
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
                    placeholder="••••••••"
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
                {submitting ? 'Entrando...' : 'Entrar'}
                {!submitting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Não tem uma conta?{' '}
              <Link href="/cadastro" className="font-semibold text-brand-600 hover:text-brand-700">
                Cadastre-se grátis
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
