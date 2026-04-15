import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  bio: z.string().max(500, 'Bio não pode exceder 500 caracteres').optional().or(z.literal('')),
  course: z.string().min(2, 'Curso deve ter pelo menos 2 caracteres').max(100).optional().or(z.literal('')),
  skills: z
    .array(z.string().max(30, 'Cada competência não pode exceder 30 caracteres'))
    .max(10, 'Máximo de 10 competências'),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export const avatarFileSchema = z.object({
  size: z.number().max(2 * 1024 * 1024, 'Avatar não pode exceder 2MB'),
  type: z.string().refine(
    (v): v is (typeof ALLOWED_AVATAR_TYPES)[number] => (ALLOWED_AVATAR_TYPES as readonly string[]).includes(v),
    { message: 'Formato inválido. Use JPG, PNG ou WebP' }
  ),
})
