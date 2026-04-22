'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'ADMIN') redirect('/login')
}

export async function addModerator(formData: FormData) {
  await requireAdmin()

  const email = (formData.get('email') as string | null)?.trim().toLowerCase()
  if (!email || !email.includes('@')) return

  const domain = email.split('@')[1]
  const allowed = await prisma.institutionalDomain.findFirst({
    where: { isActive: true, OR: [{ domain }, { domain: { endsWith: `.${domain}` } }] },
  })
  if (!allowed) return

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.isActive || user.role === 'ADMIN') return

  await prisma.user.update({ where: { email }, data: { role: 'MODERATOR' } })
  revalidatePath('/admin/moderators')
}

export async function removeModerator(userId: string) {
  await requireAdmin()

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || user.role === 'ADMIN') return

  await prisma.user.update({ where: { id: userId }, data: { role: 'USER' } })
  revalidatePath('/admin/moderators')
}
