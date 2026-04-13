'use client'

import { useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface ServicesFiltersProps {
  categories: Category[]
}

export function ServicesFilters({ categories }: ServicesFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const buildUrl = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      params.delete('page')
      return `/services?${params.toString()}`
    },
    [searchParams],
  )

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = searchInputRef.current?.value ?? ''
    router.push(buildUrl({ q }))
  }

  function handleSelectChange(key: string, value: string | null) {
    const v = value ?? ''
    router.push(buildUrl({ [key]: v === '_all' ? '' : v }))
  }

  function handleMaxPriceBlur(e: React.FocusEvent<HTMLInputElement>) {
    router.push(buildUrl({ maxPrice: e.target.value }))
  }

  return (
    <div className="flex flex-wrap gap-3">
      {/* Pesquisa por texto */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <Input
          ref={searchInputRef}
          name="q"
          placeholder="Pesquisar serviços..."
          defaultValue={searchParams.get('q') ?? ''}
          className="w-56"
          aria-label="Pesquisar serviços"
        />
        <Button type="submit" size="icon" variant="secondary" aria-label="Pesquisar">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* Categoria */}
      <Select
        value={searchParams.get('categoryId') ?? '_all'}
        onValueChange={(v) => handleSelectChange('categoryId', v)}
      >
        <SelectTrigger className="w-44" aria-label="Filtrar por categoria">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_all">Todas as categorias</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Preço máximo */}
      <Input
        type="number"
        min="0"
        step="0.01"
        placeholder="Preço máx. (€)"
        defaultValue={searchParams.get('maxPrice') ?? ''}
        onBlur={handleMaxPriceBlur}
        className="w-36"
        aria-label="Preço máximo"
      />

      {/* Ordenação */}
      <Select
        value={searchParams.get('sort') ?? 'newest'}
        onValueChange={(v) => handleSelectChange('sort', v)}
      >
        <SelectTrigger className="w-44" aria-label="Ordenar por">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Mais recente</SelectItem>
          <SelectItem value="price_asc">Preço ↑</SelectItem>
          <SelectItem value="rating">Melhor avaliado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
