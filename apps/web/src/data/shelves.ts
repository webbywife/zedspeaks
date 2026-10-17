// Home tab shelves: built-in cards (by symbol id) plus the child's own photos.
export interface Shelf {
  id: string
  label: string
  starters: string[]
}

export const SHELVES: Shelf[] = [
  { id: 'needs',  label: 'What I Need',  starters: ['bathroom', 'water', 'help', 'hug', 'break', 'sleep', 'washhands', 'brushteeth', 'bath', 'dress'] },
  { id: 'toys',   label: 'My Toys',      starters: ['blocks', 'toycars', 'car', 'play', 'read', 'bike'] },
  { id: 'snacks', label: 'My Snacks',    starters: ['cookie', 'juice', 'milk', 'apple', 'banana', 'icecream', 'water', 'mango', 'watermelon', 'orange', 'grapes', 'crackers', 'candy', 'cake', 'chocolate', 'yogurt'] },
  { id: 'meals',  label: 'My Meals',     starters: ['rice', 'chicken', 'eggs', 'noodles', 'soup', 'spaghetti', 'burger', 'hotdog', 'pancakes', 'fish', 'cereal', 'sandwich', 'pizza'] },
  { id: 'watch',  label: 'Watch & Play', starters: ['watch', 'listen', 'music', 'outside', 'dance', 'swim', 'jump', 'walk', 'cook'] },
  { id: 'places', label: 'Places to Go', starters: ['park', 'playground', 'beach', 'pool', 'mall', 'restaurant', 'church', 'store', 'home', 'school', 'grandparents'] },
  { id: 'people', label: 'My People',    starters: ['mom', 'dad', 'sister', 'brother', 'friend', 'teacher'] },
]

export const KITCHEN_SHELF = 'kitchen'
