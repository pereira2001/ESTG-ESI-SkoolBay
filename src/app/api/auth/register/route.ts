import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations/auth'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
    secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })
}

async function sendVerificationEmail(email: string, name: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`
  const transporter = createTransporter()
  await transporter.sendMail({
    from: process.env.EMAIL_FROM ?? '"SkoolBay" <noreply@skoolbay.pt>',
    to: email,
    subject: 'Verifica o teu e-mail — SkoolBay',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Olá, ${name}!</h2>
        <p>Obrigado por te registares no SkoolBay. Clica no botão abaixo para verificar o teu e-mail.</p>
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;border-radius:6px;text-decoration:none;margin:16px 0;">
          Verificar e-mail
        </a>
        <p style="color:#666;font-size:12px;">Este link expira em 24 horas. Se não criaste esta conta, ignora este e-mail.</p>
      </div>
    `,
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, password, university, course } = parsed.data
    const domain = email.split('@')[1]?.toLowerCase()

    const allowed = await prisma.institutionalDomain.findFirst({
      where: {
        isActive: true,
        OR: [{ domain }, { domain: { endsWith: `.${domain}` } }],
      },
    })

    if (!allowed) {
      return NextResponse.json(
        { error: 'E-mail institucional não reconhecido. Contacta o administrador.' },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Este e-mail já está registado.' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const verifyToken = crypto.randomBytes(32).toString('hex')
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.user.create({
      data: { name, email, password: hashedPassword, university, course, verifyToken, verifyTokenExpiry },
    })

    try {
      await sendVerificationEmail(email, name, verifyToken)
    } catch (emailError) {
      console.error('Falha ao enviar email de verificação:', emailError)
    }

    return NextResponse.json(
      { message: 'Conta criada. Verifica o teu e-mail para ativar.' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro no registo:', error)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}
