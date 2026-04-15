import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

interface ReviewEntry {
  rating: number
  comment: string | null
  createdAt: Date
  buyer: { name: string; avatarUrl: string | null }
}

interface ReviewsSectionProps {
  reviews: ReviewEntry[]
  averageRating: number
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

function StarRow({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'h-4 w-4' : 'h-3 w-3'
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${cls} ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  )
}

export function ReviewsSection({ reviews, averageRating }: ReviewsSectionProps) {
  if (reviews.length === 0) {
    return (
      <div>
        <h2 className="text-sm font-semibold mb-3">Avaliações</h2>
        <p className="text-sm text-muted-foreground">Ainda não há avaliações.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header with aggregate */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-sm font-semibold">Avaliações</h2>
        <div className="flex items-center gap-1.5">
          <StarRow rating={Math.round(averageRating)} size="md" />
          <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">
            ({reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'})
          </span>
        </div>
      </div>

      <ul className="space-y-5">
        {reviews.map((review, i) => (
          <li key={i} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Avatar className="size-7">
                  <AvatarImage src={review.buyer.avatarUrl ?? undefined} alt={review.buyer.name} />
                  <AvatarFallback className="text-[10px]">{getInitials(review.buyer.name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{review.buyer.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StarRow rating={review.rating} />
                <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
              </div>
            </div>
            {review.comment && (
              <p className="text-sm text-muted-foreground pl-9 leading-relaxed">{review.comment}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
