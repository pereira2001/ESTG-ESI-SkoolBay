import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  price: number
  createdAt: Date
  category: { name: string; slug: string } | null
}

interface ServiceListProps {
  services: Service[]
  isOwner: boolean
}

export function ServiceList({ services, isOwner }: ServiceListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Serviços publicados</h2>
        {isOwner && (
          <Link href="/services/new" className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'gap-1.5')}>
            <Plus className="h-4 w-4" />Novo serviço
          </Link>
        )}
      </div>

      {services.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          {isOwner ? 'Ainda não publicaste nenhum serviço.' : 'Sem serviços publicados.'}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((service) => (
            <Link key={service.id} href={`/services/${service.id}`} className="block group">
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base line-clamp-2 leading-snug">
                      {service.title}
                    </CardTitle>
                    <span className="text-sm font-semibold shrink-0 text-foreground">
                      {service.price.toFixed(2)} €
                    </span>
                  </div>
                  {service.category && (
                    <Badge variant="outline" className="w-fit text-xs">
                      {service.category.name}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
