'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { RequestStatus } from '@prisma/client'

const FILTER_OPTIONS: { value: RequestStatus | '_all'; label: string }[] = [
  { value: '_all', label: 'Todos' },
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'ACCEPTED', label: 'Aceites' },
  { value: 'COMPLETED', label: 'Concluídos' },
  { value: 'REJECTED', label: 'Recusados' },
  { value: 'CANCELLED', label: 'Cancelados' },
]

interface RequestStatusFilterProps {
  basePath: string
}

export function RequestStatusFilter({ basePath }: RequestStatusFilterProps) {
  const searchParams = useSearchParams()
  const current = searchParams.get('status') ?? '_all'

  return (
    <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filtrar por estado">
      {FILTER_OPTIONS.map(({ value, label }) => {
        const href =
          value === '_all' ? basePath : `${basePath}?status=${value}`
        const isActive = current === value

        return (
          <Link
            key={value}
            href={href}
            role="tab"
            aria-selected={isActive}
            className={cn(
              'inline-flex h-7 items-center rounded-lg px-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            )}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
