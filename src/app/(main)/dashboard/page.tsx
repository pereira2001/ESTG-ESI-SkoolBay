import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Olá, {session.user?.name?.split(' ')[0]}!</h1>
      <p className="text-muted-foreground">O teu dashboard está a ser construído. Volta em breve.</p>
    </div>
  )
}
