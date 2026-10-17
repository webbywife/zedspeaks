// Open Mulberry symbol library (CC BY-SA 4.0, Steve Lee), imported by scripts/import_mulberry.py.
// Loaded on first use, so it never slows down app start.
export interface LibrarySymbol { w: string; c: string; g: string; f: string }

let library: LibrarySymbol[] | null = null
let loading: Promise<LibrarySymbol[]> | null = null

export function loadLibrary(): Promise<LibrarySymbol[]> {
  loading ??= fetch(`${import.meta.env.BASE_URL}symbols/index.json`)
    .then((r) => (r.ok ? r.json() : []))
    .then((d: LibrarySymbol[]) => (library = d))
    .catch(() => (library = []))
  return loading
}

export function librarySrc(s: LibrarySymbol) {
  return `${import.meta.env.BASE_URL}symbols/${s.f}`
}

/** Symbols whose word starts with `prefix`; whole-word matches first. Library must be loaded. */
export function searchLibrary(prefix: string, limit = 8): LibrarySymbol[] {
  if (!library || !prefix) return []
  const p = prefix.toLowerCase()
  const hits = library.filter((s) => s.w.toLowerCase().startsWith(p) && !/\d[ab]?$/.test(s.w))
  return hits.sort((a, b) => a.w.length - b.w.length).slice(0, limit)
}
