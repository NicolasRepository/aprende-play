'use client';

import { useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useGameBySlug } from '@/hooks/use-games';
import { getGameComponent } from '@/lib/game-registry';

export default function PlayGamePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { user, loading: authLoading } = useAuth();
  const { game, loading: gameLoading } = useGameBySlug(slug);

  const handleScore = useCallback((_s: number) => {}, []);

  const handleComplete = useCallback(
    async (finalScore: number) => {
      if (!user) return;
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameSlug: slug, score: finalScore, completed: true }),
        });
      } catch (err) {
        console.error('Erro ao salvar progresso:', err);
      }
    },
    [user, slug]
  );

  if (authLoading || gameLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-brand-500 font-semibold text-lg">Carregando jogo...</div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Jogo não encontrado</h1>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600"
        >
          Voltar para o Dashboard
        </button>
      </div>
    );
  }

  const GameComponent = getGameComponent(game.game_type);
  if (!GameComponent) return null;

  return <GameComponent game={game} onScore={handleScore} onComplete={handleComplete} />;
}
