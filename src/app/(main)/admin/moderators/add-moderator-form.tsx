'use client'

import { useActionState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { addModerator } from './actions'

export function AddModeratorForm() {
  const [state, formAction, isPending] = useActionState(addModerator, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success('Moderador adicionado com sucesso.')
      formRef.current?.reset()
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-lg font-semibold mb-1">Adicionar moderador</h2>
      <p className="text-sm text-muted-foreground mb-4">
        O utilizador tem de ter conta ativa e email institucional registado.
      </p>
      <form ref={formRef} action={formAction} className="flex flex-col sm:flex-row gap-3">
        <input
          name="email"
          type="email"
          placeholder="utilizador@universidade.pt"
          required
          disabled={isPending}
          className="flex-1 h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-60"
        />
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? 'A adicionar…' : 'Adicionar'}
        </Button>
      </form>
      {state && !state.success && state.error && (
        <p className="mt-2 text-xs text-destructive">{state.error}</p>
      )}
    </div>
  )
}
