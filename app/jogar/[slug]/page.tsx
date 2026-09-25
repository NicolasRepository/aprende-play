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

  const handleScore = useCallback((_score: number) => {
    // Poderia atualizar um placar em tempo real aqui, se necessário
  }, []);

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

  const handleExit = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

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
        <p className="text-gray-500">O jogo "{slug}" não existe ou não está disponível.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors"
        >
          Voltar para o Dashboard
        </button>
      </div>
    );
  }

  const GameComponent = getGameComponent(game.game_type);

  if (!GameComponent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Tipo de jogo não suportado</h1>
        <p className="text-gray-500">O tipo "{game.game_type}" ainda não tem um componente registrado.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors"
        >
          Voltar para o Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <GameComponent
        game={game}
        onScore={handleScore}
        onComplete={handleComplete}
        onExit={handleExit}
      />
    </div>
  );
}
