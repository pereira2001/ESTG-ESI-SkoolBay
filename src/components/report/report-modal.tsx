'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const REASONS = [
  { value: 'INAPPROPRIATE', label: 'Conteúdo inapropriado' },
  { value: 'SPAM', label: 'Spam' },
  { value: 'FRAUD', label: 'Fraude' },
  { value: 'OTHER', label: 'Outro' },
] as const

type ReasonValue = typeof REASONS[number]['value']

interface ReportModalProps {
  targetType: 'SERVICE' | 'USER'
  targetId: string
}

export function ReportModal({ targetType, targetId }: ReportModalProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<ReasonValue | ''>('')
  const [description, setDescription] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleOpenChange(next: boolean) {
    if (!next) {
      setReason('')
      setDescription('')
    }
    setOpen(next)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!reason) {
      toast.error('Seleciona um tipo de denúncia.')
      return
    }
    if (description.trim().length < 20) {
      toast.error('A descrição deve ter pelo menos 20 caracteres.')
      return
    }

    startTransition(async () => {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType, targetId, reason, description: description.trim() }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error ?? 'Erro ao submeter denúncia.')
        return
      }

      toast.success('Denúncia submetida. Obrigado pelo feedback.')
      handleOpenChange(false)
    })
  }

  const targetLabel = targetType === 'SERVICE' ? 'serviço' : 'utilizador'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-destructive">
          <Flag className="h-3.5 w-3.5" />
          Denunciar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Denunciar {targetLabel}</DialogTitle>
          <DialogDescription>
            A tua denúncia será analisada pela equipa de moderação.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="report-reason">Tipo de denúncia</Label>
            <Select
              value={reason}
              onValueChange={(v) => setReason(v as ReasonValue)}
              items={REASONS}
            >
              <SelectTrigger id="report-reason">
                <SelectValue placeholder="Seleciona o motivo..." />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="report-description">Descrição</Label>
            <Textarea
              id="report-description"
              placeholder="Descreve o problema (mín. 20 caracteres)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={1000}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.length}/1000
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="destructive" disabled={isPending || !reason}>
              {isPending ? 'A enviar...' : 'Denunciar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
