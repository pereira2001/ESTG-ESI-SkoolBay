import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { ServiceForm } from '@/components/services/service-form'

interface EditServicePageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: EditServicePageProps): Promise<Metadata> {
  const service = await prisma.service.findUnique({
    where: { id: params.id },
    select: { title: true },
  })
  return { title: service ? `Editar "${service.title}" — SkoolBay` : 'Editar serviço — SkoolBay' }
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const session = await auth()
  if (!session) redirect(`/login?callbackUrl=/services/${params.id}/edit`)

  const [service, categories] = await Promise.all([
    prisma.service.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        isActive: true,
        userId: true,
        categoryId: true,
      },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ])

  if (!service) notFound()
  if (service.userId !== session.user.id) redirect(`/services/${params.id}`)

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Editar serviço</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Atualiza os detalhes do teu serviço.
        </p>
      </div>
      <ServiceForm
        categories={categories}
        mode="edit"
        serviceId={service.id}
        defaultValues={{
          title: service.title,
          description: service.description,
          price: service.price,
          categoryId: service.categoryId ?? '',
          isActive: service.isActive,
        }}
      />
    </div>
  )
}
