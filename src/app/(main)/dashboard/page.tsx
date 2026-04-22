import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Inbox, SendHorizonal, Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard — SkoolBay',
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const [receivedCount, sentCount] = await Promise.all([
    prisma.serviceRequest.count({
      where: { service: { userId: session.user.id }, status: 'PENDING' },
    }),
    prisma.serviceRequest.count({
      where: { buyerId: session.user.id, status: 'PENDING' },
    }),
  ])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">
          Olá, {session.user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground text-sm">O que queres fazer hoje?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Pedidos recebidos */}
        <Link
          href="/dashboard/requests"
          className="group flex flex-col gap-3 rounded-xl border bg-card p-5 text-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Inbox className="h-5 w-5 text-primary" />
            </div>
            {receivedCount > 0 && (
              <span className="inline-flex h-5 items-center rounded-full bg-primary px-2 text-xs font-medium text-primary-foreground">
                {receivedCount}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold group-hover:text-primary transition-colors">
              Pedidos recebidos
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Gere os pedidos nos teus serviços
            </p>
          </div>
        </Link>

        {/* Pedidos enviados */}
        <Link
          href="/dashboard/my-requests"
          className="group flex flex-col gap-3 rounded-xl border bg-card p-5 text-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
              <SendHorizonal className="h-5 w-5 text-secondary-foreground" />
            </div>
            {sentCount > 0 && (
              <span className="inline-flex h-5 items-center rounded-full bg-secondary px-2 text-xs font-medium text-secondary-foreground">
                {sentCount}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold group-hover:text-primary transition-colors">
              Os meus pedidos
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Acompanha os pedidos que enviaste
            </p>
          </div>
        </Link>

        {/* Publicar serviço */}
        <Link
          href="/services/new"
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'group flex flex-col items-start gap-3 rounded-xl h-auto p-5 text-sm',
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 group-hover:border-primary/50 transition-colors">
            <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div>
            <p className="font-semibold">Publicar serviço</p>
            <p className="text-xs text-muted-foreground mt-0.5 font-normal">
              Oferece os teus conhecimentos
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
