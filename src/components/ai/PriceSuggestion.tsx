'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Euro, Sparkles } from 'lucide-react'

interface PriceSuggestionResult {
  precoSugerido: number
  precoMinimo: number
  precoMaximo: number
  justificacao: string
  fatoresConsiderados: string[]
}

interface PriceSuggestionProps {
  category: string
}

export function PriceSuggestion({ category }: PriceSuggestionProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [durationHours, setDurationHours] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PriceSuggestionResult | null>(null)

  async function handleSubmit() {
    if (!title.trim() || !description.trim()) {
      toast.error('Preenche o título e a descrição do serviço')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const body: {
        title: string
        description: string
        category: string
        durationHours?: number
      } = { title, description, category }

      const parsed = parseFloat(durationHours)
      if (!isNaN(parsed) && parsed > 0) {
        body.durationHours = parsed
      }

      const response = await fetch('/api/ai/price-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(errorData.error ?? `Erro ${response.status}`)
      }

      const data = (await response.json()) as PriceSuggestionResult
      setResult(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          Sugestão de Preço IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="ai-title">Título do serviço</Label>
          <Input
            id="ai-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Explicações de Cálculo para 1º ano"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ai-description">Descrição do serviço</Label>
          <Textarea
            id="ai-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreve o teu serviço em detalhe..."
            rows={3}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ai-duration">Duração estimada (horas, opcional)</Label>
          <Input
            id="ai-duration"
            type="number"
            min="0.5"
            step="0.5"
            value={durationHours}
            onChange={(e) => setDurationHours(e.target.value)}
            placeholder="Ex: 1.5"
          />
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? 'A calcular...' : 'Calcular Preço'}
        </Button>

        {loading && (
          <div className="space-y-2 pt-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}

        {result && !loading && (
          <div className="space-y-3 pt-2 border-t">
            <div className="flex items-center gap-1.5 text-3xl font-bold text-green-600">
              <Euro className="h-6 w-6" />
              {result.precoSugerido.toFixed(2)}
            </div>

            <p className="text-sm text-muted-foreground">
              Intervalo sugerido:{' '}
              <span className="font-medium text-foreground">
                €{result.precoMinimo.toFixed(2)} – €{result.precoMaximo.toFixed(2)}
              </span>
            </p>

            <p className="text-sm">{result.justificacao}</p>

            {result.fatoresConsiderados.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {result.fatoresConsiderados.map((fator) => (
                  <Badge key={fator} variant="secondary" className="text-xs">
                    {fator}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
