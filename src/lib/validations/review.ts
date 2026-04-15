import { z } from 'zod'

export const createReviewSchema = z.object({
  requestId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10, 'Comentário deve ter pelo menos 10 caracteres').max(500),
})

export type CreateReviewInput = z.infer<typeof createReviewSchema>
