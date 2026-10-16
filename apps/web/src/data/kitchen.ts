// Mom's Kitchen. Every say('…') string here is pre-recorded by scripts/make_voice.py.
const say = (s: string) => s

export const ORDER_START = say('Mom, can you cook')
export const ORDER_END = say('for me, please?')
export const ORDER_DONE = say('Thank you, Mom!')

/** Built-in dishes shown until the parent adds their own photos */
export const STARTER_DISHES = ['chicken', 'eggs', 'sandwich', 'pizza', 'bread']

// Common home dishes, recorded so a parent's dish with the same name speaks in the app voice
export const RECORDED_DISHES = [
  say('chicken adobo'), say('adobo'), say('sinigang'), say('fried chicken'), say('spaghetti'),
  say('pancit'), say('fried rice'), say('hotdog'), say('fried egg'), say('pancakes'),
  say('nuggets'), say('tinola'), say('burger'), say('rice'), say('soup'), say('noodles'),
]
