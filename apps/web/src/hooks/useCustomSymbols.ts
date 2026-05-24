import { useState, useEffect, useCallback } from 'react'
import type { CustomSymbol } from '../types'

const DB_NAME = 'zedspeaks'
const DB_VERSION = 1
const STORE = 'custom-symbols'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function dbOp<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode)
        const req = fn(tx.objectStore(STORE))
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
      })
  )
}

/** Resize + square-crop an image File to a compact data URL */
export async function captureAndResize(file: File, size = 300): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = (ev) => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')!
        // Centre-crop to square
        const minDim = Math.min(img.width, img.height)
        const sx = (img.width - minDim) / 2
        const sy = (img.height - minDim) / 2
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.src = ev.target!.result as string
    }
    reader.readAsDataURL(file)
  })
}

export function useCustomSymbols() {
  const [symbols, setSymbols] = useState<CustomSymbol[]>([])

  useEffect(() => {
    dbOp<CustomSymbol[]>('readonly', (s) => s.getAll()).then(setSymbols).catch(console.error)
  }, [])

  const save = useCallback(async (label: string, imageData: string): Promise<CustomSymbol> => {
    const sym: CustomSymbol = {
      id: crypto.randomUUID(),
      label,
      imageData,
      createdAt: Date.now(),
    }
    await dbOp('readwrite', (s) => s.put(sym))
    setSymbols((prev) => [sym, ...prev])
    return sym
  }, [])

  const remove = useCallback(async (id: string) => {
    await dbOp('readwrite', (s) => s.delete(id))
    setSymbols((prev) => prev.filter((s) => s.id !== id))
  }, [])

  return { symbols, save, remove }
}
