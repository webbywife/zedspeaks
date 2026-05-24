import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import { useBoardStore } from '../../store/boardStore'
import { useTTS } from '../../hooks/useTTS'

interface VoicePreset {
  name: string
  rate: number
  pitch: number
  volume: number
  isZed?: boolean
}

const VOICE_PRESETS: VoicePreset[] = [
  { name: "Zed's Voice", rate: 0.85, pitch: 1.15, volume: 1.0, isZed: true },
  { name: 'Clear & Calm', rate: 0.75, pitch: 1.0,  volume: 1.0 },
  { name: 'Natural',      rate: 1.0,  pitch: 1.0,  volume: 1.0 },
  { name: 'Energetic',    rate: 1.1,  pitch: 1.2,  volume: 1.0 },
]

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format?: (v: number) => string
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm font-medium text-gray-700">
        <span>{label}</span>
        <span className="text-blue-700">{format ? format(value) : value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600"
      />
    </div>
  )
}

export function VoiceSettings() {
  const { voiceSettingsOpen, ttsSettings, updateTTSSettings, setVoiceSettingsOpen } =
    useBoardStore()
  const { voices } = useTTS(ttsSettings)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVoiceSettingsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setVoiceSettingsOpen])

  return (
    <AnimatePresence>
      {voiceSettingsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setVoiceSettingsOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Voice Settings</h2>
              <button
                onClick={() => setVoiceSettingsOpen(false)}
                className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 text-gray-500"
                aria-label="Close settings"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6">

              {/* Presets */}
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-700">Voice presets</p>
                <div className="grid grid-cols-2 gap-2">
                  {VOICE_PRESETS.map((preset) => {
                    const active =
                      Math.abs(ttsSettings.rate - preset.rate) < 0.01 &&
                      Math.abs(ttsSettings.pitch - preset.pitch) < 0.01
                    return (
                      <button
                        key={preset.name}
                        onClick={() =>
                          updateTTSSettings({ rate: preset.rate, pitch: preset.pitch, volume: preset.volume })
                        }
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${
                          active
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400'
                        }`}
                      >
                        {preset.isZed && <Sparkles size={14} />}
                        {preset.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Voice selector */}
              {voices.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Voice</label>
                  <select
                    value={ttsSettings.voiceURI ?? ''}
                    onChange={(e) => updateTTSSettings({ voiceURI: e.target.value || null })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">System default</option>
                    {voices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <Slider
                label="Speaking rate"
                value={ttsSettings.rate}
                min={0.3}
                max={2.0}
                step={0.1}
                onChange={(rate) => updateTTSSettings({ rate })}
                format={(v) => `${v.toFixed(1)}×`}
              />

              <Slider
                label="Pitch"
                value={ttsSettings.pitch}
                min={0.5}
                max={2.0}
                step={0.1}
                onChange={(pitch) => updateTTSSettings({ pitch })}
                format={(v) => v.toFixed(1)}
              />

              <Slider
                label="Volume"
                value={ttsSettings.volume}
                min={0.1}
                max={1.0}
                step={0.05}
                onChange={(volume) => updateTTSSettings({ volume })}
                format={(v) => `${Math.round(v * 100)}%`}
              />

              {/* Auto-speak toggle */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-medium text-gray-700">Auto-speak on tap</p>
                  <p className="text-xs text-gray-500">Speak immediately instead of building a sentence</p>
                </div>
                <button
                  role="switch"
                  aria-checked={ttsSettings.autoSpeak}
                  onClick={() => updateTTSSettings({ autoSpeak: !ttsSettings.autoSpeak })}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    ttsSettings.autoSpeak ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      ttsSettings.autoSpeak ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center">
                Settings are saved automatically
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
