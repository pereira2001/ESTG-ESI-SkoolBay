import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { updateServiceSchema } from '@/lib/validations/service'

interface RouteContext {
  params: { id: string }
}

async function requireOwnership(serviceId: string, userId: string) {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { id: true, userId: true },
  })
  if (!service) return { error: 'Serviço não encontrado.', status: 404 } as const
  if (service.userId !== userId) return { error: 'Sem permissão.', status: 403 } as const
  return { service }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const check = await requireOwnership(params.id, session.user.id)
  if ('error' in check) {
    return NextResponse.json({ error: check.error }, { status: check.status })
  }

  const body = await req.json()
  const parsed = updateServiceSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { categoryId, ...rest } = parsed.data

  const updated = await prisma.service.update({
    where: { id: params.id },
    data: {
      ...rest,
      categoryId: categoryId === '' ? null : (categoryId ?? undefined),
    },
    select: { id: true },
  })

  return NextResponse.json({ id: updated.id })
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const check = await requireOwnership(params.id, session.user.id)
  if ('error' in check) {
    return NextResponse.json({ error: check.error }, { status: check.status })
  }

  await prisma.service.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}
