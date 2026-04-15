import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { GraduationCap, Star } from 'lucide-react'

interface ProfileViewProps {
  user: {
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
  }
  isOwner: boolean
  onEditClick: () => void
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

export function ProfileView({ user, isOwner, onEditClick }: ProfileViewProps) {
  const memberSince = new Intl.DateTimeFormat('pt-PT', { month: 'long', year: 'numeric' }).format(
    new Date(user.createdAt)
  )

  return (
    <div className="space-y-6">
      {/* Header do perfil */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <Avatar className="size-24 shrink-0">
          <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
          <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            {user.rating > 0 && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {user.rating.toFixed(1)}
              </span>
            )}
          </div>

          {(user.university || user.course) && (
            <p className="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4 shrink-0" />
              {[user.course, user.university].filter(Boolean).join(' · ')}
            </p>
          )}

          <p className="text-xs text-muted-foreground">Membro desde {memberSince}</p>

          {isOwner && (
            <button
              onClick={onEditClick}
              className="mt-1 text-sm font-medium underline underline-offset-4 hover:text-foreground text-muted-foreground transition-colors"
            >
              Editar perfil
            </button>
          )}
        </div>
      </div>

      <Separator />

      {/* Bio */}
      <div>
        <h2 className="text-sm font-semibold mb-1">Sobre</h2>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {user.bio ?? 'Sem bio ainda.'}
        </p>
      </div>

      {/* Skills */}
      {user.skills.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-2">Competências</h2>
          <div className="flex flex-wrap gap-1.5">
            {user.skills.map((skill) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
