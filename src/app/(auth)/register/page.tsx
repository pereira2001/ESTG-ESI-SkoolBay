'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { registerSchema } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const registerFormSchema = registerSchema
  .extend({ confirmPassword: z.string() })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As passwords não coincidem',
    path: ['confirmPassword'],
  })

type RegisterFormInput = z.infer<typeof registerFormSchema>

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput>({ resolver: zodResolver(registerFormSchema) })

  async function onSubmit(formData: RegisterFormInput) {
    setServerError(null)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...data } = formData
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) { setServerError(json.error ?? 'Erro ao criar conta.'); return }
      setSuccess(true)
    } catch {
      setServerError('Erro de ligação. Tenta novamente.')
    }
  }

  if (success) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Verifica o teu e-mail</h1>
        <p className="text-muted-foreground text-sm">
          Enviámos um link de verificação para o teu e-mail institucional. Clica no link para ativar a conta.
        </p>
        <Link href="/login" className="w-full">
          <Button variant="outline" className="w-full">Ir para o login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Criar conta</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Usa o teu e-mail institucional para aceder à plataforma.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" placeholder="Diogo Pereira" {...register('name')} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">E-mail institucional</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="university">Universidade</Label>
            <Input id="university" placeholder="Piaget" {...register('university')} />
            {errors.university && <p className="text-sm text-red-500">{errors.university.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="course">Curso</Label>
            <Input id="course" placeholder="Eng. Informática" {...register('course')} />
            {errors.course && <p className="text-sm text-red-500">{errors.course.message}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Mínimo 8 caracteres" {...register('password')} />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword">Confirmar password</Label>
          <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        {serverError && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">{serverError}</p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'A criar conta...' : 'Criar conta'}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Já tens conta?{' '}
          <Link href="/login" className="text-primary underline underline-offset-4 hover:opacity-80">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  )
}
