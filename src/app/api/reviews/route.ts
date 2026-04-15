import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const bodySchema = z.object({
  requestId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(500),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos.', issues: parsed.error.flatten() }, { status: 400 })
  }

  const { requestId, rating, comment } = parsed.data

  // Verify the request belongs to this buyer and is COMPLETED
  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      status: true,
      buyerId: true,
      service: { select: { userId: true } },
      review: { select: { id: true } },
    },
  })

  if (!request) {
    return NextResponse.json({ error: 'Pedido não encontrado.' }, { status: 404 })
  }

  if (request.buyerId !== session.user.id) {
    return NextResponse.json({ error: 'Sem permissão.' }, { status: 403 })
  }

  if (request.status !== 'COMPLETED') {
    return NextResponse.json({ error: 'Só é possível avaliar pedidos concluídos.' }, { status: 400 })
  }

  if (request.review) {
    return NextResponse.json({ error: 'Este pedido já foi avaliado.' }, { status: 409 })
  }

  // Create review
  await prisma.review.create({
    data: { requestId, rating, comment },
  })

  // Recalculate provider average rating
  const providerId = request.service.userId
  const reviews = await prisma.review.findMany({
    where: { request: { service: { userId: providerId } } },
    select: { rating: true },
  })

  const avg = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  await prisma.user.update({
    where: { id: providerId },
    data: { rating: parseFloat(avg.toFixed(2)) },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
