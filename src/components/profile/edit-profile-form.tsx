'use client'

import { useTransition } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { updateProfileSchema, type UpdateProfileInput } from '@/lib/validations/profile'
import { updateProfile } from '@/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { AvatarUpload } from './avatar-upload'
import { SkillsInput } from './skills-input'

interface EditProfileFormProps {
  user: {
    id: string
    name: string
    email: string
    university: string | null
    course: string | null
    bio: string | null
    avatarUrl: string | null
    skills: string[]
  }
  onCancel: () => void
  onSaved: (updated: Partial<{ name: string; bio: string | null; course: string | null; skills: string[]; avatarUrl: string | null }>) => void
}

export function EditProfileForm({ user, onCancel, onSaved }: EditProfileFormProps) {
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      bio: user.bio ?? '',
      course: user.course ?? '',
      skills: user.skills ?? [],
    } satisfies UpdateProfileInput,
  })

  function onSubmit(data: UpdateProfileInput) {
    startTransition(async () => {
      const result = await updateProfile(data)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('Perfil atualizado com sucesso.')
      onSaved({
        name: data.name,
        bio: data.bio || null,
        course: data.course || null,
        skills: data.skills,
      })
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="flex flex-col items-center">
        <AvatarUpload
          currentAvatarUrl={user.avatarUrl}
          userName={user.name}
          onUploadComplete={(url) => onSaved({ avatarUrl: url })}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        {/* Nome */}
        <div className="space-y-1">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        {/* E-mail (read-only) */}
        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={user.email} disabled readOnly className="opacity-60 cursor-not-allowed" />
          <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado.</p>
        </div>

        {/* Curso */}
        <div className="space-y-1">
          <Label htmlFor="course">Curso</Label>
          <Input id="course" placeholder="Ex: Engenharia Informática" {...register('course')} />
          {errors.course && <p className="text-sm text-red-500">{errors.course.message}</p>}
        </div>

        {/* Bio */}
        <div className="space-y-1">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            rows={4}
            placeholder="Apresenta-te brevemente..."
            className="resize-none"
            {...register('bio')}
          />
          {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
        </div>

        {/* Skills */}
        <div className="space-y-1">
          <Label>Competências</Label>
          <Controller
            control={control}
            name="skills"
            render={({ field }) => (
              <SkillsInput value={field.value ?? []} onChange={field.onChange} />
            )}
          />
          {errors.skills && <p className="text-sm text-red-500">{errors.skills.message}</p>}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'A guardar...' : 'Guardar alterações'}
        </Button>
      </div>
    </form>
  )
}
