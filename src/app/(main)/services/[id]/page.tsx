import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Euro, Pencil } from 'lucide-react'

interface ServicePageProps {
  params: { id: string }
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
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
      where: { id: params.id, isActive: true },
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
      },
    }),
    auth(),
  ])

  if (!service) notFound()

  const isOwner = session?.user?.id === service.userId

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            {service.category && (
              <Badge variant="secondary" className="mb-2">{service.category.name}</Badge>
            )}
            <h1 className="text-2xl font-bold leading-tight">{service.title}</h1>
          </div>
          {isOwner && (
            <Link
              href={`/services/${service.id}/edit`}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'shrink-0 gap-1.5')}
            >
              <Pencil className="h-3.5 w-3.5" />Editar
            </Link>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-2xl font-semibold text-primary">
          <Euro className="h-5 w-5" />
          {service.price.toFixed(2)}
        </div>
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
        <Link href={`/profile/${service.user.id}`} className="flex items-center gap-3 group w-fit">
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
          </div>
        </Link>
      </div>
    </div>
  )
}
