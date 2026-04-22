'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { RequestStatusBadge } from './request-status-badge'
import { cancelRequest } from '@/actions/requests'
import { ExternalLink, User, XCircle } from 'lucide-react'
import type { RequestStatus } from '@prisma/client'

interface SentRequestCardProps {
  request: {
    id: string
    message: string
    status: RequestStatus
    createdAt: Date
    service: {
      id: string
      title: string
      user: { id: string; name: string; avatarUrl: string | null }
    }
  }
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function SentRequestCard({ request }: SentRequestCardProps) {
  const [isPending, startTransition] = useTransition()
  const canCancel = request.status === 'PENDING' || request.status === 'ACCEPTED'

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelRequest(request.id)
      if (!result.success) {
        toast.error(result.error ?? 'Erro ao cancelar pedido.')
      } else {
        toast.success('Pedido cancelado.')
      }
    })
  }

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3 text-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/services/${request.service.id}`}
            className="font-medium hover:text-primary transition-colors flex items-center gap-1 w-fit"
          >
            {request.service.title}
            <ExternalLink className="h-3 w-3 shrink-0" />
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">{formatDate(request.createdAt)}</p>
        </div>
        <RequestStatusBadge status={request.status} />
      </div>

      {/* Prestador */}
      <Link
        href={`/profile/${request.service.user.id}`}
        className="flex items-center gap-2 w-fit group"
      >
        <Avatar className="size-6 shrink-0">
          <AvatarImage
            src={request.service.user.avatarUrl ?? undefined}
            alt={request.service.user.name}
          />
          <AvatarFallback className="text-[10px]">
            {getInitials(request.service.user.name)}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
          <User className="h-3 w-3" />
          {request.service.user.name}
        </span>
      </Link>

      {/* Mensagem */}
      <p className="text-muted-foreground leading-relaxed line-clamp-3">{request.message}</p>

      {/* Cancelar */}
      {canCancel && (
        <div className="pt-1">
          <Button
            size="sm"
            variant="destructive"
            onClick={handleCancel}
            disabled={isPending}
            className="gap-1"
          >
            <XCircle className="h-3.5 w-3.5" />
            {isPending ? 'A cancelar...' : 'Cancelar pedido'}
          </Button>
        </div>
      )}
    </div>
  )
}
