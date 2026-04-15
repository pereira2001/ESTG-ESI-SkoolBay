'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface ReviewFormProps {
  requestId: string
  onSuccess: () => void
}

export function ReviewForm({ requestId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Seleciona uma classificação de 1 a 5 estrelas.')
      return
    }
    if (comment.trim().length < 10) {
      toast.error('O comentário deve ter pelo menos 10 caracteres.')
      return
    }

    startTransition(async () => {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, rating, comment: comment.trim() }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error ?? 'Erro ao submeter avaliação.')
        return
      }

      toast.success('Avaliação submetida com sucesso!')
      onSuccess()
    })
  }

  const displayRating = hovered || rating

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="space-y-1.5">
        <Label>Classificação</Label>
        <div
          className="flex gap-1"
          onMouseLeave={() => setHovered(0)}
          role="radiogroup"
          aria-label="Classificação de 1 a 5 estrelas"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  star <= displayRating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground/40 hover:text-yellow-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="review-comment">Comentário</Label>
        <Textarea
          id="review-comment"
          placeholder="Descreve a tua experiência (mín. 10 caracteres)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={500}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground text-right">
          {comment.length}/500
        </p>
      </div>

      <Button type="submit" disabled={isPending || rating === 0} className="w-full">
        {isPending ? 'A submeter...' : 'Submeter avaliação'}
      </Button>
    </form>
  )
}
