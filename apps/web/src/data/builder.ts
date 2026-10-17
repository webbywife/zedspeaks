// Build tab: mix-and-match sentence pieces. Pick a starter, then endings and joining words.
// Every say('…') string here is pre-recorded by scripts/make_voice.py. Generic items only, no brands.
const say = (s: string) => s

export interface Piece { text: string; emoji: string }
export interface PieceGroup { id: string; label: string; emoji: string; pieces: Piece[] }

const g = (id: string, label: string, emoji: string, items: [string, string][]): PieceGroup =>
  ({ id, label, emoji, pieces: items.map(([text, emoji]) => ({ text, emoji })) })

export const STARTERS: Piece[] = [
  [say('I want'), '🙋'], [say('I need'), '❗'], [say('I like'), '👍'], [say("I don't like"), '👎'],
  [say("I don't want"), '🙅'], [say('I feel'), '💭'], [say('I am'), '🧒'], [say('Can I'), '🙏'],
  [say('Can you'), '🤲'], [say("Let's"), '👉'], [say('I want to'), '🏃'], [say('Where is'), '🔍'],
  [say('I see'), '👀'], [say('Give me'), '🤲'], [say('Help me'), '🆘'], [say('It is'), '☝️'],
  [say('I have'), '✋'], [say('I love'), '❤️'], [say('Look at'), '👁️'], [say('Is it time for'), '⏰'],
].map(([text, emoji]) => ({ text, emoji }))

export const JOINERS: Piece[] = [
  [say('and'), '➕'], [say('with'), '🤝'], [say('please'), '🙏'], [say('more'), '➕'], [say('not'), '🚫'],
  [say('now'), '⏱️'], [say('later'), '⏳'], [say('again'), '🔁'], [say('too'), '✌️'], [say('thank you'), '😊'],
].map(([text, emoji]) => ({ text, emoji }))

