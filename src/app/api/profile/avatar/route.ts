import { NextRequest, NextResponse } from 'next/server'
import { writeFile, unlink } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { avatarFileSchema } from '@/lib/validations/profile'

const ALLOWED_MIME_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
])

// Magic bytes validation
function detectMimeType(buffer: Buffer): string | null {
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg'
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return 'image/png'
  if (
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) return 'image/webp'
  return null
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('avatar')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Ficheiro inválido.' }, { status: 400 })
  }

  const parsed = avatarFileSchema.safeParse({ size: file.size, type: file.type })
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
    return NextResponse.json({ error: firstError ?? 'Ficheiro inválido.' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  const detectedMime = detectMimeType(buffer)
  if (!detectedMime || !ALLOWED_MIME_TYPES.has(detectedMime)) {
    return NextResponse.json({ error: 'Conteúdo do ficheiro não é uma imagem válida.' }, { status: 400 })
  }

  const ext = ALLOWED_MIME_TYPES.get(detectedMime)!
  const filename = `${session.user.id}-${crypto.randomUUID()}.${ext}`
  const avatarsDir = path.join(process.cwd(), 'public', 'avatars')
  const filePath = path.join(avatarsDir, filename)

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { avatarUrl: true },
  })

  await writeFile(filePath, buffer)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { avatarUrl: `/avatars/${filename}` },
  })

  // Delete old avatar if it was a local file
  if (currentUser?.avatarUrl?.startsWith('/avatars/')) {
    const oldPath = path.join(process.cwd(), 'public', currentUser.avatarUrl)
    unlink(oldPath).catch(() => {
      // Non-critical: old file cleanup failure is acceptable
    })
  }

  return NextResponse.json({ success: true, avatarUrl: `/avatars/${filename}` })
}
