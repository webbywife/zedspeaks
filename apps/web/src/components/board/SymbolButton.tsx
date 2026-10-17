import { useState } from 'react'
import { motion } from 'framer-motion'
import { arasaacUrl, iconUrl, pictureUrl, getCategoryMeta } from '../../data/symbols'
import type { AACSymbol } from '../../types'

interface SymbolButtonProps {
  symbol: AACSymbol
  onTap: (symbol: AACSymbol) => void
}

export function SymbolButton({ symbol, onTap }: SymbolButtonProps) {
  // Own icon set first, then the ARASAAC pictogram, then the emoji.
  const sources = symbol.customImageUrl
    ? [symbol.customImageUrl]
    : [pictureUrl(symbol.id), iconUrl(symbol.id), arasaacUrl(symbol.arasaacId)].filter((u): u is string => !!u)
  const [srcIndex, setSrcIndex] = useState(0)
  const imgError = srcIndex >= sources.length
  const category = getCategoryMeta(symbol.category)

  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={() => onTap(symbol)}
      className="flex flex-col items-center justify-center gap-1 w-full h-full min-h-[72px] rounded-2xl bg-white shadow-sm border-2 p-2 cursor-pointer select-none focus:outline-none focus-visible:ring-3 focus-visible:ring-offset-2 active:shadow-none"
      style={{
        borderColor: category.color,
        '--tw-ring-color': category.color,
      } as React.CSSProperties}
      aria-label={symbol.label}
    >
      <div className="flex items-center justify-center flex-1 w-full">
        {!imgError ? (
          <img
            src={sources[srcIndex]}
            alt={symbol.label}
            onError={() => setSrcIndex((i) => i + 1)}
            className={`w-full h-full object-cover ${symbol.customImageUrl ? 'max-h-20 rounded-lg' : 'max-h-16 object-contain'}`}
            loading="lazy"
          />
        ) : (
          <span className="text-4xl leading-none" role="img" aria-hidden>
            {symbol.emoji}
          </span>
        )}
      </div>
      <span
        className="text-[11px] font-bold leading-tight text-center text-gray-800 line-clamp-2 w-full"
        style={{ color: category.color }}
      >
        {symbol.label}
      </span>
    </motion.button>
  )
}
