import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const patchSchema = z.object({
  isActive: z.boolean(),
})

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'ADMIN') return null
  return session
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = patchSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const domain = await prisma.institutionalDomain.findUnique({ where: { id: params.id } })
  if (!domain) {
    return NextResponse.json({ error: 'Domínio não encontrado.' }, { status: 404 })
  }

  const updated = await prisma.institutionalDomain.update({
    where: { id: params.id },
    data: { isActive: parsed.data.isActive },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const domain = await prisma.institutionalDomain.findUnique({ where: { id: params.id } })
  if (!domain) {
    return NextResponse.json({ error: 'Domínio não encontrado.' }, { status: 404 })
  }

  await prisma.institutionalDomain.delete({ where: { id: params.id } })
  return new NextResponse(null, { status: 204 })
}
