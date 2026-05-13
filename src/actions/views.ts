'use server'

import { createHash } from 'node:crypto'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function recordServiceView(serviceId: string): Promise<void> {
  try {
    const h = headers()
    const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const userAgent = h.get('user-agent') ?? 'unknown'
    const fingerprint = createHash('sha256').update(`${ip}:${userAgent}`).digest('hex')

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const recent = await prisma.serviceView.findFirst({
      where: { serviceId, fingerprint, viewedAt: { gte: since } },
      select: { id: true },
    })
    if (recent) return

    await prisma.$transaction([
      prisma.serviceView.upsert({
        where: { serviceId_fingerprint: { serviceId, fingerprint } },
        update: { viewedAt: new Date() },
        create: { serviceId, fingerprint },
      }),
      prisma.service.update({
        where: { id: serviceId },
        data: { viewCount: { increment: 1 } },
      }),
    ])
  } catch (error) {
    console.error('[recordServiceView]', error)
  }
}
