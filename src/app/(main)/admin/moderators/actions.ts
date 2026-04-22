'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export type ActionState = { success: boolean; error?: string } | null

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'ADMIN') redirect('/login')
}

export async function addModerator(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin()

  const email = (formData.get('email') as string | null)?.trim().toLowerCase()
  if (!email || !email.includes('@')) {
    return { success: false, error: 'Email inválido.' }
  }

  const domain = email.split('@')[1]
  const allowed = await prisma.institutionalDomain.findFirst({
    where: {
      isActive: true,
      OR: [{ domain }, { domain: { endsWith: `.${domain}` } }],
    },
  })
  if (!allowed) {
    return { success: false, error: 'O domínio deste email não está registado como domínio institucional.' }
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return { success: false, error: 'Nenhum utilizador encontrado com este email.' }
  }
  if (!user.isActive) {
    return { success: false, error: 'Este utilizador está suspenso e não pode ser moderador.' }
  }
  if (user.role === 'ADMIN') {
    return { success: false, error: 'Administradores não podem ser promovidos a moderador.' }
  }
  if (user.role === 'MODERATOR') {
    return { success: false, error: 'Este utilizador já é moderador.' }
  }

  await prisma.user.update({ where: { email }, data: { role: 'MODERATOR' } })
  revalidatePath('/admin/moderators')
  return { success: true }
}

export async function removeModerator(userId: string): Promise<ActionState> {
  await requireAdmin()

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || user.role === 'ADMIN') {
    return { success: false, error: 'Operação inválida.' }
  }

  await prisma.user.update({ where: { id: userId }, data: { role: 'USER' } })
  revalidatePath('/admin/moderators')
  return { success: true }
}
