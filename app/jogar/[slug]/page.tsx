'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { createGameComponent } from '@/lib/game-registry';
import type { GameProps } from '@/lib/types';

export default function PlayGamePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { user, loading } = useAuth();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const GameComponent = createGameComponent(slug);

  const handleScore = useCallback((_score: number) => {
    // Could update live score display
  }, []);

  const handleComplete = useCallback(
    async (finalScore: number) => {
      if (!user) return;
      setSaving(true);
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gameSlug: slug,
            score: finalScore,
            completed: true,
          }),
        });
      } catch (err) {
        console.error('Erro ao salvar progresso:', err);
      } finally {
        setSaving(false);
      }
    },
    [user, slug]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-brand-500 font-semibold text-lg">Carregando jogo...</div>
      </div>
    );
  }

  if (!user) return null;

  if (!GameComponent) {
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

  const gameProps: GameProps = {
    settings: {
      deviceMode: 'pc',
      visualMode: 'cores_vivas',
      layoutMode: 'tela_cheia',
    },
    onScore: handleScore,
    onComplete: handleComplete,
  };

  return (
    <div className="min-h-screen">
      <GameComponent {...gameProps} />
      {saving && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-brand-500 text-white px-4 py-2 text-sm font-medium shadow-lg">
          Salvando progresso...
        </div>
      )}
    </div>
  );
}
