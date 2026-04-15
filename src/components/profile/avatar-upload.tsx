'use client'

import { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera, Loader2 } from 'lucide-react'

const MAX_SIZE = 2 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface AvatarUploadProps {
  currentAvatarUrl?: string | null
  userName: string
  onUploadComplete: (url: string) => void
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

export function AvatarUpload({ currentAvatarUrl, userName, onUploadComplete }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Formato inválido. Use JPG, PNG ou WebP.')
      return
    }
    if (file.size > MAX_SIZE) {
      setError('O avatar não pode exceder 2MB.')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const res = await fetch('/api/profile/avatar', { method: 'POST', body: formData })
      const json = await res.json() as { success?: boolean; avatarUrl?: string; error?: string }

      if (!res.ok || !json.success) {
        setError(json.error ?? 'Erro ao fazer upload.')
        setPreview(null)
        return
      }

      onUploadComplete(json.avatarUrl!)
    } catch {
      setError('Erro de ligação. Tenta novamente.')
      setPreview(null)
    } finally {
      setIsUploading(false)
      URL.revokeObjectURL(objectUrl)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="relative group rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Alterar avatar"
      >
        <Avatar className="size-20">
          <AvatarImage src={preview ?? currentAvatarUrl ?? undefined} alt={userName} />
          <AvatarFallback className="text-xl">{getInitials(userName)}</AvatarFallback>
        </Avatar>
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          {isUploading ? (
            <Loader2 className="h-5 w-5 text-white animate-spin" />
          ) : (
            <Camera className="h-5 w-5 text-white" />
          )}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden
      />
      <p className="text-xs text-muted-foreground">Clica para alterar · JPG, PNG, WebP · máx. 2MB</p>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
