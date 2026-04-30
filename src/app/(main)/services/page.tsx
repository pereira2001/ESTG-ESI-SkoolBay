import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ServiceCard } from '@/components/services/service-card'
import { ServicesFilters } from '@/components/services/services-filters'
import { CategoriesGrid } from '@/components/services/categories-grid'
import { ServicesPageClient } from '@/components/services/ServicesPageClient'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Serviços — SkoolBay',
  description: 'Explora os serviços disponíveis na comunidade SkoolBay.',
}

const LIMIT = 12

type SortKey = 'newest' | 'price_asc' | 'rating'

interface PageProps {
  searchParams: {
    q?: string
    categoryId?: string
    maxPrice?: string
    sort?: string
    page?: string
  }
}

function buildOrderBy(sort: SortKey) {
  if (sort === 'price_asc') return { price: 'asc' as const }
  if (sort === 'rating') return { user: { rating: 'desc' as const } }
  return { createdAt: 'desc' as const }
}

export default async function ServicesPage({ searchParams }: PageProps) {
  const q = searchParams.q?.trim() ?? ''
  const categoryId = searchParams.categoryId?.trim() ?? ''
  const maxPrice = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined
  const sort = (['newest', 'price_asc', 'rating'].includes(searchParams.sort ?? '')
    ? (searchParams.sort as SortKey)
    : 'newest')
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10))

  const where = {
    isActive: true,
    ...(q && {
      OR: [
        { title: { contains: q, mode: 'insensitive' as const } },
        { description: { contains: q, mode: 'insensitive' as const } },
      ],
    }),
    ...(categoryId && { categoryId }),
    ...(maxPrice !== undefined && !isNaN(maxPrice) && { price: { lte: maxPrice } }),
  }

  const [services, total, categories] = await Promise.all([
    prisma.service.findMany({
      where,
      orderBy: buildOrderBy(sort),
      skip: (page - 1) * LIMIT,
      take: LIMIT,
      select: {
        id: true,
        title: true,
        price: true,
        createdAt: true,
        category: { select: { name: true } },
        user: { select: { id: true, name: true, avatarUrl: true, rating: true } },
      },
    }),
    prisma.service.count({ where }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { services: { where: { isActive: true } } } } },
    }),
  ])

  const totalPages = Math.ceil(total / LIMIT)

  function buildPageUrl(p: number) {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (categoryId) params.set('categoryId', categoryId)
    if (maxPrice !== undefined && !isNaN(maxPrice)) params.set('maxPrice', String(maxPrice))
    if (sort !== 'newest') params.set('sort', sort)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return `/services${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Serviços</h1>
        <p className="text-muted-foreground mt-1">
          Explora os serviços disponíveis na comunidade SkoolBay
        </p>
      </div>

      {/* Categories grid */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Explorar por categoria
        </h2>
        <CategoriesGrid
          categories={categories}
          activeCategoryId={categoryId || undefined}
        />
      </div>

      {/* Filters — wrapped in Suspense because ServicesFilters uses useSearchParams */}
      <Suspense fallback={<div className="h-10 w-full animate-pulse rounded-md bg-muted" />}>
        <ServicesFilters categories={categories} />
      </Suspense>

      <ServicesPageClient categories={categories}>
        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          {total === 0
            ? 'Nenhum serviço encontrado.'
            : `${total} ${total === 1 ? 'serviço encontrado' : 'serviços encontrados'}`}
        </p>

        {services.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <p className="text-muted-foreground">Tenta ajustar os filtros ou pesquisa.</p>
            <Link href="/services" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
              Limpar filtros
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {page > 1 && (
                  <Link
                    href={buildPageUrl(page - 1)}
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Link>
                )}
                <span className="text-sm text-muted-foreground px-2">
                  Página {page} de {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={buildPageUrl(page + 1)}
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1')}
                  >
                    Seguinte
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </ServicesPageClient>
    </div>
  )
}
