'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { RequestStatusBadge } from './request-status-badge'
import { acceptRequest, rejectRequest, completeRequest } from '@/actions/requests'
import { Check, X, CheckCheck, ExternalLink } from 'lucide-react'
import type { RequestStatus } from '@prisma/client'

interface ReceivedRequestCardProps {
  request: {
    id: string
    message: string
    status: RequestStatus
    createdAt: Date
    service: { id: string; title: string }
    buyer: { id: string; name: string; avatarUrl: string | null }
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

export function ReceivedRequestCard({ request }: ReceivedRequestCardProps) {
  const [isPending, startTransition] = useTransition()

  function handleAction(action: () => Promise<{ success: boolean; error?: string }>) {
    startTransition(async () => {
      const result = await action()
      if (!result.success) {
        toast.error(result.error ?? 'Erro ao atualizar pedido.')
      }
    })
  }

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3 text-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={request.buyer.avatarUrl ?? undefined} alt={request.buyer.name} />
            <AvatarFallback className="text-xs">{getInitials(request.buyer.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium truncate">{request.buyer.name}</p>
            <p className="text-xs text-muted-foreground">{formatDate(request.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <RequestStatusBadge status={request.status} />
        </div>
      </div>

      {/* Serviço */}
      <Link
        href={`/services/${request.service.id}`}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ExternalLink className="h-3 w-3" />
        {request.service.title}
      </Link>

      {/* Mensagem */}
      <p className="text-muted-foreground leading-relaxed line-clamp-3">{request.message}</p>

      {/* Ações */}
      {request.status === 'PENDING' && (
        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            onClick={() => handleAction(() => acceptRequest(request.id))}
            disabled={isPending}
            className="gap-1"
          >
            <Check className="h-3.5 w-3.5" />
            Aceitar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleAction(() => rejectRequest(request.id))}
            disabled={isPending}
            className="gap-1"
          >
            <X className="h-3.5 w-3.5" />
            Recusar
          </Button>
        </div>
      )}

      {request.status === 'ACCEPTED' && (
        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleAction(() => completeRequest(request.id))}
            disabled={isPending}
            className="gap-1"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Marcar como concluído
          </Button>
        </div>
      )}
    </div>
  )
}
