import { Star, Heart, Apple, Users, MapPin, Zap, MessageSquare, Camera } from 'lucide-react'
import type { CategoryId, CategoryMeta } from '../../types'

const ICONS: Record<CategoryId, React.ReactNode> = {
  needs:      <Star        size={16} />,
  feelings:   <Heart       size={16} />,
  food:       <Apple       size={16} />,
  people:     <Users       size={16} />,
  places:     <MapPin      size={16} />,
  actions:    <Zap         size={16} />,
  phrases:    <MessageSquare size={16} />,
  'my-photos': <Camera     size={16} />,
}

interface CategoryNavProps {
  categories: CategoryMeta[]
  active: CategoryId
  onChange: (id: CategoryId) => void
}

export function CategoryNav({ categories, active, onChange }: CategoryNavProps) {
  return (
    <nav
      className="flex overflow-x-auto border-t border-gray-700 bg-gray-900 shrink-0"
      style={{ scrollbarWidth: 'none' }}
      aria-label="Symbol categories"
    >
      {categories.map((cat) => {
        const isActive = cat.id === active
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-w-[60px] min-h-[58px] transition-colors relative shrink-0"
            style={isActive ? { backgroundColor: cat.color, color: '#fff' } : { color: '#94a3b8' }}
            aria-label={cat.label}
            aria-current={isActive ? 'true' : undefined}
          >
            {ICONS[cat.id]}
            <span className="text-[9px] font-bold tracking-wide uppercase leading-tight text-center">
              {cat.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
