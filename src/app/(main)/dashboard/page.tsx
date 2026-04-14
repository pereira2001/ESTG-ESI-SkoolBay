import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { RequestStatusBadge } from '@/components/requests/request-status-badge'
import { cn } from '@/lib/utils'
import {
  Inbox,
  SendHorizonal,
  Plus,
  Star,
  Briefcase,
  UserPen,
  ExternalLink,
  ArrowRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard — SkoolBay',
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(date))
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const userId = session.user.id

  const [
    publishedCount,
    receivedCount,
    sentCount,
    userData,
    latestReceived,
  ] = await Promise.all([
    prisma.service.count({ where: { userId, isActive: true } }),
    prisma.serviceRequest.count({ where: { service: { userId } } }),
    prisma.serviceRequest.count({ where: { buyerId: userId } }),
    prisma.user.findUnique({ where: { id: userId }, select: { rating: true } }),
    prisma.serviceRequest.findMany({
      where: { service: { userId } },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        status: true,
        createdAt: true,
        service: { select: { id: true, title: true } },
        buyer: { select: { name: true } },
      },
    }),
  ])

  const rating = userData?.rating ?? 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">
          Olá, {session.user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground text-sm">O que queres fazer hoje?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Serviços publicados
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-3xl font-bold">{publishedCount}</span>
            <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Pedidos recebidos
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-3xl font-bold">{receivedCount}</span>
            <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-primary/10">
              <Inbox className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Pedidos enviados
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-3xl font-bold">{sentCount}</span>
            <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-secondary">
              <SendHorizonal className="h-5 w-5 text-secondary-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Rating médio
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-3xl font-bold">
              {rating > 0 ? rating.toFixed(1) : '—'}
            </span>
            <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Star className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick links */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Ações rápidas
          </h2>

          <Link
            href="/services/new"
            className="group flex items-center gap-3 rounded-xl border bg-card p-4 text-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 group-hover:border-primary/50 transition-colors">
              <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold group-hover:text-primary transition-colors">Criar serviço</p>
              <p className="text-xs text-muted-foreground">Oferece os teus conhecimentos</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </Link>

          <Link
            href="/dashboard/requests"
            className="group flex items-center gap-3 rounded-xl border bg-card p-4 text-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Inbox className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold group-hover:text-primary transition-colors">Pedidos recebidos</p>
              <p className="text-xs text-muted-foreground">Gere os pedidos nos teus serviços</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </Link>

          <Link
            href="/dashboard/my-requests"
            className="group flex items-center gap-3 rounded-xl border bg-card p-4 text-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
              <SendHorizonal className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold group-hover:text-primary transition-colors">Os meus pedidos</p>
              <p className="text-xs text-muted-foreground">Acompanha os pedidos que enviaste</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </Link>

          <Link
            href={`/profile/${userId}`}
            className="group flex items-center gap-3 rounded-xl border bg-card p-4 text-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <UserPen className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold group-hover:text-primary transition-colors">Editar perfil</p>
              <p className="text-xs text-muted-foreground">Atualiza as tuas informações</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </Link>
        </div>

        {/* Latest received requests */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Últimos pedidos recebidos
            </h2>
            <Link
              href="/dashboard/requests"
              className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-xs gap-1')}
            >
              Ver todos
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {latestReceived.length === 0 ? (
            <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
              Ainda não recebeste nenhum pedido.
            </div>
          ) : (
            <div className="space-y-3">
              {latestReceived.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center gap-3 rounded-xl border bg-card p-4 text-sm"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{req.buyer.name}</p>
                    <Link
                      href={`/services/${req.service.id}`}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit mt-0.5"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span className="truncate">{req.service.title}</span>
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <RequestStatusBadge status={req.status} />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(req.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
