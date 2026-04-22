import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { ReportCard } from '@/components/admin/report-card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ReportStatus } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Moderação — SkoolBay Admin',
}

const VALID_STATUSES = new Set<ReportStatus>(['PENDING', 'RESOLVED', 'DISMISSED'])

const STATUS_TABS: { value: ReportStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todas' },
  { value: 'PENDING', label: 'Pendentes' },
  { value: 'RESOLVED', label: 'Resolvidas' },
  { value: 'DISMISSED', label: 'Descartadas' },
]

interface MetricCardProps {
  label: string
  value: number
  accent?: boolean
}

function MetricCard({ label, value, accent }: MetricCardProps) {
  return (
    <div className={cn(
      'rounded-xl border bg-card px-5 py-4',
      accent && 'border-[#5B4FD4]/30 bg-[#5B4FD4]/5',
    )}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className={cn('mt-1 text-3xl font-bold', accent && 'text-[#5B4FD4]')}>{value}</p>
    </div>
  )
}

interface PageProps {
  searchParams: { status?: string }
}

export default async function AdminReportsPage({ searchParams }: PageProps) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'ADMIN') redirect('/login')

  const rawStatus = searchParams.status
  const statusFilter =
    rawStatus && VALID_STATUSES.has(rawStatus as ReportStatus)
      ? (rawStatus as ReportStatus)
      : undefined

  const [reports, counts] = await Promise.all([
    prisma.report.findMany({
      where: { ...(statusFilter && { status: statusFilter }) },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        reason: true,
        description: true,
        status: true,
        targetType: true,
        targetId: true,
        createdAt: true,
        reporter: { select: { name: true, email: true } },
      },
    }),
    prisma.report.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
  ])

  const total = counts.reduce((acc, c) => acc + c._count.id, 0)
  const pending = counts.find((c) => c.status === 'PENDING')?._count.id ?? 0
  const resolved = counts.find((c) => c.status === 'RESOLVED')?._count.id ?? 0
  const dismissed = counts.find((c) => c.status === 'DISMISSED')?._count.id ?? 0

  const currentTab = statusFilter ?? 'ALL'

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Moderação de Denúncias</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie e acompanhe todas as denúncias submetidas
          </p>
        </div>
        <div className="flex items-center gap-2">
        <Link
          href="/admin/moderators"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-2')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Moderadores
        </Link>
        <Link
          href="/admin/domains"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-2')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          Domínios
        </Link>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total" value={total} />
        <MetricCard label="Pendentes" value={pending} accent />
        <MetricCard label="Resolvidas" value={resolved} />
        <MetricCard label="Descartadas" value={dismissed} />
      </div>

      {/* Pill tabs */}
      <Suspense fallback={null}>
        <div className="bg-muted rounded-lg p-1 flex flex-wrap gap-1 mb-6 w-fit">
          {STATUS_TABS.map((tab) => {
            const href = tab.value === 'ALL' ? '/admin/reports' : `/admin/reports?status=${tab.value}`
            const isActive = currentTab === tab.value
            return (
              <Link
                key={tab.value}
                href={href}
                className={cn(
                  'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                  isActive
                    ? 'bg-white text-foreground shadow-sm border border-border'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
      </Suspense>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
          </div>
          <h3 className="text-base font-semibold">Sem denúncias</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-xs">
            Não existem denúncias com o filtro selecionado. Tente outro estado ou aguarde novas submissões.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  )
}
