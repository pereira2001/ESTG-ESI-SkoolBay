'use client'

import { useTransition } from 'react'
import type { InstitutionalDomain } from '@prisma/client'
import { toggleDomain, deleteDomain } from './actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

export function DomainRow({ domain }: { domain: InstitutionalDomain }) {
  const [pending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(() => toggleDomain(domain.id, !domain.isActive))
  }

  function handleDelete() {
    startTransition(() => deleteDomain(domain.id))
  }

  return (
    <tr className="border-b last:border-0 transition-colors hover:bg-muted/40">
      <td className="py-3 px-4 font-mono text-sm">{domain.domain}</td>
      <td className="py-3 px-4 text-sm text-muted-foreground">{domain.name}</td>
      <td className="py-3 px-4">
        <Badge
          className={cn(
            domain.isActive
              ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
              : 'bg-muted text-muted-foreground border-border',
          )}
        >
          {domain.isActive ? 'Ativo' : 'Inativo'}
        </Badge>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleToggle}
            disabled={pending}
            className={cn(
              'text-xs',
              domain.isActive
                ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                : 'border-border text-muted-foreground hover:bg-muted',
            )}
          >
            {domain.isActive ? 'Desativar' : 'Ativar'}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                disabled={pending}
                className="text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
                aria-label={`Eliminar domínio ${domain.domain}`}
              >
                <TrashIcon />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Eliminar domínio</DialogTitle>
                <DialogDescription>
                  Tens a certeza que queres eliminar{' '}
                  <span className="font-mono font-medium text-foreground">{domain.domain}</span>?
                  Esta ação não pode ser revertida.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button variant="outline" size="sm">
                    Cancelar
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={pending}
                    onClick={handleDelete}
                  >
                    Eliminar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </td>
    </tr>
  )
}
