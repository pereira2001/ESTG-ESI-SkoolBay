import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-[#6C63FF] px-6 py-3">
        <Link href="/" className="text-white font-semibold text-lg tracking-tight">
          SkoolBay
        </Link>
      </header>
      <main className="flex-1 flex items-start justify-center pt-12 px-4">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  )
}
