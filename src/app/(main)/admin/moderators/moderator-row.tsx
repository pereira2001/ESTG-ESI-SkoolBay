'use client'

import { useTransition } from 'react'
import { removeModerator } from './actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ModeratorRowProps {
  user: {
    id: string
    name: string
    email: string
    isActive: boolean
    createdAt: Date
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date))
}

export function ModeratorRow({ user }: ModeratorRowProps) {
  const [pending, startTransition] = useTransition()

  function handleRemove() {
    if (!confirm(`Remover "${user.name}" como moderador? O utilizador voltará ao papel de utilizador comum.`)) return
    startTransition(() => removeModerator(user.id))
  }

  return (
    <tr className="border-b last:border-0">
      <td className="py-3 pr-4 text-sm font-medium">{user.name}</td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{user.email}</td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{formatDate(user.createdAt)}</td>
      <td className="py-3 pr-4">
        <Badge variant={user.isActive ? 'default' : 'secondary'}>
          {user.isActive ? 'Ativo' : 'Inativo'}
        </Badge>
      </td>
      <td className="py-3 text-right">
        <Button size="sm" variant="destructive" onClick={handleRemove} disabled={pending}>
          Remover
        </Button>
      </td>
    </tr>
  )
}
