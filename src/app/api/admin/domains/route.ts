import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createDomainSchema = z.object({
  domain: z
    .string()
    .min(3)
    .regex(/^[a-z0-9.-]+\.[a-z]{2,}$/, 'Domínio inválido (ex: estudantes.piaget.pt)'),
  name: z.string().min(2, 'Nome da instituição obrigatório'),
})

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'ADMIN') return null
  return session
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const domains = await prisma.institutionalDomain.findMany({
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(domains)
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = createDomainSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { domain, name } = parsed.data

  const existing = await prisma.institutionalDomain.findUnique({ where: { domain } })
  if (existing) {
    return NextResponse.json({ error: 'Este domínio já existe.' }, { status: 409 })
  }

  const created = await prisma.institutionalDomain.create({ data: { domain, name } })
  return NextResponse.json(created, { status: 201 })
}
