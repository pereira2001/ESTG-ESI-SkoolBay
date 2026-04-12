'use client'

import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { ProfileView } from './profile-view'
import { EditProfileForm } from './edit-profile-form'
import { ServiceList } from './service-list'

interface ProfileUser {
  id: string
  name: string
  email: string
  university: string | null
  course: string | null
  bio: string | null
  avatarUrl: string | null
  skills: string[]
  rating: number
  createdAt: Date
  services: {
    id: string
    title: string
    description: string
    price: number
    createdAt: Date
    category: { name: string; slug: string } | null
  }[]
}

interface ProfilePageClientProps {
  user: ProfileUser
  isOwner: boolean
}

export function ProfilePageClient({ user: initialUser, isOwner }: ProfilePageClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState(initialUser)

  function handleSaved(updated: Partial<typeof user>) {
    setUser((prev) => ({ ...prev, ...updated }))
    // If it's an avatar update, don't close the form
    if (!('avatarUrl' in updated && Object.keys(updated).length === 1)) {
      setIsEditing(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {isEditing ? (
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">Editar perfil</h1>
          <Separator />
          <div className="pt-4">
            <EditProfileForm
              user={user}
              onCancel={() => setIsEditing(false)}
              onSaved={handleSaved}
            />
          </div>
        </div>
      ) : (
        <ProfileView user={user} isOwner={isOwner} onEditClick={() => setIsEditing(true)} />
      )}

      <Separator />

      <ServiceList services={user.services} isOwner={isOwner} />
    </div>
  )
}
