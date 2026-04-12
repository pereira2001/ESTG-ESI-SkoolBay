import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=invalid-token', req.nextUrl))
  }

  const user = await prisma.user.findUnique({ where: { verifyToken: token } })

  if (!user || !user.verifyTokenExpiry || user.verifyTokenExpiry < new Date()) {
    return NextResponse.redirect(new URL('/login?error=expired-token', req.nextUrl))
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date(), verifyToken: null, verifyTokenExpiry: null },
  })

  return NextResponse.redirect(new URL('/login?verified=true', req.nextUrl))
}
