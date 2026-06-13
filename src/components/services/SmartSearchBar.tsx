'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export interface AiService {
  id: string
  title: string
  price: number
  category: { name: string } | null
  user: {
    id: string
    name: string
    avatarUrl: string | null
    rating: number
  }
}

interface AiSearchResponse {
  results: AiService[]
  meta: { intencao: string; categoria: string; keywords: string[]; termosAdicionais: string[] }
  total: number
}

interface SmartSearchBarProps {
  // Recebida para manter a assinatura usada por ServicesPageClient; não usada internamente.
  categories: { id: string; name: string }[]
  onAiResults: (results: AiService[] | null, intencao: string | null) => void
}

export function SmartSearchBar({ onAiResults }: SmartSearchBarProps) {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!inputValue.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: inputValue }),
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      const data = (await res.json()) as AiSearchResponse
      onAiResults(data.results, data.meta.intencao)
    } catch {
      toast.error('Erro na pesquisa IA. Tenta novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <div className="relative flex-1 max-w-xl">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ex: preciso de ajuda com cálculo diferencial..."
          className="border-[#B8B3EC] focus-visible:ring-[#7F77DD]"
          aria-label="Pesquisa por linguagem natural com IA"
        />
      </div>

      <Button
        type="submit"
        size="icon"
        variant="secondary"
        disabled={isLoading}
        aria-label="Pesquisar com IA"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4 text-[#7F77DD]" />
        )}
      </Button>
    </form>
  )
}
