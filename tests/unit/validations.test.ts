import { describe, it, expect } from 'vitest'
import { createServiceSchema } from '@/lib/validations/service'
import { createReviewSchema } from '@/lib/validations/review'
import { createRequestSchema } from '@/lib/validations/request'

// ---------------------------------------------------------------------------
// createServiceSchema
// ---------------------------------------------------------------------------
describe('createServiceSchema', () => {
  const validService = {
    title: 'Explicações de Python',
    description: 'Aulas de programação em Python para iniciantes e intermédios.',
    price: 15,
    isActive: true,
  }

  it('aceita serviço válido', () => {
    expect(createServiceSchema.safeParse(validService).success).toBe(true)
  })

  it('aceita serviço válido sem categoryId', () => {
    expect(createServiceSchema.safeParse({ ...validService, categoryId: '' }).success).toBe(true)
  })

  it('rejeita título com menos de 5 caracteres', () => {
    const result = createServiceSchema.safeParse({ ...validService, title: 'Py' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/5/)
  })

  it('rejeita título vazio', () => {
    const result = createServiceSchema.safeParse({ ...validService, title: '' })
    expect(result.success).toBe(false)
  })

  it('rejeita descrição com menos de 20 caracteres', () => {
    const result = createServiceSchema.safeParse({ ...validService, description: 'Curta demais' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/20/)
  })

  it('rejeita preço negativo', () => {
    const result = createServiceSchema.safeParse({ ...validService, price: -5 })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/[Pp]reço/)
  })

  it('rejeita preço zero', () => {
    const result = createServiceSchema.safeParse({ ...validService, price: 0 })
    expect(result.success).toBe(false)
  })

  it('aceita preço decimal positivo', () => {
    expect(createServiceSchema.safeParse({ ...validService, price: 9.99 }).success).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// createReviewSchema
// ---------------------------------------------------------------------------
describe('createReviewSchema', () => {
  // requestId must be a valid cuid — use a realistic-looking one
  const validReview = {
    requestId: 'clxxxxxxxxxxxxxxxxxxxxxxxx',
    rating: 4,
    comment: 'Excelente prestador, muito recomendado!',
  }

  it('aceita review válida', () => {
    expect(createReviewSchema.safeParse(validReview).success).toBe(true)
  })

  it('aceita rating mínimo (1)', () => {
    expect(createReviewSchema.safeParse({ ...validReview, rating: 1 }).success).toBe(true)
  })

  it('aceita rating máximo (5)', () => {
    expect(createReviewSchema.safeParse({ ...validReview, rating: 5 }).success).toBe(true)
  })

  it('rejeita rating 0 (abaixo do mínimo)', () => {
    const result = createReviewSchema.safeParse({ ...validReview, rating: 0 })
    expect(result.success).toBe(false)
  })

  it('rejeita rating 6 (acima do máximo)', () => {
    const result = createReviewSchema.safeParse({ ...validReview, rating: 6 })
    expect(result.success).toBe(false)
  })

  it('rejeita rating negativo', () => {
    const result = createReviewSchema.safeParse({ ...validReview, rating: -1 })
    expect(result.success).toBe(false)
  })

  it('rejeita comentário com menos de 10 caracteres', () => {
    const result = createReviewSchema.safeParse({ ...validReview, comment: 'Bom' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/10/)
  })

  it('rejeita comentário vazio', () => {
    const result = createReviewSchema.safeParse({ ...validReview, comment: '' })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// createRequestSchema
// ---------------------------------------------------------------------------
describe('createRequestSchema', () => {
  const validRequest = {
    serviceId: 'clxxxxxxxxxxxxxxxxxxxxxxxx',
    message: 'Olá, gostava de contratar os teus serviços de programação.',
  }

  it('aceita pedido válido', () => {
    expect(createRequestSchema.safeParse(validRequest).success).toBe(true)
  })

  it('rejeita mensagem com menos de 10 caracteres', () => {
    const result = createRequestSchema.safeParse({ ...validRequest, message: 'Olá' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/10/)
  })

  it('rejeita mensagem vazia', () => {
    const result = createRequestSchema.safeParse({ ...validRequest, message: '' })
    expect(result.success).toBe(false)
  })

  it('rejeita serviceId com formato inválido (não cuid)', () => {
    const result = createRequestSchema.safeParse({ ...validRequest, serviceId: 'nao-e-cuid' })
    expect(result.success).toBe(false)
  })

  it('rejeita serviceId vazio', () => {
    const result = createRequestSchema.safeParse({ ...validRequest, serviceId: '' })
    expect(result.success).toBe(false)
  })
})
