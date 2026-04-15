import type { Metadata } from 'next'
import { GraduationCap, Code2, Users, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre — SkoolBay',
}

const STACK = [
  { label: 'Framework', value: 'Next.js 14 (App Router)' },
  { label: 'Linguagem', value: 'TypeScript' },
  { label: 'ORM', value: 'Prisma + PostgreSQL' },
  { label: 'Autenticação', value: 'NextAuth.js v5' },
  { label: 'UI', value: 'Tailwind CSS + shadcn/ui' },
  { label: 'Testes', value: 'Vitest' },
  { label: 'Deploy', value: 'Docker + Vercel' },
]

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Sobre o SkoolBay</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          O <strong className="text-foreground">SkoolBay</strong> é um marketplace de serviços entre
          estudantes universitários. A plataforma permite publicar, pesquisar e contratar
          competências — tutoria, design, programação, fotografia, idiomas e muito mais — dentro
          da comunidade académica.
        </p>
      </div>

      {/* O que podes fazer */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          O que podes fazer
        </h2>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary font-medium shrink-0">→</span>
            Publicar serviços e definir o teu preço por hora
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-medium shrink-0">→</span>
            Pesquisar e filtrar serviços por categoria, preço e avaliação
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-medium shrink-0">→</span>
            Enviar e gerir pedidos de serviço
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-medium shrink-0">→</span>
            Avaliar prestadores após a conclusão do serviço
          </li>
          <li className="flex gap-2">
            <span className="text-primary font-medium shrink-0">→</span>
            Denunciar conteúdos inadequados
          </li>
        </ul>
      </div>

      {/* Stack técnica */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Code2 className="h-5 w-5 text-primary" />
          Stack tecnológica
        </h2>
        <div className="rounded-xl border divide-y">
          {STACK.map(({ label, value }) => (
            <div key={label} className="flex items-center gap-4 px-4 py-3 text-sm">
              <span className="w-36 shrink-0 font-medium text-muted-foreground">{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contexto académico */}
      <div className="rounded-xl border bg-primary/5 p-6 space-y-2">
        <div className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-5 w-5 text-primary" />
          Contexto académico
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Projeto desenvolvido no âmbito da Unidade Curricular de{' '}
          <strong className="text-foreground">Engenharia de Software I</strong>, 2.º ano do curso
          de Engenharia Informática do{' '}
          <strong className="text-foreground">Instituto Piaget</strong> — ano letivo 2025/2026.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Seguiu uma metodologia <strong className="text-foreground">Scrum</strong> com 6 sprints,
          20 user stories, e entrega contínua via GitHub Pull Requests.
        </p>
        <div className="flex items-center gap-2 pt-1">
          <BookOpen className="h-4 w-4 text-primary" />
          <a
            href="https://github.com/pereira2001/ESTG-ESI-SkoolBay"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            github.com/pereira2001/ESTG-ESI-SkoolBay
          </a>
        </div>
      </div>
    </div>
  )
}
