import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DomainRow } from './domain-row'
import { addDomain } from './actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Domínios Institucionais — SkoolBay Admin',
}

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

export default async function AdminDomainsPage() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'ADMIN') redirect('/login')

  const domains = await prisma.institutionalDomain.findMany({ orderBy: { name: 'asc' } })

  const total = domains.length
  const active = domains.filter((d) => d.isActive).length
  const inactive = total - active

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Domínios Institucionais</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {total} {total === 1 ? 'domínio registado' : 'domínios registados'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/reports"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            Moderação
          </Link>
          <a
            href="#add-domain"
            className={cn(buttonVariants({ size: 'sm' }), 'gap-2')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Adicionar Domínio
          </a>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <MetricCard label="Total" value={total} />
        <MetricCard label="Ativos" value={active} accent />
        <MetricCard label="Inativos" value={inactive} />
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden mb-8">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/60 border-b">
              <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Domínio</th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Instituição</th>
              <th className="text-left py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Estado</th>
              <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Ações</th>
            </tr>
          </thead>
          <tbody>
            {domains.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-full bg-muted p-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">Sem domínios registados</p>
                    <p className="text-xs text-muted-foreground">Adiciona o primeiro domínio institucional abaixo.</p>
                  </div>
                </td>
              </tr>
            ) : (
              domains.map((d) => <DomainRow key={d.id} domain={d} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Add domain form */}
      <div id="add-domain" className="rounded-xl border p-6">
        <h2 className="text-base font-semibold mb-1">Adicionar domínio</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Apenas utilizadores com email neste domínio poderão registar-se.
        </p>
        <form action={addDomain} className="flex flex-col sm:flex-row gap-3">
          <input
            name="domain"
            placeholder="estudantes.exemplo.pt"
            required
            className="flex-1 h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <input
            name="name"
            placeholder="Nome da instituição"
            required
            className="flex-1 h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
          />
          <Button type="submit" size="sm">
            Adicionar
          </Button>
        </form>
      </div>
    </div>
  )
}
