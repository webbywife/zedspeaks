import type { AACSymbol, CategoryMeta, CategoryId } from '../types'

export const CATEGORIES: CategoryMeta[] = [
  { id: 'needs',     label: 'Needs',    color: '#dc2626', bgColor: '#fee2e2', borderColor: '#fca5a5' },
  { id: 'feelings',  label: 'Feelings', color: '#7c3aed', bgColor: '#ede9fe', borderColor: '#c4b5fd' },
  { id: 'food',      label: 'Food',     color: '#16a34a', bgColor: '#dcfce7', borderColor: '#86efac' },
  { id: 'people',    label: 'People',   color: '#ea580c', bgColor: '#ffedd5', borderColor: '#fdba74' },
  { id: 'places',    label: 'Places',   color: '#0891b2', bgColor: '#cffafe', borderColor: '#67e8f9' },
  { id: 'actions',   label: 'Actions',  color: '#ca8a04', bgColor: '#fef9c3', borderColor: '#fde047' },
  { id: 'phrases',   label: 'Phrases',  color: '#db2777', bgColor: '#fce7f3', borderColor: '#f9a8d4' },
  { id: 'my-photos', label: 'My Stuff', color: '#0f766e', bgColor: '#ccfbf1', borderColor: '#5eead4' },
]

export function getCategoryMeta(id: CategoryId): CategoryMeta {
  return CATEGORIES.find(c => c.id === id)!
}

// ARASAAC pictogram URL helper — images are cached by the service worker after first load
export function arasaacUrl(id: number): string {
  return `https://static.arasaac.org/pictograms/${id}/${id}_300.png`
}

