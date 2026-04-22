'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'ADMIN') redirect('/login')
}

export async function toggleDomain(id: string, isActive: boolean) {
  await requireAdmin()
  await prisma.institutionalDomain.update({ where: { id }, data: { isActive } })
  revalidatePath('/admin/domains')
}

export async function addDomain(formData: FormData) {
  await requireAdmin()

  const domain = (formData.get('domain') as string | null)?.trim().toLowerCase()
  const name = (formData.get('name') as string | null)?.trim()

  if (!domain || !name || domain.length < 3 || name.length < 2) return

  const exists = await prisma.institutionalDomain.findUnique({ where: { domain } })
  if (exists) return

  await prisma.institutionalDomain.create({ data: { domain, name } })
  revalidatePath('/admin/domains')
}

export async function deleteDomain(id: string) {
  await requireAdmin()
  await prisma.institutionalDomain.delete({ where: { id } })
  revalidatePath('/admin/domains')
}
