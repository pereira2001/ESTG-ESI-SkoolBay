'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Pencil, Trash2, ShoppingBag } from 'lucide-react'

interface ServiceActionsProps {
  serviceId: string
  isOwner: boolean
  isAuthenticated: boolean
}

export function ServiceActions({ serviceId, isOwner, isAuthenticated }: ServiceActionsProps) {
  const router = useRouter()
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleRequest() {
    if (message.trim().length < 10) {
      toast.error('A mensagem deve ter pelo menos 10 caracteres.')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, message }),
      })
      const json = await res.json() as { error?: string }

      if (!res.ok) {
        toast.error(json.error ?? 'Erro ao enviar pedido.')
        return
      }

      toast.success('Pedido enviado com sucesso!')
      setShowRequestForm(false)
      setMessage('')
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/services/${serviceId}`, { method: 'DELETE' })
      const json = await res.json() as { error?: string }

      if (!res.ok) {
        toast.error(json.error ?? 'Erro ao remover serviço.')
        return
      }

      toast.success('Serviço removido.')
      router.push('/dashboard')
      router.refresh()
    } finally {
      setIsDeleting(false)
    }
  }

  if (isOwner) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Link
            href={`/services/${serviceId}/edit`}
            className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Link>

          {!showDeleteConfirm ? (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Remover
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-destructive font-medium">Tens a certeza?</span>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                size="sm"
              >
                {isDeleting ? 'A remover...' : 'Confirmar'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                size="sm"
              >
                Não
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(`/services/${serviceId}`)}`}
        className={cn(buttonVariants({ size: 'lg' }), 'gap-2 w-full sm:w-auto')}
      >
        <ShoppingBag className="h-4 w-4" />
        Pedir Serviço
      </Link>
    )
  }

  return (
    <div className="space-y-3">
      {!showRequestForm ? (
        <Button
          size="lg"
          onClick={() => setShowRequestForm(true)}
          className="gap-2 w-full sm:w-auto"
        >
          <ShoppingBag className="h-4 w-4" />
          Pedir Serviço
        </Button>
      ) : (
        <div className="rounded-lg border p-4 space-y-3 bg-muted/30">
          <h3 className="text-sm font-semibold">Enviar pedido</h3>
          <div className="space-y-1">
            <Label htmlFor="request-message">Mensagem para o prestador</Label>
            <Textarea
              id="request-message"
              rows={4}
              placeholder="Descreve o que precisas, quando, ou qualquer detalhe relevante..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">Mínimo 10 caracteres.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleRequest} disabled={isSubmitting} size="sm">
              {isSubmitting ? 'A enviar...' : 'Enviar pedido'}
            </Button>
            <Button
              variant="outline"
              onClick={() => { setShowRequestForm(false); setMessage('') }}
              disabled={isSubmitting}
              size="sm"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