export const SYMBOLS: AACSymbol[] = [
  // ── Needs ────────────────────────────────────────────────────────────────
  { id: 'eat',        label: 'Eat',        spokenText: 'eat',        arasaacId: 6456,  emoji: '🍽️', category: 'needs' },
  { id: 'drink',      label: 'Drink',      spokenText: 'drink',      arasaacId: 4483,  emoji: '🥤', category: 'needs' },
  { id: 'sleep',      label: 'Sleep',      spokenText: 'sleep',      arasaacId: 6479,  emoji: '😴', category: 'needs' },
  { id: 'bathroom',   label: 'Bathroom',   spokenText: 'bathroom',   arasaacId: 6854,  emoji: '🚽', category: 'needs' },
  { id: 'help',       label: 'Help',       spokenText: 'help',       arasaacId: 7429,  emoji: '🆘', category: 'needs' },
  { id: 'pain',       label: 'Hurt',       spokenText: 'I am hurt',  arasaacId: 5870,  emoji: '🤕', category: 'needs' },
  { id: 'more',       label: 'More',       spokenText: 'more',       arasaacId: 5508,  emoji: '➕', category: 'needs' },
  { id: 'stop',       label: 'Stop',       spokenText: 'stop',       arasaacId: 7196,  emoji: '🛑', category: 'needs' },
  { id: 'yes',        label: 'Yes',        spokenText: 'yes',        arasaacId: 5584,  emoji: '✅', category: 'needs' },
  { id: 'no',         label: 'No',         spokenText: 'no',         arasaacId: 27328, emoji: '❌', category: 'needs' },
  { id: 'please',     label: 'Please',     spokenText: 'please',     arasaacId: 8195,  emoji: '🙏', category: 'needs' },
  { id: 'thanks',     label: 'Thank you',  spokenText: 'thank you',  arasaacId: 8129,  emoji: '💙', category: 'needs' },

  // ── Feelings — illustrated with Zed's own face ───────────────────────────
  { id: 'happy',     label: 'Happy',     spokenText: 'I am happy',     arasaacId: 3196, emoji: '😊', category: 'feelings', customImageUrl: '/assets/moods/joy.png',       moodId: 'joy'       },
  { id: 'sad',       label: 'Sad',       spokenText: 'I am sad',       arasaacId: 5885, emoji: '😢', category: 'feelings', customImageUrl: '/assets/moods/sad.png',       moodId: 'sad'       },
  { id: 'angry',     label: 'Angry',     spokenText: 'I am angry',     arasaacId: 2665, emoji: '😠', category: 'feelings', customImageUrl: '/assets/moods/angry.png',     moodId: 'angry'     },
  { id: 'scared',    label: 'Scared',    spokenText: 'I am scared',    arasaacId: 7111, emoji: '😨', category: 'feelings', customImageUrl: '/assets/moods/fear.png',      moodId: 'fear'      },
  { id: 'excited',   label: 'Excited',   spokenText: 'I am excited',   arasaacId: 4697, emoji: '🤩', category: 'feelings', customImageUrl: '/assets/moods/excited.png',   moodId: 'excited'   },
  { id: 'laughing',  label: 'Laughing',  spokenText: 'I am laughing',  arasaacId: 4697, emoji: '😂', category: 'feelings', customImageUrl: '/assets/moods/laughing.png',  moodId: 'laughing'  },
  { id: 'surprised', label: 'Surprised', spokenText: 'I am surprised', arasaacId: 5855, emoji: '😲', category: 'feelings', customImageUrl: '/assets/moods/surprised.png', moodId: 'surprised' },
  { id: 'curious',   label: 'Curious',   spokenText: 'I am curious',   arasaacId: 3468, emoji: '🤔', category: 'feelings', customImageUrl: '/assets/moods/curious.png',   moodId: 'curious'   },
  { id: 'hopeful',   label: 'Hopeful',   spokenText: 'I am hopeful',   arasaacId: 3120, emoji: '🌟', category: 'feelings', customImageUrl: '/assets/moods/hopeful.png',   moodId: 'hopeful'   },
  { id: 'relaxed',   label: 'Relaxed',   spokenText: 'I am relaxed',   arasaacId: 6524, emoji: '😌', category: 'feelings', customImageUrl: '/assets/moods/relaxed.png',   moodId: 'relaxed'   },
  { id: 'disgusted', label: 'Disgusted', spokenText: 'I am disgusted', arasaacId: 6140, emoji: '🤢', category: 'feelings', customImageUrl: '/assets/moods/disgust.png',   moodId: 'disgust'   },
  { id: 'love',      label: 'Love',      spokenText: 'I love you',     arasaacId: 5540, emoji: '❤️', category: 'feelings' },

  // ── Food ─────────────────────────────────────────────────────────────────
  { id: 'apple',      label: 'Apple',     spokenText: 'apple',     arasaacId: 2497,  emoji: '🍎', category: 'food' },
  { id: 'pizza',      label: 'Pizza',     spokenText: 'pizza',     arasaacId: 5764,  emoji: '🍕', category: 'food' },
  { id: 'milk',       label: 'Milk',      spokenText: 'milk',      arasaacId: 5574,  emoji: '🥛', category: 'food' },
  { id: 'cookie',     label: 'Cookie',    spokenText: 'cookie',    arasaacId: 3693,  emoji: '🍪', category: 'food' },
  { id: 'banana',     label: 'Banana',    spokenText: 'banana',    arasaacId: 2635,  emoji: '🍌', category: 'food' },
  { id: 'bread',      label: 'Bread',     spokenText: 'bread',     arasaacId: 2699,  emoji: '🍞', category: 'food' },
  { id: 'water',      label: 'Water',     spokenText: 'water',     arasaacId: 2628,  emoji: '💧', category: 'food' },
  { id: 'juice',      label: 'Juice',     spokenText: 'juice',     arasaacId: 25391, emoji: '🧃', category: 'food' },
  { id: 'sandwich',   label: 'Sandwich',  spokenText: 'sandwich',  arasaacId: 6151,  emoji: '🥪', category: 'food' },
  { id: 'eggs',       label: 'Eggs',      spokenText: 'eggs',      arasaacId: 4529,  emoji: '🥚', category: 'food' },
  { id: 'chicken',    label: 'Chicken',   spokenText: 'chicken',   arasaacId: 3302,  emoji: '🍗', category: 'food' },
  { id: 'icecream',   label: 'Ice Cream', spokenText: 'ice cream', arasaacId: 5143,  emoji: '🍦', category: 'food' },

  // ── People ───────────────────────────────────────────────────────────────
  { id: 'me',      label: 'Me',      spokenText: 'me',      arasaacId: 18417, emoji: '🙋', category: 'people' },
  { id: 'mom',     label: 'Mom',     spokenText: 'mom',     arasaacId: 6437,  emoji: '👩', category: 'people' },
  { id: 'dad',     label: 'Dad',     spokenText: 'dad',     arasaacId: 6432,  emoji: '👨', category: 'people' },
  { id: 'friend',  label: 'Friend',  spokenText: 'friend',  arasaacId: 5470,  emoji: '👫', category: 'people' },
  { id: 'teacher', label: 'Teacher', spokenText: 'teacher', arasaacId: 6673,  emoji: '👩‍🏫', category: 'people' },
  { id: 'doctor',  label: 'Doctor',  spokenText: 'doctor',  arasaacId: 4414,  emoji: '👨‍⚕️', category: 'people' },
  { id: 'sister',  label: 'Sister',  spokenText: 'sister',  arasaacId: 6165,  emoji: '👧', category: 'people' },
  { id: 'brother', label: 'Brother', spokenText: 'brother', arasaacId: 2738,  emoji: '👦', category: 'people' },

  // ── Places ───────────────────────────────────────────────────────────────
  { id: 'home',     label: 'Home',     spokenText: 'home',     arasaacId: 7073,  emoji: '🏠', category: 'places' },
  { id: 'school',   label: 'School',   spokenText: 'school',   arasaacId: 6668,  emoji: '🏫', category: 'places' },
  { id: 'park',     label: 'Park',     spokenText: 'park',     arasaacId: 25543, emoji: '🌳', category: 'places' },
  { id: 'store',    label: 'Store',    spokenText: 'store',    arasaacId: 6748,  emoji: '🏪', category: 'places' },
  { id: 'hospital', label: 'Hospital', spokenText: 'hospital', arasaacId: 5123,  emoji: '🏥', category: 'places' },
  { id: 'car',      label: 'Car',      spokenText: 'car',      arasaacId: 3017,  emoji: '🚗', category: 'places' },
  { id: 'outside',  label: 'Outside',  spokenText: 'outside',  arasaacId: 25540, emoji: '🌤️', category: 'places' },
  { id: 'bedroom',  label: 'Bedroom',  spokenText: 'bedroom',  arasaacId: 2730,  emoji: '🛏️', category: 'places' },

  // ── Actions ──────────────────────────────────────────────────────────────
  { id: 'go',     label: 'Go',     spokenText: 'go',     arasaacId: 4690,  emoji: '🚶', category: 'actions' },
  { id: 'play',   label: 'Play',   spokenText: 'play',   arasaacId: 26498, emoji: '🎮', category: 'actions' },
  { id: 'read',   label: 'Read',   spokenText: 'read',   arasaacId: 6097,  emoji: '📖', category: 'actions' },
  { id: 'watch',  label: 'Watch',  spokenText: 'watch',  arasaacId: 6569,  emoji: '📺', category: 'actions' },
  { id: 'listen', label: 'Listen', spokenText: 'listen', arasaacId: 5569,  emoji: '👂', category: 'actions' },
  { id: 'run',    label: 'Run',    spokenText: 'run',    arasaacId: 6126,  emoji: '🏃', category: 'actions' },
  { id: 'sit',    label: 'Sit',    spokenText: 'sit',    arasaacId: 6157,  emoji: '🪑', category: 'actions' },
  { id: 'wait',   label: 'Wait',   spokenText: 'wait',   arasaacId: 38481, emoji: '⏳', category: 'actions' },
  { id: 'look',   label: 'Look',   spokenText: 'look',   arasaacId: 5541,  emoji: '👁️', category: 'actions' },
  { id: 'come',   label: 'Come',   spokenText: 'come',   arasaacId: 3330,  emoji: '👋', category: 'actions' },
  { id: 'open',   label: 'Open',   spokenText: 'open',   arasaacId: 5637,  emoji: '🔓', category: 'actions' },
  { id: 'want',   label: 'I want', spokenText: 'I want', arasaacId: 35267, emoji: '🙋', category: 'actions' },
]

export function getSymbolsByCategory(category: CategoryId): AACSymbol[] {
  return SYMBOLS.filter(s => s.category === category)
}
