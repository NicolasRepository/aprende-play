import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { Monitor, Eye, LayoutGrid, Users, BookOpen, Shield } from 'lucide-react';

export default function SobrePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 py-12 md:px-6 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sobre o <span className="text-brand-500">Aprende Play</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Uma plataforma educacional de jogos para alfabetização e ensino fundamental,
            com foco em acessibilidade e aprendizado divertido.
          </p>
        </div>

        <div className="space-y-8">
          {/* Mission */}
          <section className="rounded-2xl bg-brand-50 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Nossa Missão</h2>
            <p className="text-gray-600 leading-relaxed">
              Acreditamos que aprender deve ser divertido. O Aprende Play foi criado para
              tornar a alfabetização e o ensino fundamental mais envolventes através de jogos
              educacionais. Nossa plataforma é pensada para professores e alunos, com recursos
              de acessibilidade que funcionam tanto no computador quanto na lousa interativa
              da sala de aula.
            </p>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recursos Principais</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  icon: Monitor,
                  title: 'Modo Lousa Interativa',
                  desc: 'Layout otimizado para uso em lousas, com elementos fixos na parte inferior da tela.',
                },
                {
                  icon: Eye,
                  title: 'Alto Contraste',
                  desc: 'Modo visual em preto e branco para máxima legibilidade e acessibilidade.',
                },
                {
                  icon: LayoutGrid,
                  title: 'Arquitetura Modular',
                  desc: 'Novos jogos podem ser adicionados facilmente, herdando a interface base e acessibilidade.',
                },
                {
                  icon: Users,
                  title: 'Sistema de Roles',
                  desc: 'Usuários comuns apenas jogam; usuários autorizados podem adicionar conteúdos customizados.',
                },
                {
                  icon: BookOpen,
                  title: 'Filtros por Disciplina',
                  desc: 'Filtre jogos por disciplina (Português, Matemática, Ciências, etc.) e ano escolar.',
                },
                {
                  icon: Shield,
                  title: 'Segurança de Dados',
                  desc: 'Row Level Security no banco de dados protege os dados de cada usuário.',
                },
              ].map((feat) => (
                <div
                  key={feat.title}
                  className="flex gap-4 rounded-xl border-2 border-brand-100 p-5 transition-all hover:border-brand-300"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                    <feat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{feat.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tech Stack */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tecnologia</h2>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'].map(
                (tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
