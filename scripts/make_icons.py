#!/usr/bin/env python3
"""Generate the ZedSpeaks card icon set as SVG (no AI, no network).

  python3 scripts/make_icons.py      # -> apps/web/public/icons/<symbol id>.svg + _sheet.svg

Objects/places/actions reuse Lucide glyphs (ISC licence, already a dependency),
drawn duotone in the card's category colour. Feelings and people are built from
one parametric face so every face shares the same proportions.
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LUCIDE = os.path.join(ROOT, "node_modules/lucide-react/dist/esm/icons")
OUT = os.path.join(ROOT, "apps/web/public/icons")

# category -> (ink, tint)  (matches CATEGORIES in src/data/symbols.ts)
COLORS = {
    "needs": ("#dc2626", "#fecaca"), "feelings": ("#7c3aed", "#ddd6fe"),
    "food": ("#16a34a", "#bbf7d0"), "people": ("#ea580c", "#fed7aa"),
    "places": ("#0891b2", "#a5f3fc"), "actions": ("#ca8a04", "#fde68a"),
}
SKIN, HAIR = "#ffe1c4", "#5b3a29"

GLYPHS = {
    "needs": dict(eat="utensils", drink="cup-soda", sleep="bed", bathroom="bath", help="hand-helping",
                  pain="bandage", more="circle-plus", stop="octagon-x", yes="thumbs-up", no="thumbs-down",
                  please="hand-heart", thanks="heart-handshake"),
    "food": dict(apple="apple", pizza="pizza", milk="milk", cookie="cookie", banana="banana", bread="croissant",
                 water="glass-water", juice="citrus", sandwich="sandwich", eggs="egg", chicken="drumstick",
                 icecream="ice-cream-cone"),
    "places": dict(home="house", school="school", park="trees", store="store", hospital="hospital", car="car",
                   outside="sun", bedroom="bed-double"),
    "actions": dict(go="circle-arrow-right", play="gamepad-2", read="book-open", watch="tv", listen="headphones",
                    run="footprints", sit="armchair", wait="hourglass", look="eye", come="hand", open="door-open",
                    want="hand-metal", blocks="toy-brick", toycars="car-front"),
}

# feeling -> (eyes, brows, mouth, extra)
FEELINGS = dict(
    happy=("dot", None, "smile", None), sad=("dot", "sad", "frown", "tear"),
    angry=("dot", "angry", "flat", None), scared=("wide", "worried", "wavy", "sweat"),
    excited=("dot", "up", "grin", "sparkle"), laughing=("closed", None, "grin", None),
    surprised=("wide", "up", "o", None), curious=("dot", "one", "side", None),
    hopeful=("up", None, "smile", "sparkle"), relaxed=("closed", None, "smile", None),
    disgusted=("squint", "angry", "tongue", None), love=("heart", None, "smile", None),
)
# person -> (hair, accessory)
PEOPLE = dict(me=("short", "star"), mom=("long", None), dad=("short", "beard"), friend=("curly", None),
              teacher=("bun", "glasses"), doctor=("short", "mirror"), sister=("pigtails", None),
              brother=("spiky", None))


def lucide(name):
    src = open(os.path.join(LUCIDE, name + ".js")).read()
    out = []
    for tag, attrs in re.findall(r'\[\s*"(\w+)",\s*\{([^}]*)\}', src):
        a = " ".join(f'{k}="{v}"' for k, v in re.findall(r'(\w+): "([^"]*)"', attrs) if k != "key")
        out.append((tag, a))
    return out


def glyph_svg(name, ink, tint):
    els = lucide(name)
    # tint layer: closed shapes only, nudged down-right for a soft duotone offset
    closed = [f"<{t} {a}/>" for t, a in els if t in ("circle", "rect", "ellipse", "polygon")
              or (t == "path" and re.search(r"[Zz]\s*$", dict(re.findall(r'(\w+)="([^"]*)"', a)).get("d", "")))]
    lines = "".join(f"<{t} {a}/>" for t, a in els)
    return (f'<g transform="translate(14 14) scale(3)">'
            f'<g fill="{tint}" stroke="none" transform="translate(.6 .6)">{"".join(closed)}</g>'
            f'<g fill="none" stroke="{ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{lines}</g></g>')


def face_svg(ink, eyes="dot", brows=None, mouth="smile", extra=None, hair=None, acc=None):
    s = 'fill="none" stroke="%s" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"' % ink
    g = []
    back = {"long": '<path d="M24 50c0-26 52-26 52 0v30H24z"/>',
            "pigtails": '<circle cx="20" cy="40" r="10"/><circle cx="80" cy="40" r="10"/>',
            "bun": '<circle cx="50" cy="16" r="10"/>'}.get(hair, "")
    if back:
        g.append(f'<g fill="{HAIR}">{back}</g>')
    g.append(f'<circle cx="50" cy="52" r="30" fill="{SKIN}" stroke="{ink}" stroke-width="5"/>')
    front = {"short": "M22 46c2-22 54-22 56 0c-10-8-34-12-56 0z",
             "long": "M22 48c2-24 54-24 56 0c-14-4-30-12-40-14c-4 8-10 12-16 14z",
             "curly": "M22 46c-4-10 6-20 14-18c4-8 22-8 28 0c8-2 18 8 14 18c-6-6-12-4-18-6c-6 4-14 4-20 0c-6 2-12 0-18 6z",
             "bun": "M22 46c2-22 54-22 56 0c-12-6-30-12-56 0z",
             "pigtails": "M22 46c2-22 54-22 56 0c-12-6-30-12-56 0z",
             "spiky": "M22 44l6-16 6 8 6-12 6 10 6-12 6 12 6-8 6 10 4 8c-12-6-34-8-54 0z"}.get(hair)
    if front:
        g.append(f'<path d="{front}" fill="{HAIR}"/>')
    L, R, Y = (39, 61, 50)
    eye = {"dot": f'<circle cx="{L}" cy="{Y}" r="3.5" fill="{ink}"/><circle cx="{R}" cy="{Y}" r="3.5" fill="{ink}"/>',
           "wide": f'<circle cx="{L}" cy="{Y}" r="6" fill="#fff" stroke="{ink}" stroke-width="3"/><circle cx="{L}" cy="{Y}" r="2.5" fill="{ink}"/>'
                   f'<circle cx="{R}" cy="{Y}" r="6" fill="#fff" stroke="{ink}" stroke-width="3"/><circle cx="{R}" cy="{Y}" r="2.5" fill="{ink}"/>',
           "closed": f'<path {s} d="M{L-5} {Y}q5-5 10 0M{R-5} {Y}q5-5 10 0"/>',
           "up": f'<path {s} d="M{L-5} {Y+1}q5-6 10 0M{R-5} {Y+1}q5-6 10 0"/>',
           "squint": f'<path {s} d="M{L-5} {Y-3}l9 3-9 3M{R+5} {Y-3}l-9 3 9 3"/>',
           "heart": "".join(f'<path fill="#ef4444" d="M{x} {Y+5}l-7-7a4 4 0 0 1 7-5a4 4 0 0 1 7 5z"/>' for x in (L, R))}[eyes]
    g.append(eye)
    brow = {"sad": f"M{L-6} {Y-8}l10-4M{R+6} {Y-8}l-10-4", "angry": f"M{L-6} {Y-13}l10 5M{R+6} {Y-13}l-10 5",
            "worried": f"M{L-6} {Y-10}l10-3M{R+6} {Y-10}l-10-3", "up": f"M{L-6} {Y-14}q6-5 12 0M{R-6} {Y-14}q6-5 12 0",
            "one": f"M{R-6} {Y-14}q6-6 12-1"}.get(brows)
    if brow:
        g.append(f'<path {s} d="{brow}"/>')
    M = 66
    mouth_el = {"smile": f'<path {s} d="M38 {M-2}q12 12 24 0"/>',
                "grin": f'<path d="M36 {M-4}h28q-2 16-14 16t-14-16z" fill="#fff" stroke="{ink}" stroke-width="4" stroke-linejoin="round"/>',
                "frown": f'<path {s} d="M39 {M+5}q11-10 22 0"/>', "flat": f'<path {s} d="M40 {M+2}h20"/>',
                "o": f'<ellipse cx="50" cy="{M+2}" rx="6" ry="8" fill="#fff" stroke="{ink}" stroke-width="4"/>',
                "wavy": f'<path {s} d="M37 {M+2}q4-5 8 0t8 0 8 0"/>', "side": f'<path {s} d="M42 {M+2}q10 4 16-4"/>',
                "tongue": f'<path {s} d="M38 {M}h24"/><path d="M45 {M+1}h10v5a5 5 0 0 1-10 0z" fill="#f472b6" stroke="{ink}" stroke-width="3"/>'}[mouth]
    g.append(mouth_el)
    g.append({"tear": '<path d="M33 58q-4 7 0 9q4-2 0-9z" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>',
              "sweat": '<path d="M76 30q-5 8 0 10q5-2 0-10z" fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>',
              "sparkle": f'<path fill="{ink}" d="M84 14l2.5 6.5 6.5 2.5-6.5 2.5-2.5 6.5-2.5-6.5-6.5-2.5 6.5-2.5z"/>',
              "star": f'<path fill="#facc15" stroke="{ink}" stroke-width="2.5" stroke-linejoin="round" d="M84 10l4 8 9 1-6.5 6 1.7 9-8.2-4.5-8.2 4.5 1.7-9-6.5-6 9-1z"/>',
              "beard": f'<path d="M25 58c4 22 46 22 50 0c-6 6-10 6-14 4q-11 10-22 0c-4 2-8 2-14-4z" fill="{HAIR}"/><path {s} d="M42 {M-1}q8 6 16 0"/>',
              "glasses": f'<g fill="none" stroke="{ink}" stroke-width="3"><circle cx="{L}" cy="{Y}" r="8"/><circle cx="{R}" cy="{Y}" r="8"/><path d="M{L+8} {Y}h6"/></g>',
              "mirror": f'<path {s} d="M24 34q26-14 52 0"/><circle cx="50" cy="26" r="7" fill="#e5e7eb" stroke="{ink}" stroke-width="3"/>',
              }.get(extra or acc, ""))
    return "".join(g)


def wrap(body, tint):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
            f'<circle cx="50" cy="52" r="44" fill="{tint}" opacity=".45"/>{body}</svg>')


def build():
    os.makedirs(OUT, exist_ok=True)
    icons = {}
    for cat, m in GLYPHS.items():
        ink, tint = COLORS[cat]
        for sid, name in m.items():
            icons[sid] = wrap(glyph_svg(name, ink, tint), tint)
    ink, tint = COLORS["feelings"]
    for sid, (e, b, mo, x) in FEELINGS.items():
        icons[sid] = wrap(face_svg(ink, e, b, mo, x), tint)
    ink, tint = COLORS["people"]
    for sid, (hair, acc) in PEOPLE.items():
        icons[sid] = wrap(face_svg(ink, hair=hair, acc=acc), tint)
    for sid, svg in icons.items():
        open(os.path.join(OUT, sid + ".svg"), "w").write(svg)
    # contact sheet for a quick visual check (not used by the app)
    cols, size = 12, 110
    cells = "".join(f'<svg x="{i % cols * size}" y="{i // cols * size}" width="100" height="100" viewBox="0 0 100 100">'
                    f'{re.sub(r"^<svg[^>]*>|</svg>$", "", svg)}</svg>' for i, svg in enumerate(icons.values()))
    rows = -(-len(icons) // cols)
    open(os.path.join(ROOT, "scripts/_sheet.svg"), "w").write(
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{cols * size}" height="{rows * size}">'
        f'<rect width="100%" height="100%" fill="#fff"/>{cells}</svg>')
    print(f"{len(icons)} icons -> {OUT}")


if __name__ == "__main__":
    build()
