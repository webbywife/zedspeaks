import type { AACSymbol, CategoryMeta, CategoryId } from '../types'
import { ZS_AVAILABLE } from './zsAvailable'

export const CATEGORIES: CategoryMeta[] = [
  { id: 'needs',     label: 'Needs',    color: 'var(--color-pink-600)', bgColor: '#fee2e2', borderColor: '#fca5a5' },
  { id: 'body',      label: 'Body',     color: 'var(--color-pink-600)', bgColor: '#ffe4e6', borderColor: '#fda4af' },
  { id: 'feelings',  label: 'Feelings', color: 'var(--color-pink-600)', bgColor: '#ede9fe', borderColor: '#c4b5fd' },
  { id: 'food',      label: 'Food',     color: 'var(--color-pink-600)', bgColor: '#dcfce7', borderColor: '#86efac' },
  { id: 'people',    label: 'People',   color: 'var(--color-pink-600)', bgColor: '#ffedd5', borderColor: '#fdba74' },
  { id: 'places',    label: 'Places',   color: 'var(--color-pink-600)', bgColor: '#cffafe', borderColor: '#67e8f9' },
  { id: 'actions',   label: 'Actions',  color: 'var(--color-pink-600)', bgColor: '#fef9c3', borderColor: '#fde047' },
  { id: 'phrases',   label: 'Phrases',  color: 'var(--color-pink-600)', bgColor: '#fce7f3', borderColor: '#f9a8d4' },
  { id: 'my-photos', label: 'My Stuff', color: 'var(--color-pink-600)', bgColor: '#ccfbf1', borderColor: '#5eead4' },
]

export function getCategoryMeta(id: CategoryId): CategoryMeta {
  return CATEGORIES.find(c => c.id === id)!
}

import { PHOTO_CREDITS } from './photoCredits'

/** A starter card's picture: a credited Pexels photo when we have one, else our icon */
// Card id -> our own generated picture (scripts/make_symbols.py → public/symbols/zs-<name>.webp)
const ZS_PICTURES: Record<string, string> = {
  car: 'car', toycars: 'toy-car', blocks: 'building-blocks', play: 'video-game-controller',
  watch: 'television', listen: 'headphones', home: 'house', store: 'shopping-cart', outside: 'tree',
  cookie: 'cookie', banana: 'banana', icecream: 'ice-cream', pizza: 'pizza-slice', sandwich: 'sandwich',
  bread: 'bread', eggs: 'fried-egg', sleep: 'bed', read: 'open-book',
}

/** Our generated picture for a card, if there is one */
export function pictureUrl(id: string): string | null {
  // A drawing saved under the card id itself (scripts/words/talk.txt) needs no entry above
  const name = ZS_PICTURES[id] ?? id
  return ZS_AVAILABLE.has(name) ? `${import.meta.env.BASE_URL}symbols/zs-${name}.webp` : null
}

// One look everywhere: our drawing first. A stock photo only stands in until its drawing is made.
// (Family photos are separate: they always come first on their own cards.)
export function cardImage(id: string): { src: string; photo: boolean } {
  const drawing = pictureUrl(id)
  if (drawing) return { src: drawing, photo: false }
  if (id in PHOTO_CREDITS) return { src: `${import.meta.env.BASE_URL}photos/${id}.jpg`, photo: true }
  return { src: iconUrl(id), photo: false }
}

