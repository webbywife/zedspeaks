import { AnimatePresence, motion } from 'framer-motion'
import { SymbolButton } from './SymbolButton'
import type { AACSymbol, CategoryId } from '../../types'

interface CommunicationBoardProps {
  symbols: AACSymbol[]
  currentCategory: CategoryId
  onSymbolTap: (symbol: AACSymbol) => void
}

export function CommunicationBoard({ symbols, currentCategory, onSymbolTap }: CommunicationBoardProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 p-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCategory}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="grid gap-2"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
            gridAutoRows: '1fr',
          }}
        >
          {symbols.map((symbol) => (
            <SymbolButton key={symbol.id} symbol={symbol} onTap={onSymbolTap} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
