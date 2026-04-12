import { z } from 'zod'

export const createRequestSchema = z.object({
  serviceId: z.string().cuid(),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres').max(1000),
})

export type CreateRequestInput = z.infer<typeof createRequestSchema>
