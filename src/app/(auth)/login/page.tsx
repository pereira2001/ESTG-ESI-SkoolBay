'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: 'E-mail ou password incorretos.',
  'invalid-token': 'Link de verificação inválido.',
  'expired-token': 'Link de verificação expirado. Regista-te novamente.',
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-muted" />}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'
  const errorParam = searchParams.get('error')
  const verified = searchParams.get('verified') === 'true'

  const [serverError, setServerError] = useState<string | null>(
    errorParam ? (ERROR_MESSAGES[errorParam] ?? 'Erro ao fazer login.') : null
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginInput) {
    setServerError(null)
    const result = await signIn('credentials', { email: data.email, password: data.password, redirect: false })
    if (result?.error) {
      const msg = result.code ?? result.error
      setServerError(ERROR_MESSAGES[msg] ?? 'E-mail ou password incorretos.')
      return
    }
    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Entrar</h1>
        <p className="text-muted-foreground text-sm mt-1">Bem-vindo de volta.</p>
      </div>

      {verified && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
          E-mail verificado com sucesso. Podes fazer login.
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="diogo.pereira@estudantes.piaget.pt" {...register('email')} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          <div className="text-right">
            <span className="text-sm text-[#6C63FF] cursor-not-allowed opacity-60">
              Esqueci a password
            </span>
          </div>
        </div>

        {serverError && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">{serverError}</p>
        )}

        <Button type="submit" variant="outline" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'A entrar...' : 'Entrar'}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Não tens conta?{' '}
          <Link href="/register" className="text-[#6C63FF] underline underline-offset-4 hover:opacity-80">
            Registar
          </Link>
        </p>
      </form>
    </div>
  )
}
