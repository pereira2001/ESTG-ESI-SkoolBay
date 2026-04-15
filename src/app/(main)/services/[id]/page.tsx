import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ServiceActions } from '@/components/services/service-actions'
import { ReportModal } from '@/components/report/report-modal'
import { Euro, Star, CheckCircle2, XCircle } from 'lucide-react'

interface ServicePageProps {
  params: { id: string }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(date),
  )
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const iconClass = size === 'md' ? 'h-4 w-4' : 'h-3 w-3'
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${iconClass} ${
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/40'
          }`}
        />
      ))}
    </div>
  )
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = await prisma.service.findUnique({
    where: { id: params.id },
    select: { title: true, description: true },
  })
  if (!service) return { title: 'Serviço não encontrado — SkoolBay' }
  return {
    title: `${service.title} — SkoolBay`,
    description: service.description.slice(0, 160),
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const [service, session] = await Promise.all([
    prisma.service.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        isActive: true,
        createdAt: true,
        userId: true,
        category: { select: { name: true } },
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            university: true,
            rating: true,
          },
        },
        requests: {
          where: { review: { isNot: null } },
          orderBy: { createdAt: 'desc' },
          select: {
            buyer: { select: { name: true, avatarUrl: true } },
            review: { select: { rating: true, comment: true, createdAt: true } },
          },
        },
      },
    }),
    auth(),
  ])

  if (!service) notFound()

  const isOwner = session?.user?.id === service.userId
  const isAuthenticated = !!session?.user
  const canReport = isAuthenticated && !isOwner

  const reviews = service.requests.flatMap((r) =>
    r.review
      ? [{ buyer: r.buyer, rating: r.review.rating, comment: r.review.comment, createdAt: r.review.createdAt }]
      : [],
  )

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {service.category && (
              <Badge variant="secondary">{service.category.name}</Badge>
            )}
            <Badge
              variant={service.isActive ? 'default' : 'outline'}
              className="gap-1 text-xs"
            >
              {service.isActive ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  Disponível
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3" />
                  Indisponível
                </>
              )}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold leading-tight">{service.title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-2xl font-semibold text-primary">
            <Euro className="h-5 w-5" />
            {service.price.toFixed(2)}
          </div>
          {avgRating !== null && (
            <div className="flex items-center gap-1.5">
              <StarRating rating={Math.round(avgRating)} size="md" />
              <span className="text-sm text-muted-foreground">
                {avgRating.toFixed(1)} ({reviews.length})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Ação principal */}
      <div className="flex items-center gap-3">
        <ServiceActions
          serviceId={service.id}
          isOwner={isOwner}
          isAuthenticated={isAuthenticated}
        />
        {canReport && (
          <ReportModal targetType="SERVICE" targetId={service.id} />
        )}
      </div>

      <Separator />

      {/* Descrição */}
      <div>
        <h2 className="text-sm font-semibold mb-2">Descrição</h2>
        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
          {service.description}
        </p>
      </div>

      <Separator />

      {/* Prestador */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Prestador</h2>
        <Link
          href={`/profile/${service.user.id}`}
          className="flex items-center gap-3 group w-fit"
        >
          <Avatar className="size-10">
            <AvatarImage src={service.user.avatarUrl ?? undefined} alt={service.user.name} />
            <AvatarFallback>{getInitials(service.user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium group-hover:underline underline-offset-4">
              {service.user.name}
            </p>
            {service.user.university && (
              <p className="text-xs text-muted-foreground">{service.user.university}</p>
            )}
            {service.user.rating > 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                <StarRating rating={Math.round(service.user.rating)} />
                <span className="text-xs text-muted-foreground">
                  {service.user.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <>
          <Separator />
          <div>
            <h2 className="text-sm font-semibold mb-4">
              Avaliações ({reviews.length})
            </h2>
            <ul className="space-y-5">
              {reviews.map((review, i) => (
                <li key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarImage
                          src={review.buyer.avatarUrl ?? undefined}
                          alt={review.buyer.name}
                        />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(review.buyer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{review.buyer.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-muted-foreground pl-9 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
