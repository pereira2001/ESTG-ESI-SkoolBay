import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { registerApiSchema } from '@/lib/validations/auth'
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
    from: process.env.EMAIL_FROM ?? '"SkoolBay" <onboarding@resend.dev>',
    to: email,
    subject: 'Verifica o teu e-mail — SkoolBay',
    html: `
      <div style="background-color:#F4F3FB;padding:40px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <div style="background-color:#FFFFFF;max-width:480px;margin:0 auto;padding:40px;border-radius:12px;box-shadow:0 2px 8px rgba(45,42,110,0.08);">
          <div style="font-size:24px;font-weight:bold;color:#7F77DD;margin:0 0 24px;">SkoolBay</div>
          <h2 style="color:#2D2A6E;font-size:20px;margin:0 0 16px;">Olá, ${name}!</h2>
          <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px;">Obrigado por te registares no SkoolBay. Clica no botão abaixo para verificar o teu e-mail.</p>
          <a href="${verifyUrl}" style="display:inline-block;padding:14px 32px;background-color:#7F77DD;color:#FFFFFF;border-radius:8px;text-decoration:none;font-size:16px;margin:0 0 24px;">
            Verificar e-mail
          </a>
          <hr style="border:none;border-top:1px solid #E8E7F5;margin:24px 0;" />
          <p style="color:#999;font-size:12px;margin:0;">Este link expira em 24 horas. Se não criaste esta conta, ignora este e-mail.</p>
        </div>
      </div>
    `,
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerApiSchema.safeParse(body)

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
