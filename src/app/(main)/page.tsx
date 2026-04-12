import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Encontra ajuda. Partilha competências.</h1>
      <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
        O SkoolBay é o marketplace de serviços entre estudantes universitários. Tutoria, design, tradução, código — tudo numa plataforma.
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/register" className={cn(buttonVariants({ size: 'lg' }))}>Começar agora</Link>
        <Link href="/services" className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}>Ver serviços</Link>
      </div>
    </div>
  )
}
