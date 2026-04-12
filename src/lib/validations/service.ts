import { z } from 'zod'

export const createServiceSchema = z.object({
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres').max(100),
  description: z.string().min(20, 'Descrição deve ter pelo menos 20 caracteres').max(2000),
  price: z.number().positive('Preço deve ser maior que 0'),
  categoryId: z.string().cuid().optional(),
})

export const updateServiceSchema = createServiceSchema.partial()

export type CreateServiceInput = z.infer<typeof createServiceSchema>
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>
