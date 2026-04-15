import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Star, Euro } from 'lucide-react'

interface ServiceCardProps {
  service: {
    id: string
    title: string
    price: number
    category: { name: string } | null
    user: {
      id: string
      name: string
      avatarUrl: string | null
      rating: number
    }
  }
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={`/services/${service.id}`} className="group">
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="space-y-2">
          {service.category && (
            <Badge variant="secondary" className="text-xs">{service.category.name}</Badge>
          )}
          <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {service.title}
          </h3>
          <div className="flex items-center gap-0.5 text-lg font-bold text-primary">
            <Euro className="h-4 w-4" />
            {service.price.toFixed(2)}
          </div>
        </CardContent>
        <CardFooter className="gap-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="size-6 shrink-0">
                <AvatarImage src={service.user.avatarUrl ?? undefined} alt={service.user.name} />
                <AvatarFallback className="text-[10px]">{getInitials(service.user.name)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground truncate">
                {service.user.name.split(' ')[0]}
              </span>
            </div>
            {service.user.rating > 0 && (
              <div className="flex items-center gap-1 text-sm shrink-0">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{service.user.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
