'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { dismissReport, resolveReport, deactivateService, suspendUser } from '@/actions/admin'
import { ExternalLink, Ban, UserX, CheckCircle, XCircle } from 'lucide-react'
import type { ReportStatus, ReportTargetType } from '@prisma/client'

const REASON_LABELS: Record<string, string> = {
  INAPPROPRIATE: 'Conteúdo inapropriado',
  SPAM: 'Spam',
  FRAUD: 'Fraude',
  OTHER: 'Outro',
}

const STATUS_MAP: Record<ReportStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  PENDING: { label: 'Pendente', variant: 'secondary' },
  RESOLVED: { label: 'Resolvido', variant: 'default' },
  DISMISSED: { label: 'Descartado', variant: 'outline' },
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date))
}

interface ReportCardProps {
  report: {
    id: string
    reason: string
    description: string
    status: ReportStatus
    targetType: ReportTargetType
    targetId: string
    createdAt: Date
    reporter: { name: string; email: string }
  }
}

export function ReportCard({ report }: ReportCardProps) {
  const [isPending, startTransition] = useTransition()
  const { label, variant } = STATUS_MAP[report.status]
  const isPending_ = report.status === 'PENDING'

  function run(action: () => Promise<{ success: boolean; error?: string }>) {
    startTransition(async () => {
      const result = await action()
      if (!result.success) toast.error(result.error ?? 'Erro na operação.')
      else toast.success('Operação concluída.')
    })
  }

  const targetHref =
    report.targetType === 'SERVICE'
      ? `/services/${report.targetId}`
      : `/profile/${report.targetId}`
  const targetLabel = report.targetType === 'SERVICE' ? 'Serviço' : 'Utilizador'

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3 text-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">{targetLabel}</Badge>
            <span className="text-xs font-medium">{REASON_LABELS[report.reason] ?? report.reason}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Por {report.reporter.name} · {formatDate(report.createdAt)}
          </p>
        </div>
        <Badge variant={variant}>{label}</Badge>
      </div>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed line-clamp-3">{report.description}</p>

      {/* Target link */}
      <Link
        href={targetHref}
        target="_blank"
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ExternalLink className="h-3 w-3" />
        Ver {targetLabel.toLowerCase()} denunciado
      </Link>

      {/* Actions — only for PENDING */}
      {isPending_ && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {report.targetType === 'SERVICE' && (
            <Button
              size="sm"
              variant="destructive"
              disabled={isPending}
              onClick={() => run(() => deactivateService(report.id, report.targetId))}
              className="gap-1.5"
            >
              <Ban className="h-3.5 w-3.5" />
              Desativar serviço
            </Button>
          )}
          {report.targetType === 'USER' && (
            <Button
              size="sm"
              variant="destructive"
              disabled={isPending}
              onClick={() => run(() => suspendUser(report.id, report.targetId))}
              className="gap-1.5"
            >
              <UserX className="h-3.5 w-3.5" />
              Suspender utilizador
            </Button>
          )}
          <Button
            size="sm"
            variant="secondary"
            disabled={isPending}
            onClick={() => run(() => resolveReport(report.id))}
            className="gap-1.5"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Resolver
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => run(() => dismissReport(report.id))}
            className="gap-1.5"
          >
            <XCircle className="h-3.5 w-3.5" />
            Descartar
          </Button>
        </div>
      )}
    </div>
  )
}
