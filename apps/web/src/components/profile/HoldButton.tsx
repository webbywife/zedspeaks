import { useRef, useState } from 'react'

/** Opens only after a 2-second hold, so a child tapping around doesn't land in the parent area. */
export function HoldButton({ onHold, children, className = '' }: { onHold: () => void; children: React.ReactNode; className?: string }) {
  const [holding, setHolding] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const start = () => {
    setHolding(true)
    timer.current = setTimeout(() => { setHolding(false); onHold() }, 2000)
  }
  const stop = () => {
    setHolding(false)
    if (timer.current) clearTimeout(timer.current)
  }
  return (
    <button onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onContextMenu={(e) => e.preventDefault()}
      className={`relative overflow-hidden select-none ${className}`}>
      <span className={`absolute inset-y-0 left-0 bg-blue-200/60 ${holding ? 'w-full transition-[width] duration-[2000ms] ease-linear' : 'w-0'}`} />
      <span className="relative flex items-center justify-center gap-2">{children}</span>
    </button>
  )
}
