import { describe, it, expect } from 'vitest'
import { registerSchema, loginSchema } from '@/lib/validations/auth'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const validRegister = {
  name: 'João Silva',
  email: 'joao@estudantes.piaget.pt',
  password: 'Test123!',
  university: 'Instituto Piaget',
  course: 'Engenharia Informática',
}

// ---------------------------------------------------------------------------
// registerSchema
// ---------------------------------------------------------------------------
describe('registerSchema — email institucional', () => {
  it('aceita email @estudantes.piaget.pt', () => {
    expect(registerSchema.safeParse(validRegister).success).toBe(true)
  })

  it('aceita email @ipleiria.pt', () => {
    const result = registerSchema.safeParse({ ...validRegister, email: 'maria@ipleiria.pt' })
    expect(result.success).toBe(true)
  })

  it('aceita email @ulisboa.pt', () => {
    const result = registerSchema.safeParse({ ...validRegister, email: 'ana@ulisboa.pt' })
    expect(result.success).toBe(true)
  })

  it('rejeita email gmail', () => {
    const result = registerSchema.safeParse({ ...validRegister, email: 'joao@gmail.com' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/institucional/)
  })

  it('rejeita email de empresa genérica', () => {
    const result = registerSchema.safeParse({ ...validRegister, email: 'user@empresa.com' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/institucional/)
  })

  it('rejeita formato de email inválido', () => {
    const result = registerSchema.safeParse({ ...validRegister, email: 'nao-e-um-email' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/[Ee]-mail/)
  })
})

describe('registerSchema — password', () => {
  it('rejeita password sem letra maiúscula', () => {
    const result = registerSchema.safeParse({ ...validRegister, password: 'test1234' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/maiúscula/)
  })

  it('rejeita password sem número', () => {
    const result = registerSchema.safeParse({ ...validRegister, password: 'TestPassword' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/número/)
  })

  it('rejeita password com menos de 8 caracteres', () => {
    const result = registerSchema.safeParse({ ...validRegister, password: 'T1!' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/8/)
  })
})

describe('registerSchema — campos obrigatórios', () => {
  it('rejeita nome com menos de 2 caracteres', () => {
    const result = registerSchema.safeParse({ ...validRegister, name: 'J' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/2/)
  })

  it('rejeita universidade em falta', () => {
    const result = registerSchema.safeParse({ ...validRegister, university: '' })
    expect(result.success).toBe(false)
  })

  it('rejeita curso em falta', () => {
    const result = registerSchema.safeParse({ ...validRegister, course: '' })
    expect(result.success).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// loginSchema
// ---------------------------------------------------------------------------
describe('loginSchema', () => {
  it('aceita credenciais válidas', () => {
    const result = loginSchema.safeParse({
      email: 'joao@estudantes.piaget.pt',
      password: 'qualquer-coisa',
    })
    expect(result.success).toBe(true)
  })

  it('não restringe domínio — aceita gmail no login', () => {
    // Login não filtra domínio; a conta simplesmente não existirá
    const result = loginSchema.safeParse({
      email: 'joao@gmail.com',
      password: 'qualquer-coisa',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita email com formato inválido', () => {
    const result = loginSchema.safeParse({
      email: 'nao-e-email',
      password: 'Test123!',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/[Ee]-mail/)
  })

  it('rejeita password vazia', () => {
    const result = loginSchema.safeParse({
      email: 'joao@estudantes.piaget.pt',
      password: '',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/[Oo]brigatória/)
  })
})
