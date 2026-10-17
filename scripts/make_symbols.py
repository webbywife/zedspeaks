#!/usr/bin/env python3
"""Generate ZedSpeaks symbols locally with Draw Things (no tokens, no cloud).

Setup (once): Draw Things → model "FLUX.1 [schnell]" → Settings → API Server: on (HTTP, port 7860).

  python3 scripts/make_symbols.py test              # the 50-word style test
  python3 scripts/make_symbols.py words.txt         # one word per line (optional "word | hint")
  python3 scripts/make_symbols.py sheet             # contact sheet of everything generated
  python3 scripts/make_symbols.py publish           # approved images -> app library (public/symbols)

Images land in scripts/_gen/<slug>.png for review (not shipped). Delete a bad one and run
again to redo it; existing files are skipped.

Style rule (see memory: feedback-zedspeaks-symbol-style): our own style prompt only. Never
name another symbol set or its style, and don't use another product's word list.
"""
import base64, json, os, re, sys, time, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "scripts/_gen")
API = os.environ.get("DRAWTHINGS_URL", "http://127.0.0.1:7860")

STYLE = ("flat illustration, thick dark outline, soft bright pastel colors, plain white background, "
         "one object, centered, no text")
NEGATIVE = "text, letters, words, watermark, logo, brand, photo, realistic, shadow, gradient background, frame"

# Style test: everyday words for an older child, a few not in the Mulberry set
TEST = [
    "tablet", "toy car", "race car", "building blocks", "coloring book", "crayons", "video game controller",
    "headphones", "television", "colorful toy ball", "bicycle", "swing", "slide", "puzzle", "teddy bear",
    "rice", "fried chicken", "noodles", "fried egg", "bread", "banana", "mango", "watermelon", "ice cream",
    "glass of water", "glass of milk", "orange juice", "cookie", "pizza slice", "sandwich",
    "toothbrush", "soap", "towel", "bed", "pillow", "blanket", "shoes", "backpack", "umbrella", "electric fan",
    "house", "school building", "car", "bus", "motorcycle", "shopping cart", "tree", "sun", "rain cloud", "moon",
]


def slug(w):
    return re.sub(r"[^a-z0-9]+", "-", w.lower()).strip("-")


def generate(word, hint=""):
    body = {
        "prompt": f"{word}{', ' + hint if hint else ''}, {STYLE}",
        "negative_prompt": NEGATIVE,
        "width": 512, "height": 512,
        "steps": 4, "guidance_scale": 1.0,  # FLUX schnell settings
        "seed": 42,  # same seed for every word keeps the look steady
    }
    req = urllib.request.Request(API + "/sdapi/v1/txt2img", data=json.dumps(body).encode(),
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=600) as r:
        return base64.b64decode(json.load(r)["images"][0])


def run(words):
    os.makedirs(OUT, exist_ok=True)
    todo = [(w, h) for w, h in words if not os.path.exists(os.path.join(OUT, slug(w) + ".png"))]
    print(f"{len(words) - len(todo)} done already, {len(todo)} to make")
    for i, (w, h) in enumerate(todo, 1):
        for attempt in range(3):  # the server can drop one request (e.g. after a settings change)
            try:
                open(os.path.join(OUT, slug(w) + ".png"), "wb").write(generate(w, h))
                print(f"[{i}/{len(todo)}] {w}")
                break
            except Exception as e:
                if attempt == 2:
                    sys.exit(f"Draw Things didn't answer ({e}). Is it open, with API Server on at {API}?")
                time.sleep(10)


def sheet():
    from PIL import Image, ImageDraw
    files = sorted(f for f in os.listdir(OUT) if f.endswith(".png"))
    cols, cell = 10, 160
    im = Image.new("RGB", (cols * cell, -(-len(files) // cols) * (cell + 20)), "white")
    d = ImageDraw.Draw(im)
    for i, f in enumerate(files):
        x, y = i % cols * cell, i // cols * (cell + 20)
        try:
            im.paste(Image.open(os.path.join(OUT, f)).convert("RGB").resize((cell - 8, cell - 8)), (x + 4, y + 4))
        except OSError:  # still being written
            continue
        d.text((x + 6, y + cell - 2), f[:-4][:22], fill="black")
    path = os.path.join(ROOT, "scripts/_gen_sheet.png")
    im.save(path)
    print(path)


def publish():
    """Copy every image in _gen (delete rejects first) into the app library as small WebP files."""
    from PIL import Image
    lib = os.path.join(ROOT, "apps/web/public/symbols")
    index_f = os.path.join(lib, "index.json")
    index = [e for e in json.load(open(index_f)) if not e["f"].startswith("zs-")]
    added = 0
    for f in sorted(os.listdir(OUT)):
        if not f.endswith(".png"):
            continue
        word = f[:-4].replace("-", " ")
        out = "zs-" + f[:-4] + ".webp"
        try:
            img = Image.open(os.path.join(OUT, f)).convert("RGB")
        except OSError:  # still being written by a running batch
            continue
        img.resize((256, 256), Image.LANCZOS).save(os.path.join(lib, out), "WEBP", quality=80)
        # our own picture goes first when Mulberry has the same word
        index.insert(0, {"w": word, "c": "ZedSpeaks", "g": "", "f": out})
        added += 1
    json.dump(index, open(index_f, "w"), separators=(",", ":"))
    print(f"{added} ZedSpeaks symbols published, {len(index)} in the library")


def main():
    a = sys.argv[1:]
    if a == ["test"]:
        run([(w, "") for w in TEST])
    elif a == ["sheet"]:
        sheet()
    elif a == ["publish"]:
        publish()
    elif len(a) == 1 and os.path.exists(a[0]):
        lines = [l.strip() for l in open(a[0]) if l.strip() and not l.startswith("#")]
        run([(l.split("|")[0].strip(), l.split("|")[1].strip() if "|" in l else "") for l in lines])
    else:
        print(__doc__)


if __name__ == "__main__":
    main()
