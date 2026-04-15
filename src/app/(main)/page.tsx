export const dynamic = 'force-dynamic'

import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ServiceCard } from '@/components/services/service-card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Laptop, Palette, Languages, GraduationCap, Music, Camera,
  PenLine, Package, FlaskConical, Brush, Trophy,
  type LucideIcon,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'SkoolBay — Marketplace de serviços entre estudantes',
  description: 'Encontra tutoria, design, programação e muito mais na comunidade universitária.',
}

const ICON_MAP: Record<string, LucideIcon> = {
  Laptop, Palette, Languages, GraduationCap, Music, Camera,
  PenLine, Package, FlaskConical, Brush, Trophy,
}

const HOW_IT_WORKS = [
  { step: 1, title: 'Regista-te', desc: 'Cria uma conta gratuita com o teu e-mail universitário.' },
  { step: 2, title: 'Pesquisa', desc: 'Explora serviços por categoria ou usa a pesquisa livre.' },
  { step: 3, title: 'Contrata', desc: 'Envia um pedido, combina os detalhes e paga online.' },
]

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { services: { where: { isActive: true } } } } },
    }),
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        price: true,
        category: { select: { name: true } },
        user: { select: { id: true, name: true, avatarUrl: true, rating: true } },
      },
    }),
  ])

  return (
    <div className="flex flex-col">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="py-24 px-4 text-center"
        style={{ background: 'linear-gradient(160deg, #EEEDFE 0%, #ffffff 100%)' }}
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Encontra ajuda.<br />
            <span style={{ color: '#7F77DD' }}>Partilha competências.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            O SkoolBay é o marketplace de serviços entre estudantes universitários.
            Tutoria, design, tradução, programação — tudo numa plataforma.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link
              href="/services"
              className={cn(buttonVariants({ size: 'lg' }), 'rounded-full px-8')}
            >
              Explorar serviços
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: 'lg', variant: 'outline' }),
                'rounded-full px-8 border-[#7F77DD] text-[#7F77DD] hover:bg-[#EEEDFE]',
              )}
            >
              Registar-me
            </Link>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Como funciona</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-white text-lg font-bold shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7F77DD 0%, #534AB7 100%)' }}
                >
                  {step}
                </div>
                <div>
                  <p className="font-semibold text-base">{title}</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIAS ───────────────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ backgroundColor: '#EEEDFE' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Explorar por categoria</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((cat) => {
              const Icon = (cat.icon && ICON_MAP[cat.icon]) ? ICON_MAP[cat.icon] : Package
              return (
                <Link
                  key={cat.id}
                  href={`/services?categoryId=${cat.id}`}
                  className="flex flex-col items-center gap-2 rounded-xl border border-[#7F77DD]/20 bg-white p-4 text-center text-sm transition-all hover:shadow-md hover:border-[#7F77DD]/50 hover:bg-[#EEEDFE]/60"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEEDFE]">
                    <Icon className="h-5 w-5 text-[#7F77DD]" />
                  </div>
                  <div>
                    <p className="font-medium leading-tight">{cat.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {cat._count.services} {cat._count.services === 1 ? 'serviço' : 'serviços'}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SERVIÇOS EM DESTAQUE ─────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold">Serviços em destaque</h2>
              <Link
                href="/services"
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-[#7F77DD]')}
              >
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA FINAL ────────────────────────────────────────────────── */}
      <section
        className="py-20 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #7F77DD 0%, #534AB7 100%)' }}
      >
        <div className="max-w-2xl mx-auto space-y-5">
          <h2 className="text-3xl font-bold text-white">
            Tens uma competência para partilhar?
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Publica o teu serviço em minutos e começa a receber pedidos da comunidade.
          </p>
          <Link
            href="/services/new"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'rounded-full px-10 bg-white text-[#534AB7] hover:bg-white/90 font-semibold',
            )}
          >
            Publicar serviço
          </Link>
        </div>
      </section>

    </div>
  )
}
