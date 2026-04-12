import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { ProfilePageClient } from '@/components/profile/profile-page-client'

interface ProfilePageProps {
  params: { id: string }
}

async function fetchUser(id: string) {
  return prisma.user.findUnique({
    where: { id, isActive: true },
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
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const user = await fetchUser(params.id)
  if (!user) return { title: 'Perfil não encontrado — SkoolBay' }

  return {
    title: `${user.name} — SkoolBay`,
    description: user.bio ?? `Perfil de ${user.name} no SkoolBay.`,
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const [user, session] = await Promise.all([fetchUser(params.id), auth()])

  if (!user) notFound()

  const isOwner = session?.user?.id === user.id

  return <ProfilePageClient user={user} isOwner={isOwner} />
}
