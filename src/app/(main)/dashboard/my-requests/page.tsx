import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { SentRequestCard } from '@/components/requests/sent-request-card'
import { RequestStatusFilter } from '@/components/requests/request-status-filter'
import type { RequestStatus } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Os meus pedidos — SkoolBay',
}

const VALID_STATUSES = new Set<RequestStatus>([
  'PENDING',
  'ACCEPTED',
  'COMPLETED',
  'REJECTED',
  'CANCELLED',
])

interface PageProps {
  searchParams: { status?: string }
}

export default async function MyRequestsPage({ searchParams }: PageProps) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/dashboard/my-requests')

  const rawStatus = searchParams.status
  const statusFilter =
    rawStatus && VALID_STATUSES.has(rawStatus as RequestStatus)
      ? (rawStatus as RequestStatus)
      : undefined

  const requests = await prisma.serviceRequest.findMany({
    where: {
      buyerId: session.user.id,
      ...(statusFilter && { status: statusFilter }),
    },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      message: true,
      status: true,
      createdAt: true,
      service: {
        select: {
          id: true,
          title: true,
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
      },
    },
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold">Os meus pedidos</h1>
        <p className="text-muted-foreground text-sm">Pedidos que enviaste a prestadores</p>
      </div>

      <Suspense fallback={null}>
        <RequestStatusFilter basePath="/dashboard/my-requests" />
      </Suspense>

      <div className="mt-6 space-y-3">
        {requests.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {statusFilter ? 'Nenhum pedido com este estado.' : 'Ainda não enviaste nenhum pedido.'}
          </p>
        ) : (
          requests.map((request) => (
            <SentRequestCard key={request.id} request={request} />
          ))
        )}
      </div>
    </div>
  )
}
