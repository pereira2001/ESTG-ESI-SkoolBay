import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(baseUrl + '/login?error=invalid-token')
  }

  const user = await prisma.user.findUnique({ where: { verifyToken: token } })

  if (!user || !user.verifyTokenExpiry || user.verifyTokenExpiry < new Date()) {
    return NextResponse.redirect(baseUrl + '/login?error=expired-token')
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date(), verifyToken: null, verifyTokenExpiry: null },
  })

  return NextResponse.redirect(baseUrl + '/login?verified=true')
}
