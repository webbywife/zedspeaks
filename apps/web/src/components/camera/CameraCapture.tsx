import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, X, Check, RefreshCw } from 'lucide-react'
import { captureAndResize } from '../../hooks/useCustomSymbols'

interface CameraCaptureProps {
  onSave: (label: string, imageData: string) => void
  onClose: () => void
}

export function CameraCapture({ onSave, onClose }: CameraCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [label, setLabel] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setProcessing(true)
    try {
      const data = await captureAndResize(file)
      setPreview(data)
    } finally {
      setProcessing(false)
      // Reset input so the same photo can be retaken
      e.target.value = ''
    }
  }

  const handleSave = () => {
    if (!preview || !label.trim()) return
    onSave(label.trim(), preview)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-gray-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 text-white shrink-0">
        <h2 className="text-lg font-bold">Add a Photo</h2>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10">
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-4 gap-4 overflow-y-auto pb-6">
        {/* Photo area */}
        <div
          className="w-full max-w-xs aspect-square rounded-3xl overflow-hidden border-4 border-dashed border-gray-600 flex items-center justify-center bg-gray-800 cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          {processing ? (
            <RefreshCw size={48} className="text-gray-400 animate-spin" />
          ) : preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-400 p-6 text-center">
              <Camera size={56} />
              <p className="text-base font-semibold">Tap to take a photo</p>
              <p className="text-xs">or choose from your library</p>
            </div>
          )}
        </div>

        {/* Hidden file input — capture="environment" opens back camera on mobile */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFile}
          className="sr-only"
        />

        {preview && (
          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
          >
            <RefreshCw size={14} /> Retake
          </button>
        )}

        {/* Label input */}
        <div className="w-full max-w-xs flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-300">
            What is this called?
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="e.g. My dog Max, Favorite cup…"
            maxLength={30}
            className="w-full rounded-2xl px-4 py-3 text-base bg-gray-800 text-white border-2 border-gray-600 focus:border-teal-400 focus:outline-none placeholder:text-gray-500"
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!preview || !label.trim()}
          className="flex items-center gap-2 w-full max-w-xs justify-center py-4 rounded-2xl bg-teal-500 text-white font-bold text-base disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-transform"
        >
          <Check size={20} />
          Add to My Stuff
        </button>
      </div>
    </motion.div>
  )
}
