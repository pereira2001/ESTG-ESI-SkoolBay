import { z } from 'zod'

// Allowlist estática de domínios institucionais (primeiro filtro / validação síncrona).
// A validação definitiva no registo real é feita contra a tabela InstitutionalDomain na BD.
export const INSTITUTIONAL_DOMAINS = [
  'ipiaget.pt',
  'estudantes.piaget.pt',
  'ipleiria.pt',
  'ulisboa.pt',
] as const

function isInstitutionalEmail(email: string): boolean {
  const lowered = email.toLowerCase()
  // Ancorado ao fim (`@${dominio}`), case-insensitive — não um includes.
  return INSTITUTIONAL_DOMAINS.some((domain) => lowered.endsWith(`@${domain}`))
}

// Schema base: valida formato de todos os campos (incl. formato do email), sem refine de domínio.
const registerBaseSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z
    .string()
    .min(8, 'Password deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Deve conter pelo menos um número'),
  university: z.string().min(2, 'Universidade obrigatória'),
  course: z.string().min(2, 'Curso obrigatório'),
})

// Schema com allowlist estática de domínio (testes unitários + cliente).
// O `.email()` (formato) corre ANTES do refine: um valor sem formato de email
// devolve 'E-mail inválido'; um email válido fora da allowlist devolve a msg institucional.
export const registerSchema = registerBaseSchema.extend({
  email: z
    .string()
    .email('E-mail inválido')
    .refine(isInstitutionalEmail, 'Tem de usar um e-mail institucional'),
})

// Schema usado pelo route handler: valida formato (name, email, password, university, course),
// mas o domínio institucional é validado pela BD (tabela InstitutionalDomain), não pela allowlist estática.
export const registerApiSchema = registerBaseSchema

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Password obrigatória'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
