import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChefHat, Plus, X } from 'lucide-react'
import { ORDER_END, ORDER_START, STARTER_DISHES } from '../../data/kitchen'
import { SYMBOLS, cardImage, pictureUrl } from '../../data/symbols'
import type { CustomSymbol } from '../../types'
import { PictureCard } from '../home/PictureCard'

interface Dish {
  key: string
  label: string
  spoken: string
  src: string
  photo: boolean
  emoji?: string
  id?: string
}

interface KitchenTabProps {
  dishes: CustomSymbol[]
  speak: (text: string, parts?: string[]) => void
  onAddDish: () => void
  onDelete: (id: string) => void
}

/** GrabFood-style menu of what Mom cooks. Ordering speaks the request out loud. */
export function KitchenTab({ dishes, speak, onAddDish, onDelete }: KitchenTabProps) {
  const [picked, setPicked] = useState<Dish | null>(null)
  const [sent, setSent] = useState(false)

  const menu: Dish[] = [
    ...dishes.map((d) => ({ key: d.id, id: d.id, label: d.label, spoken: d.label, src: d.imageData, photo: true })),
    ...(dishes.length ? [] : SYMBOLS.filter((s) => STARTER_DISHES.includes(s.id) && pictureUrl(s.id)).map((s) => ({
      key: s.id, label: s.label, spoken: s.spokenText, ...cardImage(s.id), emoji: s.emoji,
    }))),
  ]

  const order = (dish: Dish) => {
    const text = `${ORDER_START} ${dish.spoken} ${ORDER_END}`
    speak(text, [ORDER_START, dish.spoken, ORDER_END])
    setSent(true)
  }
  const close = () => { setPicked(null); setSent(false) }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-4 flex flex-col gap-4">
        <div className="rounded-3xl bg-gradient-to-br from-pink-50 to-white border border-pink-100 px-5 py-4 flex items-center gap-4">
          <span className="w-14 h-14 shrink-0 rounded-2xl bg-white shadow-sm flex items-center justify-center">
            <ChefHat className="text-pink-600" size={32} />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-black text-slate-900">Mom's Kitchen</h2>
            <p className="text-sm text-slate-600">What should Mom cook? Tap a dish to order.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {menu.map((d) => (
            <PictureCard key={d.key} wide label={d.label} src={d.src} photo={d.photo} emoji={d.emoji}
              footer={<span className="mx-2 mb-2 h-9 rounded-xl bg-pink-600 text-white text-sm font-bold flex items-center justify-center">Order</span>}
              onTap={() => setPicked(d)} onDelete={d.id ? () => onDelete(d.id!) : undefined} />
          ))}
          <button
            onClick={onAddDish}
            className="rounded-2xl border-2 border-dashed border-pink-300 bg-white/60 text-pink-700 flex flex-col items-center justify-center gap-1 text-sm font-semibold min-h-40"
          >
            <Plus size={28} /> Add a dish
            <span className="text-xs font-medium text-slate-500 px-3 text-center">Take a photo of something you cook</span>
          </button>
        </div>
        {!dishes.length && (
          <p className="text-xs text-slate-500">Tip for parents: add photos of the dishes you cook. The examples disappear once you add your first dish.</p>
        )}
      </div>

      <AnimatePresence>
        {picked && (
          <motion.div className="fixed inset-0 z-40 bg-black/40 flex items-end sm:items-center sm:justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
            <motion.div
              className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 pb-8 flex flex-col gap-4"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end">
                <button onClick={close} aria-label="Close" className="p-1 text-slate-500"><X size={22} /></button>
              </div>
              {sent ? (
                <div className="flex flex-col items-center text-center gap-2 py-6">
                  <ChefHat className="text-pink-600" size={56} />
                  <p className="text-xl font-bold text-slate-900">Order sent!</p>
                  <p className="text-slate-600">Mom is cooking {picked.label.toLowerCase()} for you.</p>
                  <button onClick={close} className="mt-4 w-full py-3 rounded-2xl bg-slate-900 text-white font-bold">Done</button>
                </div>
              ) : (
                <>
                  <div className="w-full aspect-[4/3] rounded-2xl bg-pink-50 overflow-hidden flex items-center justify-center">
                    <img src={picked.src} alt="" className={picked.photo ? 'w-full h-full object-cover' : 'w-1/2 h-1/2 object-contain'} />
                  </div>
                  <p className="text-xl font-bold text-slate-900">{picked.label}</p>
                  <button onClick={() => order(picked)} className="w-full py-4 rounded-2xl bg-pink-600 text-white text-lg font-bold active:scale-95 transition-transform">
                    Order
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
