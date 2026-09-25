'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { isAuthorized } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface LiteracyLevel {
  id: string;
  name: string;
}

export default function ConteudoPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [levels, setLevels] = useState<LiteracyLevel[]>([]);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [levelId, setLevelId] = useState('');
  const [difficulty, setDifficulty] = useState<'facil' | 'medio' | 'dificil'>('facil');
  const [lyrics, setLyrics] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAuthorized(profile?.role))) {
      router.push('/');
    }
  }, [user, profile, loading, router]);

  useEffect(() => {
    supabase
      .from('literacy_levels')
      .select('id, name')
      .order('order_index')
      .then(({ data }) => setLevels((data ?? []) as LiteracyLevel[]));
  }, []);

  if (loading || !user || !isAuthorized(profile?.role)) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const lines = lyrics.split('\n').map((l) => l.trim()).filter(Boolean);
    if (!title || lines.length === 0) {
      toast.error('Preencha o título e ao menos uma linha da letra');
      return;
    }

    setSaving(true);
    const { data: song, error: songError } = await supabase
      .from('songs')
      .insert({
        title,
        artist: artist || null,
        literacy_level_id: levelId || null,
        difficulty,
      })
      .select('id')
      .single();

    if (songError || !song) {
      toast.error(`Erro ao criar música: ${songError?.message}`);
      setSaving(false);
      return;
    }

    const { error: linesError } = await supabase.from('song_lines').insert(
      lines.map((text, i) => ({ song_id: song.id, line_order: i + 1, text }))
    );

    setSaving(false);
    if (linesError) {
      toast.error(`Erro ao criar linhas: ${linesError.message}`);
      return;
    }

    toast.success('Música cadastrada com sucesso!');
    setTitle('');
    setArtist('');
    setLevelId('');
    setDifficulty('facil');
    setLyrics('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Cadastrar Letra de Música</h1>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist">Artista</Label>
              <Input id="artist" value={artist} onChange={(e) => setArtist(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Nível de Alfabetização</Label>
              <Select value={levelId} onValueChange={setLevelId}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {levels.map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Dificuldade</Label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as typeof difficulty)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="facil">Fácil</SelectItem>
                  <SelectItem value="medio">Médio</SelectItem>
                  <SelectItem value="dificil">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lyrics">Letra (uma linha por verso)</Label>
              <Textarea
                id="lyrics"
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                rows={10}
                required
              />
            </div>
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? 'Salvando...' : 'Salvar Música'}
            </Button>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
