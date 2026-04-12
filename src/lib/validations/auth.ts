import { z } from 'zod'

const INSTITUTIONAL_DOMAINS = [
  'estudantes.piaget.pt',
  'alunos.piaget.pt',
  'piaget.pt',
  'edu',
  'ac.pt',
  'ipleiria.pt',
  'iscte.pt',
  'ulisboa.pt',
  'up.pt',
  'uminho.pt',
  'ua.pt',
  'uc.pt',
]

function isInstitutionalEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase() ?? ''
  return INSTITUTIONAL_DOMAINS.some((d) => domain === d || domain.endsWith(`.${d}`))
}

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z
    .string()
    .email('E-mail inválido')
    .refine(isInstitutionalEmail, 'É necessário um e-mail institucional universitário'),
  password: z
    .string()
    .min(8, 'Password deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Deve conter pelo menos um número'),
  university: z.string().min(2, 'Universidade obrigatória'),
  course: z.string().min(2, 'Curso obrigatório'),
})

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Password obrigatória'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
