import { Plus } from 'lucide-react'
import { SHELVES } from '../../data/shelves'
import { SYMBOLS, cardImage, getSymbolsByCategory } from '../../data/symbols'
import type { AACSymbol, CustomSymbol } from '../../types'
import { PictureCard } from './PictureCard'

interface HomeTabProps {
  photos: CustomSymbol[]
  onPick: (label: string, spokenText: string) => void
  onFeel: (s: AACSymbol) => void
  onAddPhoto: (shelf: string) => void
  onDelete: (id: string) => void
  /** Shown above the shelves (e.g. the welcome card) */
  top?: React.ReactNode
}

/** Shopee-style shelves: the child's own photos first, then built-in cards. */
export function HomeTab({ photos, onPick, onFeel, onAddPhoto, onDelete, top }: HomeTabProps) {
  return (
    <div className="flex-1 overflow-y-auto pb-4">
      {top}
      {/* Zed's own faces first: tap = "I am happy", and his face in the header changes */}
      <section className="pt-4">
        <h2 className="px-4 pb-2 text-base font-bold text-slate-900">How I feel</h2>
        <div className="flex gap-3 overflow-x-auto px-4 pb-1" style={{ scrollbarWidth: 'none' }}>
          {getSymbolsByCategory('feelings').map((s) => (
            <PictureCard key={s.id} label={s.label} src={s.customImageUrl ?? cardImage(s.id).src}
              photo={!!s.customImageUrl} emoji={s.emoji} onTap={() => onFeel(s)} />
          ))}
        </div>
      </section>
      {SHELVES.map((shelf, i) => {
        const own = photos.filter((p) => p.shelf === shelf.id || (!p.shelf && i === 0))
        const starters = SYMBOLS.filter((s) => shelf.starters.includes(s.id))
        return (
          <section key={shelf.id} className="pt-4">
            <h2 className="px-4 pb-2 text-base font-bold text-slate-900">{shelf.label}</h2>
            <div className="flex gap-3 overflow-x-auto px-4 pb-1" style={{ scrollbarWidth: 'none' }}>
              {own.map((p) => (
                <PictureCard key={p.id} label={p.label} src={p.imageData} photo
                  onTap={() => onPick(p.label, p.label)} onDelete={() => onDelete(p.id)} />
              ))}
              {starters.map((s) => (
                <PictureCard key={s.id} label={s.label} {...cardImage(s.id)} emoji={s.emoji}
                  onTap={() => onPick(s.label, s.spokenText)} />
              ))}
              <button
                onClick={() => onAddPhoto(shelf.id)}
                className="shrink-0 w-28 aspect-square rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 flex flex-col items-center justify-center gap-1 text-xs font-semibold"
              >
                <Plus size={22} /> Add photo
              </button>
            </div>
          </section>
        )
      })}
    </div>
  )
}
