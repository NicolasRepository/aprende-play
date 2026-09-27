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
import { Plus, Trash2, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface GapEntry {
  word: string;
  options: string;
}

interface LineEntry {
  text: string;
  gaps: GapEntry[];
}

export default function ConteudoPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [levels, setLevels] = useState<LiteracyLevel[]>([]);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [levelId, setLevelId] = useState('');
  const [difficulty, setDifficulty] = useState<'facil' | 'medio' | 'dificil'>('facil');
  const [lines, setLines] = useState<LineEntry[]>([{ text: '', gaps: [] }]);
  const [saving, setSaving] = useState(false);
  const [lotoWord, setLotoWord] = useState('');
  const [lotoLevelId, setLotoLevelId] = useState('');
  const [lotoImage, setLotoImage] = useState<File | null>(null);
  const [lotoSaving, setLotoSaving] = useState(false);

  const handleLotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lotoWord.trim() || !lotoImage) {
      toast.error('Preencha a palavra e selecione uma imagem');
      return;
    }

    setLotoSaving(true);
    const ext = lotoImage.name.split('.').pop();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('lotoleitura-images')
      .upload(path, lotoImage);

    if (uploadError) {
      toast.error(`Erro ao enviar imagem: ${uploadError.message}`);
      setLotoSaving(false);
      return;
    }

    const { data: publicUrl } = supabase.storage.from('lotoleitura-images').getPublicUrl(path);

    const { error: insertError } = await supabase.from('lotoleitura_words').insert({
      word: lotoWord.trim(),
      image_url: publicUrl.publicUrl,
      literacy_level_id: lotoLevelId || null,
    });

    setLotoSaving(false);
    if (insertError) {
      toast.error(`Erro ao cadastrar palavra: ${insertError.message}`);
      return;
    }

    toast.success('Palavra cadastrada com sucesso!');
    setLotoWord('');
    setLotoLevelId('');
    setLotoImage(null);
  };
  
  const addLine = () => setLines((prev) => [...prev, { text: '', gaps: [] }]);

  const removeLine = (i: number) =>
    setLines((prev) => prev.filter((_, idx) => idx !== i));

  const updateLineText = (i: number, text: string) =>
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, text } : l)));

  const addGap = (i: number) =>
    setLines((prev) =>
      prev.map((l, idx) =>
        idx === i ? { ...l, gaps: [...l.gaps, { word: '', options: '' }] } : l
      )
    );

  const removeGap = (i: number, gi: number) =>
    setLines((prev) =>
      prev.map((l, idx) =>
        idx === i ? { ...l, gaps: l.gaps.filter((_, gidx) => gidx !== gi) } : l
      )
    );

  const updateGap = (i: number, gi: number, field: keyof GapEntry, value: string) =>
    setLines((prev) =>
      prev.map((l, idx) =>
        idx === i
          ? {
              ...l,
              gaps: l.gaps.map((g, gidx) =>
                gidx === gi ? { ...g, [field]: value } : g
              ),
            }
          : l
      )
    );

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
    const validLines = lines.filter((l) => l.text.trim());
    if (!title || validLines.length === 0) {
      toast.error('Preencha o título e ao menos uma linha da letra');
      return;
    }

    for (const l of validLines) {
      for (const g of l.gaps) {
        if (g.word.trim() && !l.text.includes(g.word.trim())) {
          toast.error(`A lacuna "${g.word}" precisa existir no texto: "${l.text}"`);
          return;
        }
      }
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

    const { data: insertedLines, error: linesError } = await supabase
      .from('song_lines')
      .insert(
        validLines.map((l, i) => ({ song_id: song.id, line_order: i + 1, text: l.text.trim() }))
      )
      .select('id, line_order');

    if (linesError || !insertedLines) {
      setSaving(false);
      toast.error(`Erro ao criar linhas: ${linesError?.message}`);
      return;
    }

    const gapRows = insertedLines.flatMap((row, i) =>
      validLines[i].gaps
        .filter((g) => g.word.trim())
        .map((g) => {
          const word = g.word.trim();
          const optionSet = new Set(
            [word, ...g.options.split(',').map((o) => o.trim())].filter(Boolean)
          );
          return {
            song_line_id: row.id,
            gap_word: word,
            gap_options: Array.from(optionSet),
          };
        })
    );

    if (gapRows.length > 0) {
      const { error: gapsError } = await supabase.from('song_line_gaps').insert(gapRows);
      if (gapsError) {
        setSaving(false);
        toast.error(`Erro ao criar lacunas: ${gapsError.message}`);
        return;
      }
    }

    setSaving(false);
    toast.success('Música cadastrada com sucesso!');
    setTitle('');
    setArtist('');
    setLevelId('');
    setDifficulty('facil');
    setLines([{ text: '', gaps: [] }]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Criação de Conteúdo</h1>
        <Tabs defaultValue="musica">
          <TabsList className="mb-6">
            <TabsTrigger value="musica">Letra de Música</TabsTrigger>
            <TabsTrigger value="lotoleitura">Lotoleitura (Imagem + Palavra)</TabsTrigger>
          </TabsList>

          <TabsContent value="lotoleitura">
            <Card className="p-6">
              <form onSubmit={handleLotoSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lotoWord">Palavra</Label>
                  <Input
                    id="lotoWord"
                    value={lotoWord}
                    onChange={(e) => setLotoWord(e.target.value)}
                    placeholder="Ex: banana"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Esta palavra será usada nos 3 jogos de Lotoleitura (vogais, consoantes e completa).
                  </p>
                </div>
                {/*<div className="space-y-2">
                  <Label>Nível de Alfabetização</Label>
                  <Select value={lotoLevelId} onValueChange={setLotoLevelId}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {levels.map((l) => (
                        <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>*/}
                <div className="space-y-2">
                  <Label htmlFor="lotoImage">Imagem</Label>
                  <Input
                    id="lotoImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLotoImage(e.target.files?.[0] ?? null)}
                    required
                  />
                  {lotoImage && (
                    <img
                      src={URL.createObjectURL(lotoImage)}
                      alt="Pré-visualização"
                      className="h-32 rounded-lg object-contain border mt-2"
                    />
                  )}
                </div>
                <Button type="submit" disabled={lotoSaving} className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  {lotoSaving ? 'Enviando...' : 'Salvar Palavra'}
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="musica">
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
            {/*<div className="space-y-2">
              <Label>Alfabetização</Label>
              <Select value={levelId} onValueChange={setLevelId}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {levels.map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>*/}
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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Linhas da Música e Lacunas</Label>
                <Button type="button" size="sm" variant="outline" onClick={addLine}>
                  <Plus className="w-4 h-4 mr-1" /> Linha
                </Button>
              </div>
              {lines.map((line, i) => (
                <Card key={i} className="p-3 space-y-2 bg-muted/30">
                  <div className="flex gap-2 items-start">
                    <Input
                      placeholder={`Verso ${i + 1}`}
                      value={line.text}
                      onChange={(e) => updateLineText(i, e.target.value)}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeLine(i)}
                      disabled={lines.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {line.gaps.map((gap, gi) => (
                    <div key={gi} className="flex gap-2 items-center pl-4">
                      <Input
                        placeholder="Palavra a lacunar (deve existir no verso)"
                        value={gap.word}
                        onChange={(e) => updateGap(i, gi, 'word', e.target.value)}
                        className="max-w-[220px]"
                      />
                      <Input
                        placeholder="Opções erradas (separadas por vírgula)"
                        value={gap.options}
                        onChange={(e) => updateGap(i, gi, 'options', e.target.value)}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeGap(i, gi)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    size="sm"
                    variant="link"
                    onClick={() => addGap(i)}
                    className="pl-4"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Adicionar lacuna nesta linha
                  </Button>
                </Card>
              ))}
            </div>
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? 'Salvando...' : 'Salvar Música'}
            </Button>
          </form>
        </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
