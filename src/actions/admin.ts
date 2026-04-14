'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

type ActionResult = { success: true } | { success: false; error: string }

async function assertAdmin(): Promise<string | null> {
  const session = await auth()
  const role = (session?.user as { role?: string } | undefined)?.role
  if (!session?.user?.id || role !== 'ADMIN') return null
  return session.user.id
}

export async function dismissReport(reportId: string): Promise<ActionResult> {
  if (!await assertAdmin()) return { success: false, error: 'Sem permissão.' }

  await prisma.report.update({
    where: { id: reportId },
    data: { status: 'DISMISSED' },
  })
  revalidatePath('/admin/reports')
  return { success: true }
}

export async function resolveReport(reportId: string): Promise<ActionResult> {
  if (!await assertAdmin()) return { success: false, error: 'Sem permissão.' }

  await prisma.report.update({
    where: { id: reportId },
    data: { status: 'RESOLVED' },
  })
  revalidatePath('/admin/reports')
  return { success: true }
}

export async function deactivateService(reportId: string, serviceId: string): Promise<ActionResult> {
  if (!await assertAdmin()) return { success: false, error: 'Sem permissão.' }

  await prisma.$transaction([
    prisma.service.update({ where: { id: serviceId }, data: { isActive: false } }),
    prisma.report.update({ where: { id: reportId }, data: { status: 'RESOLVED' } }),
  ])
  revalidatePath('/admin/reports')
  revalidatePath('/services')
  return { success: true }
}

export async function suspendUser(reportId: string, userId: string): Promise<ActionResult> {
  if (!await assertAdmin()) return { success: false, error: 'Sem permissão.' }

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { isActive: false } }),
    prisma.report.update({ where: { id: reportId }, data: { status: 'RESOLVED' } }),
  ])
  revalidatePath('/admin/reports')
  return { success: true }
}
