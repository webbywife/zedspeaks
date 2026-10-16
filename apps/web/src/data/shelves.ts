// Home tab shelves: built-in cards (by symbol id) plus the child's own photos.
export interface Shelf {
  id: string
  label: string
  starters: string[]
}

export const SHELVES: Shelf[] = [
  { id: 'toys',   label: 'My Toys',      starters: ['play', 'car', 'read'] },
  { id: 'snacks', label: 'My Snacks',    starters: ['cookie', 'juice', 'milk', 'apple', 'banana', 'icecream', 'water'] },
  { id: 'watch',  label: 'Watch & Play', starters: ['watch', 'listen', 'outside'] },
  { id: 'places', label: 'Places to Go', starters: ['park', 'store', 'home', 'school', 'car'] },
  { id: 'people', label: 'My People',    starters: ['mom', 'dad', 'sister', 'brother', 'friend', 'teacher'] },
]

export const KITCHEN_SHELF = 'kitchen'
