import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { createRequestSchema } from '@/lib/validations/request'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = createRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const { serviceId, message } = parsed.data

  const service = await prisma.service.findUnique({
    where: { id: serviceId, isActive: true },
    select: { id: true, userId: true },
  })

  if (!service) {
    return NextResponse.json({ error: 'Serviço não encontrado.' }, { status: 404 })
  }

  if (service.userId === session.user.id) {
    return NextResponse.json(
      { error: 'Não podes pedir o teu próprio serviço.' },
      { status: 400 },
    )
  }

  const existing = await prisma.serviceRequest.findFirst({
    where: { serviceId, buyerId: session.user.id, status: 'PENDING' },
    select: { id: true },
  })

  if (existing) {
    return NextResponse.json(
      { error: 'Já tens um pedido pendente para este serviço.' },
      { status: 409 },
    )
  }

  const request = await prisma.serviceRequest.create({
    data: { serviceId, buyerId: session.user.id, message },
    select: { id: true },
  })

  return NextResponse.json({ id: request.id }, { status: 201 })
}
