import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const bodySchema = z.object({
  targetType: z.enum(['SERVICE', 'USER']),
  targetId: z.string().cuid(),
  reason: z.enum(['INAPPROPRIATE', 'SPAM', 'FRAUD', 'OTHER']),
  description: z.string().min(20).max(1000),
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

  const { targetType, targetId, reason, description } = parsed.data
  const reporterId = session.user.id

  // Prevent self-reporting
  if (targetType === 'USER' && targetId === reporterId) {
    return NextResponse.json({ error: 'Não podes denunciar o teu próprio perfil.' }, { status: 400 })
  }

  if (targetType === 'SERVICE') {
    const service = await prisma.service.findUnique({
      where: { id: targetId },
      select: { userId: true },
    })
    if (!service) {
      return NextResponse.json({ error: 'Serviço não encontrado.' }, { status: 404 })
    }
    if (service.userId === reporterId) {
      return NextResponse.json({ error: 'Não podes denunciar o teu próprio serviço.' }, { status: 400 })
    }
  } else {
    const user = await prisma.user.findUnique({ where: { id: targetId }, select: { id: true } })
    if (!user) {
      return NextResponse.json({ error: 'Utilizador não encontrado.' }, { status: 404 })
    }
  }

  await prisma.report.create({
    data: {
      reporterId,
      targetType,
      targetId,
      reason,
      description,
      status: 'PENDING',
    },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
