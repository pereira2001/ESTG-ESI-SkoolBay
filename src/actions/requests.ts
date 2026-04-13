'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import type { RequestStatus } from '@prisma/client'

type ActionResult = { success: true } | { success: false; error: string }

async function transitionRequest(
  requestId: string,
  expectedStatus: RequestStatus,
  newStatus: RequestStatus,
  ownerField: 'provider' | 'buyer',
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Não autenticado.' }
  }

  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      status: true,
      buyerId: true,
      service: { select: { userId: true } },
    },
  })

  if (!request) {
    return { success: false, error: 'Pedido não encontrado.' }
  }

  if (request.status !== expectedStatus) {
    return { success: false, error: 'Transição de estado inválida.' }
  }

  const userId = session.user.id
  if (ownerField === 'provider' && request.service.userId !== userId) {
    return { success: false, error: 'Sem permissão.' }
  }
  if (ownerField === 'buyer' && request.buyerId !== userId) {
    return { success: false, error: 'Sem permissão.' }
  }

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: { status: newStatus },
  })

  revalidatePath('/dashboard/requests')
  revalidatePath('/dashboard/my-requests')

  return { success: true }
}

/** PENDING → ACCEPTED (provider) */
export async function acceptRequest(requestId: string): Promise<ActionResult> {
  return transitionRequest(requestId, 'PENDING', 'ACCEPTED', 'provider')
}

/** PENDING → REJECTED (provider) */
export async function rejectRequest(requestId: string): Promise<ActionResult> {
  return transitionRequest(requestId, 'PENDING', 'REJECTED', 'provider')
}

/** ACCEPTED → COMPLETED (provider) */
export async function completeRequest(requestId: string): Promise<ActionResult> {
  return transitionRequest(requestId, 'ACCEPTED', 'COMPLETED', 'provider')
}

/** PENDING | ACCEPTED → CANCELLED (buyer) */
export async function cancelRequest(requestId: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Não autenticado.' }
  }

  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    select: { id: true, status: true, buyerId: true },
  })

  if (!request) {
    return { success: false, error: 'Pedido não encontrado.' }
  }

  if (request.status !== 'PENDING' && request.status !== 'ACCEPTED') {
    return { success: false, error: 'Este pedido não pode ser cancelado.' }
  }

  if (request.buyerId !== session.user.id) {
    return { success: false, error: 'Sem permissão.' }
  }

  await prisma.serviceRequest.update({
    where: { id: requestId },
    data: { status: 'CANCELLED' },
  })

  revalidatePath('/dashboard/requests')
  revalidatePath('/dashboard/my-requests')

  return { success: true }
}
