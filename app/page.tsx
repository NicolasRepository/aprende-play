'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { Button } from '@/components/ui/button';
import { GAME_REGISTRY } from '@/lib/game-registry';
import {
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Landmark,
  Sparkles,
  Play,
  Monitor,
  Eye,
  LayoutGrid,
  ArrowRight,
  Check,
} from 'lucide-react';

const subjectIcons: Record<string, typeof BookOpen> = {
  portugues: BookOpen,
  matematica: Calculator,
  ciencias: FlaskConical,
  historia: Landmark,
  geografia: Globe,
};

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-50">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-9xl animate-float">📚</div>
          <div className="absolute top-20 right-20 text-8xl animate-float" style={{ animationDelay: '1s' }}>🎮</div>
          <div className="absolute bottom-10 left-1/4 text-7xl animate-float" style={{ animationDelay: '2s' }}>✏️</div>
          <div className="absolute bottom-20 right-1/3 text-7xl animate-float" style={{ animationDelay: '0.5s' }}>🧩</div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
                <Sparkles className="h-4 w-4" />
                Aprender brincando
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900">
                Jogos educacionais para{' '}
                <span className="text-brand-500">alfabetização</span> e ensino fundamental
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                Aprende Play é uma plataforma de jogos educacionais que torna o aprendizado
                divertido. Pensado para professores e alunos, com acessibilidade para lousas interativas.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={user ? '/dashboard' : '/cadastro'}>
                  <Button size="lg" className="bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30">
                    {user ? 'Ir para os Jogos' : 'Começar Agora'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/sobre">
                  <Button size="lg" variant="outline" className="border-brand-200 text-brand-600 hover:bg-brand-50">
                    Saber Mais
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero card */}
            <div className="relative animate-pop-in">
              <div className="rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 p-1 shadow-2xl shadow-brand-500/20">
                <div className="rounded-3xl bg-white p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Jogos em Destaque</h3>
                    <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                      {GAME_REGISTRY.length} jogos
                    </span>
                  </div>
                  <div className="space-y-3">
                    {GAME_REGISTRY.map((game, idx) => {
                      const Icon = subjectIcons[game.subjectSlug] ?? BookOpen;
                      return (
                        <div
                          key={game.slug}
                          className="flex items-center gap-3 rounded-xl border-2 border-brand-100 p-3 transition-all hover:border-brand-300 hover:bg-brand-50"
                        >
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                            style={{ backgroundColor: game.color }}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{game.title}</p>
                            <p className="text-xs text-gray-500">{game.description}</p>
                          </div>
                          <Play className="h-5 w-5 text-brand-400" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Recursos que fazem a diferença
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              Pensado para o ambiente escolar, com foco em acessibilidade e aprendizado
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border-2 border-brand-100 p-6 transition-all hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 mb-4">
                <Monitor className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Modo Lousa Interativa</h3>
              <p className="text-gray-500">
                Layout otimizado para lousas interativas, com elementos fixos na parte inferior
                para facilitar o alcance físico das crianças.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-brand-100 p-6 transition-all hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 mb-4">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Alto Contraste</h3>
              <p className="text-gray-500">
                Modo visual em preto e branco para máxima legibilidade, ideal para alunos com
                dificuldades visuais.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-brand-100 p-6 transition-all hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 mb-4">
                <LayoutGrid className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Arquitetura Modular</h3>
              <p className="text-gray-500">
                Novos jogos podem ser adicionados facilmente, herdando a interface base e os
                controles de acessibilidade automaticamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-brand-50">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Como funciona
            </h2>
            <p className="text-gray-500 mt-3">Três passos simples para começar</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Crie sua conta', desc: 'Cadastre-se como professor ou aluno em segundos' },
              { step: '2', title: 'Escolha um jogo', desc: 'Filtre por disciplina e ano escolar' },
              { step: '3', title: 'Jogue e aprenda', desc: 'Acompanhe o progresso e a pontuação' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 text-white text-2xl font-bold shadow-lg shadow-brand-500/30 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <div className="rounded-3xl bg-gradient-to-r from-brand-500 to-brand-600 p-8 md:p-12 text-center shadow-2xl shadow-brand-500/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para aprender brincando?
            </h2>
            <p className="text-brand-50 mb-8 max-w-2xl mx-auto">
              Junte-se à Aprende Play e descubra uma nova forma de aprender.
              Cadastro gratuito, sem complicação.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href={user ? '/dashboard' : '/cadastro'}>
                <Button size="lg" className="bg-white text-brand-600 hover:bg-brand-50">
                  {user ? 'Explorar Jogos' : 'Criar Conta Grátis'}
                </Button>
              </Link>
              <Link href="/login">
                {!user ? '<Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white"> Já tenho conta </Button>'}
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/80 text-sm">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Grátis
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Acessível
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Para professores e alunos
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
