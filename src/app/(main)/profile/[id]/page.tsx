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
          requests: {
            where: { review: { isNot: null } },
            orderBy: { createdAt: 'desc' },
            select: {
              buyer: { select: { name: true, avatarUrl: true } },
              review: { select: { rating: true, comment: true, createdAt: true } },
            },
          },
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
  const isAuthenticated = !!session?.user
  const viewerIsNotOwner = isAuthenticated && !isOwner

  // Flatten reviews across all services, sorted by date desc
  const reviews = user.services
    .flatMap((s) =>
      s.requests.flatMap((r) =>
        r.review
          ? [{ buyer: r.buyer, rating: r.review.rating, comment: r.review.comment, createdAt: r.review.createdAt }]
          : [],
      ),
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  // Strip requests from services before passing to client
  const userForClient = {
    ...user,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    services: user.services.map(({ requests: _requests, ...s }) => s),
  }

  return (
    <ProfilePageClient
      user={userForClient}
      isOwner={isOwner}
      canReport={viewerIsNotOwner}
      reviews={reviews}
      averageRating={averageRating}
    />
  )
}