// ZedSpeaks icon set (scripts/make_icons.py → public/icons/)
export function iconUrl(id: string): string {
  return `${import.meta.env.BASE_URL}icons/${id}.svg`
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

  { id: 'hug', label: 'Hug', spokenText: 'hug', arasaacId: 0, emoji: '🤗', category: 'needs' },
  { id: 'break', label: 'Break', spokenText: 'break', arasaacId: 0, emoji: '✋', category: 'needs' },
  { id: 'cold', label: 'Cold', spokenText: 'I am cold', arasaacId: 0, emoji: '🥶', category: 'needs' },
  { id: 'quiet', label: 'Quiet', spokenText: 'quiet', arasaacId: 0, emoji: '🤫', category: 'needs' },
  { id: 'tired', label: 'Tired', spokenText: 'I am tired', arasaacId: 0, emoji: '🥱', category: 'needs' },
  { id: 'washhands', label: 'Wash hands', spokenText: 'wash my hands', arasaacId: 0, emoji: '🧼', category: 'needs' },
  { id: 'brushteeth', label: 'Brush teeth', spokenText: 'brush my teeth', arasaacId: 0, emoji: '🪥', category: 'needs' },
  { id: 'bath', label: 'Bath', spokenText: 'bath', arasaacId: 0, emoji: '🛁', category: 'needs' },
  { id: 'dress', label: 'Get dressed', spokenText: 'get dressed', arasaacId: 0, emoji: '👕', category: 'needs' },
  // ── Body and health: each card says a whole sentence ─────────────────────
  { id: 'head', label: 'Head', spokenText: 'My head hurts', arasaacId: 0, emoji: '🤕', category: 'body' },
  { id: 'tummy', label: 'Tummy', spokenText: 'My tummy hurts', arasaacId: 0, emoji: '🤢', category: 'body' },
  { id: 'tooth', label: 'Tooth', spokenText: 'My tooth hurts', arasaacId: 0, emoji: '🦷', category: 'body' },
  { id: 'ear', label: 'Ear', spokenText: 'My ear hurts', arasaacId: 0, emoji: '👂', category: 'body' },
  { id: 'eye', label: 'Eye', spokenText: 'My eye hurts', arasaacId: 0, emoji: '👁️', category: 'body' },
  { id: 'throat', label: 'Throat', spokenText: 'My throat hurts', arasaacId: 0, emoji: '😣', category: 'body' },
  { id: 'arm', label: 'Arm', spokenText: 'My arm hurts', arasaacId: 0, emoji: '💪', category: 'body' },
  { id: 'leg', label: 'Leg', spokenText: 'My leg hurts', arasaacId: 0, emoji: '🦵', category: 'body' },
  { id: 'foot', label: 'Foot', spokenText: 'My foot hurts', arasaacId: 0, emoji: '🦶', category: 'body' },
  { id: 'hand', label: 'Hand', spokenText: 'My hand hurts', arasaacId: 0, emoji: '✋', category: 'body' },
  { id: 'back', label: 'Back', spokenText: 'My back hurts', arasaacId: 0, emoji: '😣', category: 'body' },
  { id: 'nose', label: 'Nose', spokenText: 'My nose hurts', arasaacId: 0, emoji: '👃', category: 'body' },
  { id: 'sick', label: 'Sick', spokenText: 'I feel sick', arasaacId: 0, emoji: '🤒', category: 'body' },
  { id: 'dizzy', label: 'Dizzy', spokenText: 'I feel dizzy', arasaacId: 0, emoji: '😵', category: 'body' },
  { id: 'fever', label: 'Fever', spokenText: 'I think I have a fever', arasaacId: 0, emoji: '🤒', category: 'body' },
  { id: 'cough', label: 'Cough', spokenText: 'I have a cough', arasaacId: 0, emoji: '😷', category: 'body' },
  { id: 'runnynose', label: 'Runny nose', spokenText: 'I have a runny nose', arasaacId: 0, emoji: '🤧', category: 'body' },
  { id: 'itchy', label: 'Itchy', spokenText: 'I feel itchy', arasaacId: 0, emoji: '😖', category: 'body' },
  { id: 'bandage', label: 'Bandage', spokenText: 'I need a bandage', arasaacId: 0, emoji: '🩹', category: 'body' },
  { id: 'throwup', label: 'Throw up', spokenText: 'I think I am going to throw up', arasaacId: 0, emoji: '🤮', category: 'body' },
  { id: 'chest', label: 'Chest', spokenText: 'My chest hurts', arasaacId: 0, emoji: '💔', category: 'body' },
  { id: 'breathe', label: 'Breathing', spokenText: 'I can\'t breathe well', arasaacId: 0, emoji: '😮‍💨', category: 'body' },
  { id: 'neck', label: 'Neck', spokenText: 'My neck hurts', arasaacId: 0, emoji: '😣', category: 'body' },
  { id: 'knee', label: 'Knee', spokenText: 'My knee hurts', arasaacId: 0, emoji: '🦵', category: 'body' },
  { id: 'fingers', label: 'Finger', spokenText: 'My finger hurts', arasaacId: 0, emoji: '☝️', category: 'body' },
  { id: 'mouth', label: 'Mouth', spokenText: 'My mouth hurts', arasaacId: 0, emoji: '👄', category: 'body' },
  { id: 'skin', label: 'Rash', spokenText: 'My skin has a rash', arasaacId: 0, emoji: '🔴', category: 'body' },
  { id: 'bug', label: 'Bug bite', spokenText: 'A bug bit me', arasaacId: 0, emoji: '🦟', category: 'body' },
  { id: 'burn', label: 'Burn', spokenText: 'I burned myself', arasaacId: 0, emoji: '🔥', category: 'body' },
  { id: 'bump', label: 'Bump', spokenText: 'I bumped my head', arasaacId: 0, emoji: '🤕', category: 'body' },
  { id: 'fell', label: 'Fell', spokenText: 'I fell down', arasaacId: 0, emoji: '🤸', category: 'body' },
  { id: 'pee', label: 'Pee', spokenText: 'I need to pee', arasaacId: 0, emoji: '🚽', category: 'body' },
  { id: 'poop', label: 'Poop', spokenText: 'I need to poop', arasaacId: 0, emoji: '🚽', category: 'body' },
  { id: 'accident', label: 'Accident', spokenText: 'I had an accident', arasaacId: 0, emoji: '💧', category: 'body' },
  { id: 'period', label: 'Period', spokenText: 'I have my period', arasaacId: 0, emoji: '🩸', category: 'body' },
  { id: 'noisy', label: 'Too loud', spokenText: 'It is too loud', arasaacId: 0, emoji: '🙉', category: 'body' },
  { id: 'bright', label: 'Too bright', spokenText: 'It is too bright', arasaacId: 0, emoji: '😎', category: 'body' },
  { id: 'tight', label: 'Too tight', spokenText: 'My shoes are too tight', arasaacId: 0, emoji: '👟', category: 'body' },
  { id: 'tag', label: 'Scratchy clothes', spokenText: 'My clothes are itchy', arasaacId: 0, emoji: '👕', category: 'body' },
  { id: 'hungry', label: 'Hungry', spokenText: 'I am hungry', arasaacId: 0, emoji: '🍽️', category: 'body' },
  { id: 'thirsty', label: 'Thirsty', spokenText: 'I am thirsty', arasaacId: 0, emoji: '🥤', category: 'body' },
  { id: 'nosleep', label: 'Can\'t sleep', spokenText: 'I can\'t sleep', arasaacId: 0, emoji: '🌙', category: 'body' },
  { id: 'baddream', label: 'Bad dream', spokenText: 'I had a bad dream', arasaacId: 0, emoji: '⛈️', category: 'body' },
  { id: 'alittle', label: 'A little', spokenText: 'It hurts a little', arasaacId: 0, emoji: '🔸', category: 'body' },
  { id: 'alot', label: 'A lot', spokenText: 'It hurts a lot', arasaacId: 0, emoji: '🔴', category: 'body' },
  { id: 'here', label: 'Here', spokenText: 'It hurts here', arasaacId: 0, emoji: '👉', category: 'body' },
  { id: 'doctor2', label: 'Doctor', spokenText: 'I need to see a doctor', arasaacId: 0, emoji: '🩺', category: 'body' },
  { id: 'hurtme', label: 'Someone hurt me', spokenText: 'Someone hurt me', arasaacId: 0, emoji: '😢', category: 'body' },
  // ── Feelings — illustrated with Zed's own face ───────────────────────────
  { id: 'happy',     label: 'Happy',     spokenText: 'I am happy',     arasaacId: 3196, emoji: '😊', category: 'feelings', customImageUrl: '/assets/characters/boy/happy.webp',       moodId: 'joy'       },
  { id: 'sad',       label: 'Sad',       spokenText: 'I am sad',       arasaacId: 5885, emoji: '😢', category: 'feelings', customImageUrl: '/assets/characters/boy/sad.webp',       moodId: 'sad'       },
  { id: 'angry',     label: 'Angry',     spokenText: 'I am angry',     arasaacId: 2665, emoji: '😠', category: 'feelings', customImageUrl: '/assets/characters/boy/angry.webp',     moodId: 'angry'     },
  { id: 'scared',    label: 'Scared',    spokenText: 'I am scared',    arasaacId: 7111, emoji: '😨', category: 'feelings', customImageUrl: '/assets/characters/boy/scared.webp',      moodId: 'fear'      },
  { id: 'excited',   label: 'Excited',   spokenText: 'I am excited',   arasaacId: 4697, emoji: '🤩', category: 'feelings', customImageUrl: '/assets/characters/boy/excited.webp',   moodId: 'excited'   },
  { id: 'laughing',  label: 'Laughing',  spokenText: 'I am laughing',  arasaacId: 4697, emoji: '😂', category: 'feelings', customImageUrl: '/assets/characters/boy/goofy.webp',  moodId: 'laughing'  },
  { id: 'surprised', label: 'Surprised', spokenText: 'I am surprised', arasaacId: 5855, emoji: '😲', category: 'feelings', customImageUrl: '/assets/characters/boy/surprised.webp', moodId: 'surprised' },
  { id: 'curious',   label: 'Curious',   spokenText: 'I am curious',   arasaacId: 3468, emoji: '🤔', category: 'feelings', customImageUrl: '/assets/characters/boy/thinking.webp',   moodId: 'curious'   },
  { id: 'hopeful',   label: 'Hopeful',   spokenText: 'I am hopeful',   arasaacId: 3120, emoji: '🌟', category: 'feelings', customImageUrl: '/assets/characters/boy/happy.webp',   moodId: 'hopeful'   },
  { id: 'relaxed',   label: 'Relaxed',   spokenText: 'I am relaxed',   arasaacId: 6524, emoji: '😌', category: 'feelings', customImageUrl: '/assets/characters/boy/bored.webp',   moodId: 'relaxed'   },
  { id: 'disgusted', label: 'Disgusted', spokenText: 'I am disgusted', arasaacId: 6140, emoji: '🤢', category: 'feelings', customImageUrl: '/assets/characters/boy/determined.webp',   moodId: 'disgust'   },
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

  { id: 'rice', label: 'Rice', spokenText: 'rice', arasaacId: 0, emoji: '🍚', category: 'food' },
  { id: 'noodles', label: 'Noodles', spokenText: 'noodles', arasaacId: 0, emoji: '🍜', category: 'food' },
  { id: 'soup', label: 'Soup', spokenText: 'soup', arasaacId: 0, emoji: '🍲', category: 'food' },
  { id: 'spaghetti', label: 'Spaghetti', spokenText: 'spaghetti', arasaacId: 0, emoji: '🍝', category: 'food' },
  { id: 'burger', label: 'Burger', spokenText: 'burger', arasaacId: 0, emoji: '🍔', category: 'food' },
  { id: 'hotdog', label: 'Hotdog', spokenText: 'hotdog', arasaacId: 0, emoji: '🌭', category: 'food' },
  { id: 'pancakes', label: 'Pancakes', spokenText: 'pancakes', arasaacId: 0, emoji: '🥞', category: 'food' },
  { id: 'fish', label: 'Fish', spokenText: 'fish', arasaacId: 0, emoji: '🐟', category: 'food' },
  { id: 'cereal', label: 'Cereal', spokenText: 'cereal', arasaacId: 0, emoji: '🥣', category: 'food' },
  { id: 'mango', label: 'Mango', spokenText: 'mango', arasaacId: 0, emoji: '🥭', category: 'food' },
  { id: 'watermelon', label: 'Watermelon', spokenText: 'watermelon', arasaacId: 0, emoji: '🍉', category: 'food' },
  { id: 'orange', label: 'Orange', spokenText: 'orange', arasaacId: 0, emoji: '🍊', category: 'food' },
  { id: 'grapes', label: 'Grapes', spokenText: 'grapes', arasaacId: 0, emoji: '🍇', category: 'food' },
  { id: 'crackers', label: 'Crackers', spokenText: 'crackers', arasaacId: 0, emoji: '🍘', category: 'food' },
  { id: 'candy', label: 'Candy', spokenText: 'candy', arasaacId: 0, emoji: '🍬', category: 'food' },
  { id: 'cake', label: 'Cake', spokenText: 'cake', arasaacId: 0, emoji: '🍰', category: 'food' },
  { id: 'chocolate', label: 'Chocolate', spokenText: 'chocolate', arasaacId: 0, emoji: '🍫', category: 'food' },
  { id: 'yogurt', label: 'Yogurt', spokenText: 'yogurt', arasaacId: 0, emoji: '🥛', category: 'food' },
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

  { id: 'playground', label: 'Playground', spokenText: 'playground', arasaacId: 0, emoji: '🛝', category: 'places' },
  { id: 'beach', label: 'Beach', spokenText: 'beach', arasaacId: 0, emoji: '🏖️', category: 'places' },
  { id: 'pool', label: 'Pool', spokenText: 'pool', arasaacId: 0, emoji: '🏊', category: 'places' },
  { id: 'mall', label: 'Mall', spokenText: 'mall', arasaacId: 0, emoji: '🏬', category: 'places' },
  { id: 'church', label: 'Church', spokenText: 'church', arasaacId: 0, emoji: '⛪', category: 'places' },
  { id: 'restaurant', label: 'Restaurant', spokenText: 'restaurant', arasaacId: 0, emoji: '🍽️', category: 'places' },
  { id: 'kitchen', label: 'Kitchen', spokenText: 'kitchen', arasaacId: 0, emoji: '🍳', category: 'places' },
  { id: 'livingroom', label: 'Living room', spokenText: 'living room', arasaacId: 0, emoji: '🛋️', category: 'places' },
  { id: 'grandparents', label: 'Grandparents', spokenText: 'grandparents', arasaacId: 0, emoji: '🏡', category: 'places' },
  // ── Actions ──────────────────────────────────────────────────────────────
  { id: 'go',     label: 'Go',     spokenText: 'go',     arasaacId: 4690,  emoji: '🚶', category: 'actions' },
  { id: 'play',   label: 'Play',   spokenText: 'play',   arasaacId: 26498, emoji: '🎮', category: 'actions' },
  { id: 'blocks',      label: 'Blocks',     spokenText: 'building blocks',        arasaacId: 0,     emoji: '🧱', category: 'actions' },
  { id: 'toycars',    label: 'Toy cars',  spokenText: 'toy cars', arasaacId: 0, emoji: '🚗', category: 'actions' },
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
  { id: 'swim', label: 'Swim', spokenText: 'swim', arasaacId: 0, emoji: '🏊', category: 'actions' },
  { id: 'dance', label: 'Dance', spokenText: 'dance', arasaacId: 0, emoji: '💃', category: 'actions' },
  { id: 'jump', label: 'Jump', spokenText: 'jump', arasaacId: 0, emoji: '🤸', category: 'actions' },
  { id: 'walk', label: 'Walk', spokenText: 'walk', arasaacId: 0, emoji: '🚶', category: 'actions' },
  { id: 'bike', label: 'Bike', spokenText: 'ride my bike', arasaacId: 0, emoji: '🚲', category: 'actions' },
  { id: 'cook', label: 'Cook', spokenText: 'cook', arasaacId: 0, emoji: '🍳', category: 'actions' },
  { id: 'give', label: 'Give', spokenText: 'give', arasaacId: 0, emoji: '🎁', category: 'actions' },
  { id: 'music', label: 'Music', spokenText: 'music', arasaacId: 0, emoji: '🎵', category: 'actions' },
  { id: 'doll', label: 'Doll', spokenText: 'doll', arasaacId: 0, emoji: '🪆', category: 'actions' },
  { id: 'dollhouse', label: 'Dollhouse', spokenText: 'dollhouse', arasaacId: 0, emoji: '🏠', category: 'actions' },
  { id: 'teaset', label: 'Tea set', spokenText: 'tea set', arasaacId: 0, emoji: '🫖', category: 'actions' },
  { id: 'bunny', label: 'Bunny', spokenText: 'bunny', arasaacId: 0, emoji: '🐰', category: 'actions' },
  { id: 'unicorn', label: 'Unicorn', spokenText: 'unicorn', arasaacId: 0, emoji: '🦄', category: 'actions' },
  { id: 'hairclip', label: 'Hair bow', spokenText: 'hair bow', arasaacId: 0, emoji: '🎀', category: 'actions' },
  { id: 'bracelet', label: 'Bracelet', spokenText: 'bracelet', arasaacId: 0, emoji: '📿', category: 'actions' },
  { id: 'stickers', label: 'Stickers', spokenText: 'stickers', arasaacId: 0, emoji: '⭐', category: 'actions' },
  { id: 'jumprope', label: 'Jump rope', spokenText: 'jump rope', arasaacId: 0, emoji: '🪢', category: 'actions' },
  { id: 'playkitchen', label: 'Play kitchen', spokenText: 'play kitchen', arasaacId: 0, emoji: '🍳', category: 'actions' },
  { id: 'dressup', label: 'Dress-up', spokenText: 'dress-up', arasaacId: 0, emoji: '👗', category: 'actions' },
  { id: 'playdough', label: 'Play dough', spokenText: 'play dough', arasaacId: 0, emoji: '🎨', category: 'actions' },
  { id: 'bubbles', label: 'Bubbles', spokenText: 'bubbles', arasaacId: 0, emoji: '🫧', category: 'actions' },
  { id: 'kite', label: 'Kite', spokenText: 'kite', arasaacId: 0, emoji: '🪁', category: 'actions' },
  { id: 'stroller', label: 'Doll stroller', spokenText: 'doll stroller', arasaacId: 0, emoji: '🛒', category: 'actions' },
]

export function getSymbolsByCategory(category: CategoryId): AACSymbol[] {
  return SYMBOLS.filter(s => s.category === category)
}
