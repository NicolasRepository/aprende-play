'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GAME_REGISTRY, getFilteredGames } from '@/lib/game-registry';
import {
  SCHOOL_YEAR_LABELS,
  type SchoolYear,
  type Difficulty,
  DIFFICULTY_LABELS,
} from '@/lib/types';
import {
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Landmark,
  Play,
  Filter,
  Trophy,
  Sparkles,
  Lock,
} from 'lucide-react';

const subjectIcons: Record<string, typeof BookOpen> = {
  portugues: BookOpen,
  matematica: Calculator,
  ciencias: FlaskConical,
  historia: Landmark,
  geografia: Globe,
};

const subjectLabels: Record<string, string> = {
  portugues: 'Português',
  matematica: 'Matemática',
  ciencias: 'Ciências',
  historia: 'História',
  geografia: 'Geografia',
};

const subjects = [
  { slug: 'todos', label: 'Todas', icon: Sparkles, color: '#FF6600' },
  { slug: 'portugues', label: 'Português', icon: BookOpen, color: '#FF6600' },
  { slug: 'matematica', label: 'Matemática', icon: Calculator, color: '#3B82F6' },
  { slug: 'ciencias', label: 'Ciências', icon: FlaskConical, color: '#10B981' },
  { slug: 'historia', label: 'História', icon: Landmark, color: '#F59E0B' },
  { slug: 'geografia', label: 'Geografia', icon: Globe, color: '#8B5CF6' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string>('todos');
  const [selectedYear, setSelectedYear] = useState<string>('todos');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const filteredGames = useMemo(
    () => getFilteredGames(selectedSubject, selectedYear),
    [selectedSubject, selectedYear]
  );

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
        {/* Welcome */}
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

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Subject chips */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-600">
              <Filter className="h-4 w-4" />
              Disciplina
            </div>
            <div className="flex flex-wrap gap-2">
              {subjects.map((subj) => {
                const Icon = subj.icon;
                const isActive = selectedSubject === subj.slug;
                return (
                  <button
                    key={subj.slug}
                    onClick={() => setSelectedSubject(subj.slug)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                        : 'bg-white text-gray-600 border-2 border-brand-100 hover:border-brand-300 hover:bg-brand-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {subj.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Year select */}
          <div className="flex items-end gap-4">
            <div className="flex-1 max-w-xs">
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Ano Escolar</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="border-brand-200 focus:border-brand-400">
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SCHOOL_YEAR_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-500 pb-2">
              {filteredGames.length} jogo{filteredGames.length !== 1 ? 's' : ''} encontrado{filteredGames.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Games grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => {
              const Icon = subjectIcons[game.subjectSlug] ?? BookOpen;
              return (
                <Link key={game.slug} href={`/jogar/${game.slug}`}>
                  <Card className="group h-full border-2 border-brand-100 overflow-hidden transition-all hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10 cursor-pointer">
                    {/* Thumbnail */}
                    <div
                      className="relative h-32 flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: game.color }}
                    >
                      <Icon className="h-14 w-14 text-white/90 transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute bottom-2 right-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-gray-700">
                        {DIFFICULTY_LABELS[game.difficulty]}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-brand-600 uppercase tracking-wide">
                          {subjectLabels[game.subjectSlug] ?? game.subjectSlug}
                        </span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-500">
                          {SCHOOL_YEAR_LABELS[game.schoolYear]}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{game.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">{game.description}</p>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-sm font-medium text-brand-600">
                          <Play className="h-4 w-4" />
                          Jogar agora
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Trophy className="h-3.5 w-3.5" />
                          0 pts
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50 text-brand-300 mb-4">
              <Lock className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum jogo encontrado</h3>
            <p className="text-gray-500 max-w-sm">
              Tente mudar os filtros de disciplina ou ano escolar para ver mais jogos.
            </p>
            <Button
              variant="outline"
              className="mt-4 border-brand-200 text-brand-600 hover:bg-brand-50"
              onClick={() => {
                setSelectedSubject('todos');
                setSelectedYear('todos');
              }}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
