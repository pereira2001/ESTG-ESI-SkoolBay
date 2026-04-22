'use client'

import { useTransition } from 'react'
import type { InstitutionalDomain } from '@prisma/client'
import { toggleDomain, deleteDomain } from './actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function DomainRow({ domain }: { domain: InstitutionalDomain }) {
  const [pending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(() => toggleDomain(domain.id, !domain.isActive))
  }

  function handleDelete() {
    if (!confirm(`Eliminar domínio "${domain.domain}"?`)) return
    startTransition(() => deleteDomain(domain.id))
  }

  return (
    <tr className="border-b last:border-0">
      <td className="py-3 pr-4 font-mono text-sm">{domain.domain}</td>
      <td className="py-3 pr-4 text-sm text-muted-foreground">{domain.name}</td>
      <td className="py-3 pr-4">
        <Badge variant={domain.isActive ? 'default' : 'secondary'}>
          {domain.isActive ? 'Ativo' : 'Inativo'}
        </Badge>
      </td>
      <td className="py-3 text-right space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleToggle}
          disabled={pending}
        >
          {domain.isActive ? 'Desativar' : 'Ativar'}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleDelete}
          disabled={pending}
        >
          Eliminar
        </Button>
      </td>
    </tr>
  )
}
