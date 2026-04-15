import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-6 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} SkoolBay — Marketplace de serviços entre estudantes</p>
        <nav className="flex gap-4">
          <Link href="/about" className="hover:text-foreground transition-colors">Sobre</Link>
          <Link href="/services" className="hover:text-foreground transition-colors">Serviços</Link>
        </nav>
      </div>
    </footer>
  )
}
