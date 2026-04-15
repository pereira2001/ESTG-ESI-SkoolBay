import Link from 'next/link'
import {
  Laptop,
  Palette,
  Languages,
  GraduationCap,
  Music,
  Camera,
  PenLine,
  Package,
  FlaskConical,
  Brush,
  Trophy,
  type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  Laptop,
  Palette,
  Languages,
  GraduationCap,
  Music,
  Camera,
  PenLine,
  Package,
  FlaskConical,
  Brush,
  Trophy,
}

interface CategoryWithCount {
  id: string
  name: string
  slug: string
  icon: string | null
  _count: { services: number }
}

interface CategoriesGridProps {
  categories: CategoryWithCount[]
  activeCategoryId?: string
}

export function CategoriesGrid({ categories, activeCategoryId }: CategoriesGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {categories.map((cat) => {
        const Icon = (cat.icon && ICON_MAP[cat.icon]) ? ICON_MAP[cat.icon] : Package
        const isActive = cat.id === activeCategoryId

        return (
          <Link
            key={cat.id}
            href={isActive ? '/services' : `/services?categoryId=${cat.id}`}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center text-sm transition-all hover:shadow-sm ${
              isActive
                ? 'border-primary bg-primary/5 text-primary'
                : 'bg-card hover:border-primary/40 hover:bg-accent/50'
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                isActive ? 'bg-primary/10' : 'bg-muted'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <p className="font-medium leading-tight">{cat.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {cat._count.services} {cat._count.services === 1 ? 'serviço' : 'serviços'}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
