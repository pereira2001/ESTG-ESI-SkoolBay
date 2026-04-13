import { Badge } from '@/components/ui/badge'
import type { RequestStatus } from '@prisma/client'

const STATUS_MAP: Record<RequestStatus, { label: string; className: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  PENDING: {
    label: 'Pendente',
    className: '',
    variant: 'secondary',
  },
  ACCEPTED: {
    label: 'Aceite',
    className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
    variant: 'outline',
  },
  COMPLETED: {
    label: 'Concluído',
    className: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400',
    variant: 'outline',
  },
  REJECTED: {
    label: 'Recusado',
    className: '',
    variant: 'destructive',
  },
  CANCELLED: {
    label: 'Cancelado',
    className: 'text-muted-foreground',
    variant: 'outline',
  },
}

interface RequestStatusBadgeProps {
  status: RequestStatus
}

export function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  const { label, className, variant } = STATUS_MAP[status]
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  )
}
