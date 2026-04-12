'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  async function onSubmit(data: RegisterInput) {
    setServerError(null)
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
      <Card>
        <CardHeader>
          <CardTitle>Verifica o teu e-mail</CardTitle>
          <CardDescription>
            Enviámos um link de verificação para o teu e-mail institucional. Clica no link para ativar a conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full" variant="outline">
            <Link href="/login">Ir para o login</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Criar conta</CardTitle>
        <CardDescription>Usa o teu e-mail universitário para te registares.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" placeholder="O teu nome completo" {...register('name')} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">E-mail institucional</Label>
            <Input id="email" type="email" placeholder="nome@estudantes.piaget.pt" {...register('email')} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Mínimo 8 caracteres" {...register('password')} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="university">Universidade</Label>
            <Input id="university" placeholder="Ex: Instituto Piaget" {...register('university')} />
            {errors.university && <p className="text-sm text-red-500">{errors.university.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="course">Curso</Label>
            <Input id="course" placeholder="Ex: Engenharia Informática" {...register('course')} />
            {errors.course && <p className="text-sm text-red-500">{errors.course.message}</p>}
          </div>
          {serverError && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">{serverError}</p>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'A criar conta...' : 'Criar conta'}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Já tens conta?{' '}
            <Link href="/login" className="underline underline-offset-4 hover:text-foreground">Faz login</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
