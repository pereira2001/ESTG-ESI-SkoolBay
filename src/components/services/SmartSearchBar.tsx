'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Sparkles, Loader2 } from 'lucide-react'
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
  categories: { id: string; name: string }[]
  onAiResults: (results: AiService[] | null, intencao: string | null) => void
}

export function SmartSearchBar({ onAiResults }: SmartSearchBarProps) {
  const router = useRouter()
  const [inputValue, setInputValue] = useState('')
  const [isAiMode, setIsAiMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!inputValue.trim()) return

    if (!isAiMode) {
      router.push(`/services?q=${encodeURIComponent(inputValue.trim())}`)
      return
    }

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

  function toggleAiMode() {
    const next = !isAiMode
    setIsAiMode(next)
    if (!next) {
      onAiResults(null, null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <div className="relative flex-1 max-w-xl">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            isAiMode
              ? 'Ex: preciso de ajuda com cálculo diferencial...'
              : 'Pesquisar serviços...'
          }
          className="pr-10"
          aria-label={isAiMode ? 'Pesquisa por linguagem natural' : 'Pesquisar serviços'}
        />
        <button
          type="button"
          onClick={toggleAiMode}
          title="Pesquisa IA"
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded transition-colors ${
            isAiMode
              ? 'bg-purple-100 text-purple-700'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sparkles className="h-4 w-4" />
        </button>
      </div>

      <Button
        type="submit"
        size="icon"
        variant="secondary"
        disabled={isLoading}
        aria-label="Pesquisar"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isAiMode ? (
          <Sparkles className="h-4 w-4 text-purple-700" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </Button>
    </form>
  )
}
