'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Sparkles, Loader2 } from 'lucide-react'
import { createServiceSchema, type CreateServiceInput } from '@/lib/validations/service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Category {
  id: string
  name: string
}

interface ServiceFormProps {
  categories: Category[]
  defaultValues?: Partial<CreateServiceInput>
  serviceId?: string
  mode: 'create' | 'edit'
}

interface PricingHint {
  precoSugerido: number
  precoMinimo: number
  precoMaximo: number
  justificacao: string
  fatoresConsiderados: string[]
}

export function ServiceForm({ categories, defaultValues, serviceId, mode }: ServiceFormProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isPricingLoading, setIsPricingLoading] = useState(false)
  const [pricingHint, setPricingHint] = useState<PricingHint | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CreateServiceInput>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      price: defaultValues?.price ?? ('' as unknown as number),
      categoryId: defaultValues?.categoryId ?? '',
      isActive: defaultValues?.isActive ?? true,
    } satisfies CreateServiceInput,
  })

  async function onSubmit(data: CreateServiceInput) {
    const url = mode === 'create' ? '/api/services' : `/api/services/${serviceId}`
    const method = mode === 'create' ? 'POST' : 'PUT'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json() as { id?: string; error?: string }

    if (!res.ok) {
      toast.error(json.error ?? 'Erro ao guardar serviço.')
      return
    }

    const id = mode === 'create' ? json.id! : serviceId!
    toast.success(mode === 'create' ? 'Serviço publicado!' : 'Serviço atualizado!')
    router.push(`/services/${id}`)
    router.refresh()
  }

  async function handleSuggestPrice() {
    const { title, description, categoryId } = getValues()
    if (!title.trim() || !description.trim()) {
      toast.warning('Preenche o título e a descrição primeiro.')
      return
    }

    const categoryName = categories.find((c) => c.id === categoryId)?.name ?? 'outro'

    setIsPricingLoading(true)
    try {
      const res = await fetch('/api/ai/price-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category: categoryName }),
      })

      if (!res.ok) {
        toast.error('Não foi possível sugerir um preço. Tenta novamente.')
        return
      }

      const data = (await res.json()) as PricingHint
      setValue('price', data.precoSugerido)
      setPricingHint(data)
    } catch {
      toast.error('Erro de ligação. Verifica a tua internet.')
    } finally {
      setIsPricingLoading(false)
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Título */}
      <div className="space-y-1">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          placeholder="Ex: Tutoria de Cálculo I"
          {...register('title')}
          aria-invalid={!!errors.title}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      {/* Descrição */}
      <div className="space-y-1">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          rows={5}
          placeholder="Descreve o que inclui o serviço, metodologia, disponibilidade..."
          className="resize-none"
          {...register('description')}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Preço */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="price">Preço (€)</Label>
            <button
              type="button"
              onClick={handleSuggestPrice}
              disabled={isPricingLoading}
              className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPricingLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
              {isPricingLoading ? 'A calcular...' : 'Sugerir preço com IA'}
            </button>
          </div>
          <Input
            id="price"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            {...register('price', { valueAsNumber: true })}
            aria-invalid={!!errors.price}
          />
          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}

          {pricingHint && (
            <div className="rounded-md border border-violet-200 bg-violet-50 p-3 space-y-1 mt-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-violet-700">
                  Sugestão IA: €{pricingHint.precoSugerido.toFixed(2)}
                  <span className="font-normal text-violet-500 ml-1">
                    (€{pricingHint.precoMinimo.toFixed(2)} – €{pricingHint.precoMaximo.toFixed(2)})
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => setPricingHint(null)}
                  className="text-violet-400 hover:text-violet-600 text-xs"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-violet-600">{pricingHint.justificacao}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {pricingHint.fatoresConsiderados.map((f) => (
                  <span key={f} className="text-[10px] bg-violet-100 text-violet-600 rounded px-1.5 py-0.5">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Categoria */}
        <div className="space-y-1">
          <Label htmlFor="categoryId">Categoria</Label>
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <Select value={field.value ?? ''} onValueChange={field.onChange}>
                <SelectTrigger id="categoryId">
                  <SelectValue placeholder="Seleciona uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Disponibilidade */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <p className="text-sm font-medium">Disponível</p>
          <p className="text-xs text-muted-foreground">O serviço aparece nas pesquisas</p>
        </div>
        <Controller
          control={control}
          name="isActive"
          render={({ field }) => (
            <Switch
              checked={field.value ?? true}
              onCheckedChange={field.onChange}
              aria-label="Disponibilidade do serviço"
            />
          )}
        />
      </div>

      {/* Ações */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>

        <div className="flex items-center gap-3">
          {mode === 'edit' && !showDeleteConfirm && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSubmitting || isDeleting}
            >
              Remover serviço
            </Button>
          )}

          {mode === 'edit' && showDeleteConfirm && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-destructive font-medium">Tens a certeza?</span>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'A remover...' : 'Confirmar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Não
              </Button>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? mode === 'create' ? 'A publicar...' : 'A guardar...'
              : mode === 'create' ? 'Publicar serviço' : 'Guardar alterações'}
          </Button>
        </div>
      </div>
    </form>
  )
}
