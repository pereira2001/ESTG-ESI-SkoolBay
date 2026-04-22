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

export default async function AdminDomainsPage() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'ADMIN') redirect('/login')

  const domains = await prisma.institutionalDomain.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Domínios Institucionais</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {domains.length} {domains.length === 1 ? 'domínio' : 'domínios'} registados
          </p>
        </div>
        <Link href="/admin/reports" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
          Moderação
        </Link>
      </div>

      <div className="rounded-lg border overflow-hidden mb-8">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left py-2 px-4 text-sm font-medium text-muted-foreground">Domínio</th>
              <th className="text-left py-2 px-4 text-sm font-medium text-muted-foreground">Instituição</th>
              <th className="text-left py-2 px-4 text-sm font-medium text-muted-foreground">Estado</th>
              <th className="text-right py-2 px-4 text-sm font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y px-4">
            {domains.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                  Sem domínios registados.
                </td>
              </tr>
            ) : (
              domains.map((d) => <DomainRow key={d.id} domain={d} />)
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Adicionar domínio</h2>
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
