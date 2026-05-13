import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { ServiceForm } from '@/components/services/service-form'

export const metadata: Metadata = { title: 'Publicar serviço — SkoolBay' }

export default async function NewServicePage() {
  const session = await auth()
  if (!session) redirect('/login?callbackUrl=/services/new')

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Publicar serviço</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Descreve o que ofereces para outros estudantes encontrarem.
        </p>
      </div>
      <ServiceForm categories={categories} mode="create" />
    </div>
  )
}
