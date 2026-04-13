import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { createServiceSchema } from '@/lib/validations/service'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = createServiceSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { title, description, price, categoryId, isActive } = parsed.data

  const service = await prisma.service.create({
    data: {
      title,
      description,
      price,
      isActive,
      userId: session.user.id,
      categoryId: categoryId || null,
    },
    select: { id: true },
  })

  return NextResponse.json({ id: service.id }, { status: 201 })
}