export const GROUPS: PieceGroup[] = [
  g('food', 'Food', '🍽️', [
    [say('rice'), '🍚'], [say('chicken'), '🍗'], [say('fried chicken'), '🍗'], [say('fish'), '🐟'], [say('eggs'), '🍳'],
    [say('noodles'), '🍜'], [say('spaghetti'), '🍝'], [say('pizza'), '🍕'], [say('a burger'), '🍔'], [say('a hotdog'), '🌭'],
    [say('fries'), '🍟'], [say('bread'), '🍞'], [say('a sandwich'), '🥪'], [say('soup'), '🍲'], [say('pancakes'), '🥞'],
    [say('cereal'), '🥣'], [say('an apple'), '🍎'], [say('a banana'), '🍌'], [say('mango'), '🥭'], [say('grapes'), '🍇'],
    [say('watermelon'), '🍉'], [say('ice cream'), '🍦'], [say('cake'), '🍰'], [say('cookies'), '🍪'], [say('chocolate'), '🍫'],
    [say('chips'), '🥔'], [say('candy'), '🍬'], [say('a snack'), '🥨'], [say('breakfast'), '🍳'], [say('lunch'), '🍱'],
    [say('dinner'), '🍽️'],
  ]),
  g('drinks', 'Drinks', '🥤', [
    [say('water'), '💧'], [say('milk'), '🥛'], [say('juice'), '🧃'], [say('chocolate milk'), '🍫'], [say('a cold drink'), '🧊'],
    [say('a shake'), '🥤'], [say('hot chocolate'), '☕'],
  ]),
  g('play', 'Toys & play', '🧸', [
    [say('my toys'), '🧸'], [say('my toy cars'), '🚗'], [say('building blocks'), '🧱'], [say('a ball'), '⚽'],
    [say('a puzzle'), '🧩'], [say('my tablet'), '📱'], [say('the phone'), '📱'], [say('videos'), '▶️'],
    [say('a game'), '🎮'], [say('a racing game'), '🏎️'], [say('coloring'), '🖍️'], [say('drawing'), '✏️'],
    [say('music'), '🎵'], [say('a book'), '📖'], [say('the TV'), '📺'], [say('cartoons'), '📺'], [say('bubbles'), '🫧'],
    [say('the swing'), '🛝'], [say('the slide'), '🛝'], [say('my bike'), '🚲'],
  ]),
  g('actions', 'Things to do', '🏃', [
    [say('play'), '🎲'], [say('eat'), '🍽️'], [say('drink'), '🥤'], [say('sleep'), '😴'], [say('rest'), '🛋️'],
    [say('go out'), '🚪'], [say('go home'), '🏠'], [say('go to the bathroom'), '🚽'], [say('take a bath'), '🛁'],
    [say('brush my teeth'), '🪥'], [say('get dressed'), '👕'], [say('watch'), '👀'], [say('listen'), '👂'],
    [say('read'), '📖'], [say('draw'), '✏️'], [say('write'), '✍️'], [say('swim'), '🏊'], [say('run'), '🏃'],
    [say('walk'), '🚶'], [say('ride in the car'), '🚗'], [say('cook'), '🍳'], [say('shop'), '🛒'], [say('order food'), '🛵'],
    [say('call'), '📞'], [say('hug'), '🤗'], [say('stop'), '✋'], [say('wait'), '⏳'], [say('be alone'), '🧘'],
    [say('turn it off'), '📴'], [say('turn it on'), '🔛'], [say('open it'), '📦'], [say('close it'), '🚪'],
  ]),
  g('places', 'Places', '📍', [
    [say('home'), '🏠'], [say('school'), '🏫'], [say('the park'), '🌳'], [say('the mall'), '🏬'], [say('the store'), '🛒'],
    [say('the beach'), '🏖️'], [say('the pool'), '🏊'], [say('church'), '⛪'], [say('the doctor'), '🩺'],
    [say('the hospital'), '🏥'], [say('grandma’s house'), '🏡'], [say('the car'), '🚗'], [say('outside'), '☀️'],
    [say('my room'), '🛏️'], [say('the bathroom'), '🚽'], [say('the kitchen'), '🍳'], [say('a restaurant'), '🍽️'],
  ]),
  g('people', 'People', '👨‍👩‍👦', [
    [say('Mom'), '👩'], [say('Dad'), '👨'], [say('my brother'), '👦'], [say('my sister'), '👧'], [say('Grandma'), '👵'],
    [say('Grandpa'), '👴'], [say('my teacher'), '🧑‍🏫'], [say('my friend'), '🧒'], [say('my therapist'), '🧑‍⚕️'],
    [say('the doctor'), '🧑‍⚕️'], [say('everyone'), '👨‍👩‍👦'], [say('you'), '👉'], [say('me'), '🙋'],
  ]),
  g('feelings', 'Feelings', '😊', [
    [say('happy'), '😊'], [say('sad'), '😢'], [say('angry'), '😠'], [say('scared'), '😨'], [say('tired'), '😴'],
    [say('sleepy'), '🥱'], [say('hungry'), '🍽️'], [say('thirsty'), '🥤'], [say('sick'), '🤒'], [say('bored'), '😐'],
    [say('excited'), '🤩'], [say('calm'), '😌'], [say('worried'), '😟'], [say('frustrated'), '😤'], [say('too loud'), '🔊'],
    [say('too hot'), '🥵'], [say('too cold'), '🥶'], [say('okay'), '👌'], [say('proud'), '🌟'], [say('silly'), '🤪'],
  ]),
  g('body', 'My body', '🧍', [
    [say('my head'), '🤕'], [say('my tummy'), '🤢'], [say('my teeth'), '🦷'], [say('my ear'), '👂'], [say('my eyes'), '👁️'],
    [say('my throat'), '😷'], [say('my hand'), '✋'], [say('my leg'), '🦵'], [say('my foot'), '🦶'], [say('my back'), '🧍'],
    [say('it hurts'), '🩹'], [say('it itches'), '🦟'],
  ]),
  g('things', 'Things', '🎒', [
    [say('my bag'), '🎒'], [say('my shoes'), '👟'], [say('my clothes'), '👕'], [say('my blanket'), '🛏️'],
    [say('my pillow'), '🛌'], [say('a towel'), '🧺'], [say('the remote'), '📺'], [say('the charger'), '🔌'],
    [say('my headphones'), '🎧'], [say('a tissue'), '🧻'], [say('a spoon'), '🥄'], [say('a fork'), '🍴'],
    [say('a cup'), '🥤'], [say('a plate'), '🍽️'], [say('money'), '🪙'],
  ]),
  g('time', 'Time & words', '⏰', [
    [say('today'), '📅'], [say('tomorrow'), '➡️'], [say('yesterday'), '⬅️'], [say('morning'), '🌅'], [say('night'), '🌙'],
    [say('first'), '1️⃣'], [say('next'), '⏭️'], [say('finished'), '✅'], [say('yes'), '👍'], [say('no'), '👎'],
    [say('big'), '🐘'], [say('small'), '🐜'], [say('hot'), '🔥'], [say('cold'), '🧊'], [say('fast'), '⚡'],
    [say('slow'), '🐢'], [say('here'), '📍'], [say('there'), '👉'], [say('this one'), '☝️'], [say('that one'), '👉'],
  ]),
]
