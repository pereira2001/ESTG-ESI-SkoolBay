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

  const reports = await prisma.report.findMany({
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
  })

  const currentTab = statusFilter ?? 'ALL'

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Moderação de denúncias</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {reports.length} {reports.length === 1 ? 'denúncia' : 'denúncias'} encontradas
          </p>
        </div>
        <Link href="/admin/domains" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
          Domínios
        </Link>
      </div>

      {/* Status filter tabs */}
      <Suspense fallback={null}>
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_TABS.map((tab) => {
            const href = tab.value === 'ALL' ? '/admin/reports' : `/admin/reports?status=${tab.value}`
            const isActive = currentTab === tab.value
            return (
              <Link
                key={tab.value}
                href={href}
                className={cn(
                  buttonVariants({ variant: isActive ? 'default' : 'outline', size: 'sm' }),
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
      </Suspense>

      {reports.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Sem denúncias com este filtro.
        </p>
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
