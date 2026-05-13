'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Star, Euro } from 'lucide-react'

interface ServiceResult {
  id: string
  title: string
  price: number
  category: { name: string } | null
  user: {
    name: string
    rating: number
    avatarUrl: string | null
  }
}

interface SearchMeta {
  intencao: string
  categoria: string
  keywords: string[]
  termosAdicionais: string[]
}

interface SearchResponse {
  results: ServiceResult[]
  meta: SearchMeta
  total: number
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function ResultCard({ service }: { service: ServiceResult }) {
  return (
    <a href={`/services/${service.id}`} className="group block">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="space-y-2">
          {service.category && (
            <Badge variant="secondary" className="text-xs">
              {service.category.name}
            </Badge>
          )}
          <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {service.title}
          </h3>
          <div className="flex items-center gap-0.5 text-lg font-bold text-primary">
            <Euro className="h-4 w-4" />
            {service.price.toFixed(2)}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="size-6 shrink-0">
                <AvatarImage
                  src={service.user.avatarUrl ?? undefined}
                  alt={service.user.name}
                />
                <AvatarFallback className="text-[10px]">
                  {getInitials(service.user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground truncate">
                {service.user.name.split(' ')[0]}
              </span>
            </div>
            {service.user.rating > 0 && (
              <div className="flex items-center gap-1 text-sm shrink-0">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{service.user.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </a>
  )
}

export function SmartSearch() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchData, setSearchData] = useState<SearchResponse | null>(null)

  async function handleSearch() {
    const trimmed = query.trim()
    if (trimmed.length < 3) {
      toast.error('Escreve pelo menos 3 caracteres para pesquisar')
      return
    }

    setLoading(true)
    setSearchData(null)

    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      })

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(errorData.error ?? `Erro ${response.status}`)
      }

      const data = (await response.json()) as SearchResponse
      setSearchData(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ex: preciso de ajuda com cálculo diferencial..."
          className="text-base"
        />
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="h-4 w-4 mr-1.5" />
          Pesquisar
        </Button>
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2 p-4 border rounded-lg">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      )}

      {searchData && !loading && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="outline" className="text-sm py-1">
              A mostrar resultados para: <span className="font-semibold ml-1">{searchData.meta.intencao}</span>
            </Badge>
            {searchData.meta.categoria && searchData.meta.categoria !== 'outro' && (
              <Badge variant="secondary" className="text-sm py-1">
                {searchData.meta.categoria}
              </Badge>
            )}
          </div>

          {searchData.results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>
                Não encontrámos serviços para &ldquo;{searchData.meta.intencao}&rdquo;.
                Tenta reformular a pesquisa.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {searchData.results.map((service) => (
                <ResultCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
