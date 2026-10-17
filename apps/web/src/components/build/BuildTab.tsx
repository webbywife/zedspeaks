import { useState } from 'react'
import { motion } from 'framer-motion'
import { GROUPS, JOINERS, STARTERS, type Piece } from '../../data/builder'

interface BuildTabProps {
  onPiece: (text: string) => void
}

/** Mix and match: starter + ending (+ joining words) go into the sentence strip, then Speak. */
export function BuildTab({ onPiece }: BuildTabProps) {
  const [group, setGroup] = useState(GROUPS[0].id)
  const pieces = GROUPS.find((g) => g.id === group)?.pieces ?? []

  return (
    <div className="flex-1 overflow-y-auto pb-4">
      <Section title="1. Start with">
        <div className="flex flex-wrap gap-2 px-3">
          {STARTERS.map((p) => <Chip key={p.text} piece={p} tone="bg-blue-600 text-white border-blue-700" onTap={onPiece} />)}
        </div>
      </Section>

      <Section title="2. Add">
        <div className="flex gap-2 overflow-x-auto px-3 pb-2" style={{ scrollbarWidth: 'none' }}>
          {GROUPS.map((g) => (
            <button key={g.id} onClick={() => setGroup(g.id)}
              className={`shrink-0 px-3 h-10 rounded-full text-sm font-bold border ${
                group === g.id ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-slate-700 border-slate-300'}`}>
              <span aria-hidden>{g.emoji}</span> {g.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 px-3">
          {pieces.map((p) => <Tile key={p.text} piece={p} onTap={onPiece} />)}
        </div>
      </Section>

      <Section title="3. Join words">
        <div className="flex flex-wrap gap-2 px-3">
          {JOINERS.map((p) => <Chip key={p.text} piece={p} tone="bg-amber-50 text-amber-900 border-amber-300" onTap={onPiece} />)}
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pt-3">
      <h2 className="px-3 pb-2 text-sm font-black uppercase tracking-wide text-slate-500">{title}</h2>
      {children}
    </section>
  )
}

function Chip({ piece, tone, onTap }: { piece: Piece; tone: string; onTap: (t: string) => void }) {
  return (
    <motion.button whileTap={{ scale: 0.92 }} onClick={() => onTap(piece.text)}
      className={`flex items-center gap-1.5 px-3 h-11 rounded-xl border font-bold shadow-sm ${tone}`}>
      <span aria-hidden>{piece.emoji}</span>{piece.text}
    </motion.button>
  )
}

function Tile({ piece, onTap }: { piece: Piece; onTap: (t: string) => void }) {
  return (
    <motion.button whileTap={{ scale: 0.92 }} onClick={() => onTap(piece.text)}
      className="flex flex-col items-center justify-center gap-1 h-24 rounded-2xl bg-white border border-slate-200 shadow-sm px-1">
      <span className="text-3xl" aria-hidden>{piece.emoji}</span>
      <span className="text-sm font-semibold text-slate-800 leading-tight text-center line-clamp-2">{piece.text}</span>
    </motion.button>
  )
}
