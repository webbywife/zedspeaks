import { useState } from 'react'
import { Plus } from 'lucide-react'
import { SHELVES } from '../../data/shelves'
import { SYMBOLS, cardImage } from '../../data/symbols'
import { feelingSymbols } from '../../data/characters'
import { useBoardStore } from '../../store/boardStore'
import type { AACSymbol, CustomSymbol } from '../../types'
import { PictureCard } from './PictureCard'
import { CARD_PHRASES, STARTERS, photoPhrase, sentenceFor, type Starter } from '../../data/homePhrases'

interface HomeTabProps {
  photos: CustomSymbol[]
  /** label for the sentence strip, and the full sentence to say */
  onPick: (label: string, sentence: string) => void
  onFeel: (s: AACSymbol) => void
  onAddPhoto: (shelf: string) => void
  onDelete: (id: string) => void
  /** Shown above the shelves (e.g. the welcome card) */
  top?: React.ReactNode
}

/** Shopee-style shelves: the child's own photos first, then built-in cards. */
export function HomeTab({ photos, onPick, onFeel, onAddPhoto, onDelete, top }: HomeTabProps) {
  const [starter, setStarter] = useState<Starter | null>(null)
  const character = useBoardStore((s) => s.character)
  return (
    <div className="flex-1 overflow-y-auto pb-4">
      {top}
      {/* Feeling faces first (Zed or the girl, per Settings): tap = "I am happy", and the header face changes */}
      <section className="pt-4">
        <h2 className="px-4 pb-2 text-base font-bold text-slate-900">How I feel</h2>
        <div className="flex gap-3 overflow-x-auto px-4 pb-1" style={{ scrollbarWidth: 'none' }}>
          {feelingSymbols(character).map((s) => (
            <PictureCard key={s.id} label={s.label} src={s.customImageUrl ?? cardImage(s.id).src}
              photo={!!s.customImageUrl} emoji={s.emoji} onTap={() => onFeel(s)} />
          ))}
        </div>
      </section>
      {/* Sentence starters: none picked = each card says its natural sentence */}
      <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur px-4 pt-4 pb-2 flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <span className="shrink-0 text-sm font-bold text-slate-500">Say:</span>
        {STARTERS.map((st) => (
          <button key={st.id} onClick={() => setStarter(starter?.id === st.id ? null : st)}
            aria-pressed={starter?.id === st.id}
            className={`shrink-0 px-4 h-10 rounded-full text-sm font-bold border ${
              starter?.id === st.id ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-slate-700 border-slate-300'}`}>
            {st.text}…
          </button>
        ))}
      </div>
      {/* My Body cards always say their own sentence ("My tummy hurts"); the Say: starters don't apply */}
      {SHELVES.map((shelf) => {
        const own = photos.filter((p) => p.shelf === shelf.id || (!p.shelf && shelf.id === 'toys'))
        const starters = SYMBOLS.filter((s) => shelf.starters.includes(s.id))
        return (
          <section key={shelf.id} className="pt-4">
            <h2 className="px-4 pb-2 text-base font-bold text-slate-900">{shelf.label}</h2>
            <div className="flex gap-3 overflow-x-auto px-4 pb-1" style={{ scrollbarWidth: 'none' }}>
              {own.map((p) => (
                <PictureCard key={p.id} label={p.label} src={p.imageData} photo
                  onTap={() => onPick(p.label, shelf.id === 'body' ? `My ${p.label} hurts` : sentenceFor(photoPhrase(p.label, p.shelf ?? shelf.id), starter))} onDelete={() => onDelete(p.id)} />
              ))}
              {starters.map((s) => (
                <PictureCard key={s.id} label={s.label} {...cardImage(s.id)} emoji={s.emoji}
                  onTap={() => onPick(s.label, s.category === 'body' ? s.spokenText : sentenceFor(CARD_PHRASES[s.id] ?? photoPhrase(s.spokenText, shelf.id), starter))} />
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
