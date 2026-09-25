'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Gamepad2, Calendar, Sparkles } from 'lucide-react';

interface ProgressEntry {
  id: string;
  game_id: string;
  score: number;
  completed: boolean;
  played_at: string;
  games: { id: string; title: string; slug: string } | null;
}

export default function PerfilPage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const [progress, setProgress] = useState<ProgressEntry[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const fetchProgress = async () => {
      const res = await fetch('/api/me');
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress ?? []);
      }
    };
    fetchProgress();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-brand-500 font-semibold text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) return null;

  const totalScore = progress.reduce((sum, p) => sum + p.score, 0);
  const gamesPlayed = progress.length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-50/50 to-white">
      <Navbar />

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 py-8 md:px-6 md:py-12">
        {/* Profile header */}
        <Card className="p-6 mb-8 border-2 border-brand-100">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 text-white text-2xl font-bold shadow-lg shadow-brand-500/30">
              {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.full_name ?? 'Usuário'}
              </h1>
              <p className="text-gray-500">{profile?.email}</p>
              {profile?.role === 'usuario_autorizado' && (
                <span className="inline-flex items-center gap-1 mt-1 rounded-full bg-brand-100 px-3 py-0.5 text-xs font-medium text-brand-700">
                  <Sparkles className="h-3 w-3" />
                  Usuário Autorizado
                </span>
              )}
            </div>
            <Button
              variant="outline"
              className="border-brand-200 text-brand-600 hover:bg-brand-50"
              onClick={() => signOut()}
            >
              Sair
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="p-5 border-2 border-brand-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalScore}</p>
                <p className="text-xs text-gray-500">Pontos totais</p>
              </div>
            </div>
          </Card>
          <Card className="p-5 border-2 border-brand-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                <Gamepad2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{gamesPlayed}</p>
                <p className="text-xs text-gray-500">Jogos jogados</p>
              </div>
            </div>
          </Card>
        </div>

        {/* History */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Histórico de Jogos</h2>
        {progress.length > 0 ? (
          <div className="space-y-2">
            {progress.map((entry) => (
              <Card key={entry.id} className="p-4 border-2 border-brand-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Gamepad2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{entry.games?.title ?? 'Jogo'}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(entry.played_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {entry.completed && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Concluído
                    </span>
                  )}
                  <span className="font-bold text-brand-600">{entry.score} pts</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Gamepad2 className="h-12 w-12 mx-auto mb-3 text-brand-200" />
            <p>Você ainda não jogou nenhum jogo.</p>
            <Button
              className="mt-4 bg-brand-500 hover:bg-brand-600 text-white"
              onClick={() => router.push('/dashboard')}
            >
              Explorar Jogos
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
