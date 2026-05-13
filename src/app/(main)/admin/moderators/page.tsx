import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ModeratorRow } from './moderator-row'
import { AddModeratorForm } from './add-moderator-form'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Moderadores — SkoolBay Admin',
}

export default async function AdminModeratorsPage() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'ADMIN') redirect('/login')

  const moderators = await prisma.user.findMany({
    where: { role: 'MODERATOR' },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, email: true, isActive: true, createdAt: true },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Moderadores</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie os utilizadores com permissões de moderação
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
              <th className="text-left py-2 px-4 text-sm font-medium text-muted-foreground">Nome</th>
              <th className="text-left py-2 px-4 text-sm font-medium text-muted-foreground">Email</th>
              <th className="text-left py-2 px-4 text-sm font-medium text-muted-foreground">Adicionado em</th>
              <th className="text-left py-2 px-4 text-sm font-medium text-muted-foreground">Estado</th>
              <th className="text-right py-2 px-4 text-sm font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {moderators.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
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
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">Sem moderadores</p>
                    <p className="text-xs text-muted-foreground">Adiciona o primeiro moderador abaixo.</p>
                  </div>
                </td>
              </tr>
            ) : (
              moderators.map((m) => <ModeratorRow key={m.id} user={m} />)
            )}
          </tbody>
        </table>
      </div>

      <AddModeratorForm />
    </div>
  )
}
