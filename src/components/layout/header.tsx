'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LayoutDashboard, LogOut, User } from 'lucide-react'

function getInitials(name?: string | null): string {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

export function Header() {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  return (
    <header className="sticky top-0 z-50 w-full bg-brand border-b border-brand-dark">
      <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-medium text-lg tracking-tight text-white">SkoolBay</Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/services" className="text-white/80 hover:text-white transition-colors">Serviços</Link>
          <Link href="/about" className="text-white/80 hover:text-white transition-colors">Sobre</Link>
        </nav>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <Avatar size="sm">
                  <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? ''} />
                  <AvatarFallback>{getInitials(session.user.name)}</AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium text-white">
                  {session.user.name?.split(' ')[0]}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Link href="/dashboard" className="flex w-full items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={`/profile/${session.user.id}`} className="flex w-full items-center gap-2">
                    <User className="h-4 w-4" />Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 text-red-600 focus:text-red-600"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className="h-4 w-4" />Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md border border-white/60 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-brand hover:bg-white/90 transition-colors"
              >
                Registar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
