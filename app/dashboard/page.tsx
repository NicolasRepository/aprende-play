'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { Card } from '@/components/ui/card';
import { useGames, useSongs } from '@/hooks/use-games';
import { resolveIcon } from '@/lib/icon-map';
import { Play, Sparkles, Music } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const { games, loading: gamesLoading } = useGames();
  const { songs } = useSongs();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-brand-500 font-semibold text-lg">Carregando...</div>
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-50/50 to-white">
      <Navbar />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Olá, <span className="text-brand-500">{profile?.full_name?.split(' ')[0] ?? 'Aluno'}</span>!
          </h1>
          <p className="text-gray-500 mt-2">Escolha um jogo para começar a aprender brincando</p>
          {profile?.role === 'usuario_autorizado' && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
              <Sparkles className="h-4 w-4" />
              Conta Autorizada — você pode adicionar conteúdos customizados
            </div>
          )}
        </div>

        {gamesLoading ? (
          <p className="text-center py-20 text-gray-500">Carregando jogos...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => {
              const Icon = resolveIcon(game.subject?.icon);
              return (
                <Link key={game.slug} href={`/jogar/${game.slug}`}>
                  <Card className="group h-full border-2 border-brand-100 overflow-hidden transition-all hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10 cursor-pointer">
                    <div className="relative h-32 flex items-center justify-center overflow-hidden" style={{ backgroundColor: game.subject?.color ?? '#FF6600' }}>
                      <Icon className="h-14 w-14 text-white/90 transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{game.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">{game.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-sm font-medium text-brand-600">
                          <Play className="h-4 w-4" /> Jogar agora
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Music className="h-3.5 w-3.5" /> {songs.length} música{songs.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
