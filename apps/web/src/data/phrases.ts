import type { Phrase, PhraseType } from '../types'

function p(
  id: string,
  label: string,
  spokenText: string,
  type: PhraseType
): Phrase {
  return { id, label, spokenText, type }
}

export const PHRASES: Phrase[] = [
  // ── Greetings ────────────────────────────────────────────────────────────
  p('g-hello',       'Hello!',           'Hello!',             'greeting'),
  p('g-morning',     'Good morning!',    'Good morning!',      'greeting'),
  p('g-afternoon',   'Good afternoon!',  'Good afternoon!',    'greeting'),
  p('g-night',       'Good night!',      'Good night!',        'greeting'),
  p('g-bye',         'Goodbye!',         'Goodbye!',           'greeting'),
  p('g-later',       'See you later!',   'See you later!',     'greeting'),
  p('g-howru',       'How are you?',     'How are you?',       'greeting'),
  p('g-nice',        'Nice to see you!', 'Nice to see you!',   'greeting'),

  // ── Complete phrases ──────────────────────────────────────────────────────
  p('c-break',       'I need a break',   'I need a break',     'complete'),
  p('c-done',        "I'm done",         "I'm done",           'complete'),
  p('c-dontwant',    "I don't want that","I don't want that",  'complete'),
  p('c-hurts',       'That hurts',       'That hurts',         'complete'),
  p('c-unwell',      "I don't feel well","I don't feel well",  'complete'),
  p('c-comewithme',  'Come with me',     'Come with me',       'complete'),
  p('c-wait',        'Wait for me',      'Wait for me',        'complete'),
  p('c-again',       'One more time',    'One more time',      'complete'),
  p('c-allgood',     "I'm okay",         "I'm okay",           'complete'),
  p('c-nothanks',    'No thank you',     'No thank you',       'complete'),
  p('c-yesplease',   'Yes please',       'Yes please',         'complete'),
  p('c-fun',         'That was fun!',    'That was fun!',      'complete'),

  // ── Sentence starters — spoken text ends with space for natural continuation
  p('s-iwant',       'I want…',          'I want ',            'starter'),
  p('s-ineed',       'I need…',          'I need ',            'starter'),
  p('s-canihave',    'Can I have…',      'Can I have ',        'starter'),
  p('s-letsgoto',    "Let's go to…",     "Let's go to ",       'starter'),
  p('s-ifeel',       'I feel…',          'I feel ',            'starter'),
  p('s-idontlike',   "I don't like…",    "I don't like ",      'starter'),
  p('s-helpme',      'Can you help me…', 'Can you help me ',   'starter'),
  p('s-myfav',       'My favorite is…',  'My favorite is ',    'starter'),
  p('s-ilike',       'I like…',          'I like ',            'starter'),
  p('s-whereis',     'Where is…',        'Where is ',          'starter'),
  p('s-iwantto',     'I want to…',       'I want to ',         'starter'),
  p('s-idontwant',   "I don't want…",    "I don't want ",      'starter'),
]

export const PHRASE_SECTIONS: { title: string; type: PhraseType }[] = [
  { title: 'Greetings',        type: 'greeting'  },
  { title: 'Common Phrases',   type: 'complete'  },
  { title: 'Sentence Starters', type: 'starter'  },
]

export function getPhrasesByType(type: PhraseType) {
  return PHRASES.filter((p) => p.type === type)
}
