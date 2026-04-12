'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { updateProfileSchema, type UpdateProfileInput } from '@/lib/validations/profile'

type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string }

export async function updateProfile(input: UpdateProfileInput): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Não autenticado.' }
  }

  const parsed = updateProfileSchema.safeParse(input)
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
    return { success: false, error: firstError ?? 'Dados inválidos.' }
  }

  const { name, bio, course, skills } = parsed.data

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      bio: bio || null,
      course: course || null,
      skills,
    },
  })

  return { success: true }
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId, isActive: true },
    select: {
      id: true,
      name: true,
      email: true,
      university: true,
      course: true,
      bio: true,
      avatarUrl: true,
      skills: true,
      rating: true,
      createdAt: true,
      services: {
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          createdAt: true,
          category: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  return user
}
