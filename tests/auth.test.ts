import { describe, it, expect } from 'vitest'
import { registerSchema } from '@/lib/validations/auth'

describe('registerSchema — email institucional', () => {
  it('aceita email @estudantes.piaget.pt', () => {
    const result = registerSchema.safeParse({
      name: 'João Silva',
      email: 'joao@estudantes.piaget.pt',
      password: 'Test123!',
      university: 'Instituto Piaget',
      course: 'Engenharia Informática',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita email gmail', () => {
    const result = registerSchema.safeParse({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: 'Test123!',
      university: 'Instituto Piaget',
      course: 'Engenharia Informática',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/institucional/)
  })

  it('rejeita password sem maiúscula', () => {
    const result = registerSchema.safeParse({
      name: 'João Silva',
      email: 'joao@estudantes.piaget.pt',
      password: 'test1234',
      university: 'Instituto Piaget',
      course: 'Engenharia Informática',
    })
    expect(result.success).toBe(false)
  })

  it('rejeita password sem número', () => {
    const result = registerSchema.safeParse({
      name: 'João Silva',
      email: 'joao@estudantes.piaget.pt',
      password: 'TestPassword',
      university: 'Instituto Piaget',
      course: 'Engenharia Informática',
    })
    expect(result.success).toBe(false)
  })

  it('aceita email @ipleiria.pt', () => {
    const result = registerSchema.safeParse({
      name: 'Maria Santos',
      email: 'maria@ipleiria.pt',
      password: 'Secure123',
      university: 'IPLeiria',
      course: 'Informática',
    })
    expect(result.success).toBe(true)
  })
})
