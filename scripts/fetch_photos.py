#!/usr/bin/env python3
"""Fetch starter-card photos from Pexels, with credits, under our image rules.

  python3 scripts/fetch_photos.py            # fetch photos for cards that have none yet
  python3 scripts/fetch_photos.py apple park # re-pick these cards (next result)

Rules (see memory: feedback-image-ip-rules):
  - generic objects only: no brands, logos or packaging in the queries
  - no people: People cards are never fetched; results whose description
    mentions a person are skipped
  - every photo is logged with photographer + link; the app shows a
    "Photos provided by Pexels" credits page (required by the Pexels API terms)
  - photos are cropped to square cards, never offered as downloads

Key: put your Pexels API key in ~/.config/zedspeaks/pexels.key (never in the repo).
"""
import io, json, os, re, sys, urllib.parse, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "apps/web/public/photos")
CREDITS_TS = os.path.join(ROOT, "apps/web/src/data/photoCredits.ts")
KEY_FILE = os.path.expanduser("~/.config/zedspeaks/pexels.key")

# card id -> search words (generic, no brands). Not listed = icon on purpose:
# blocks, play, park, store (no clear generic photo), car, toycars (real car designs are brands)
QUERIES = {
    "read": "open picture book",
    "cookie": "chocolate chip cookies", "juice": "orange juice glass white background", "milk": "glass of milk",
    "apple": "red apple fruit", "banana": "bananas fruit", "icecream": "vanilla ice cream cone dessert", "water": "glass of water",
    "watch": "television living room", "listen": "headphones", "outside": "green grass backyard trees",
    "home": "house exterior", "school": "empty school classroom",
    "chicken": "fried chicken plate", "eggs": "fried egg on white plate", "sandwich": "sandwich plate",
    "pizza": "pizza slice", "bread": "bread loaf",
}
# a photo's description must mention one of these, and none of the AVOID words
MUST = {"blocks": r"block|brick", "play": r"toy", "park": r"playground|slide|swing", "store": r"supermarket|grocery",
        "toycars": r"toy|model|miniature", "eggs": r"egg", "juice": r"juice", "listen": r"headphone",
        "icecream": r"ice cream", "watch": r"tv|television"}
AVOID = re.compile(r"black and white|eerie|dark|lego|logo|brand|sign|neon|warehouse|aerial|drone", re.I)
PEOPLE_WORDS = re.compile(r"\b(person|people|man|men|woman|women|child|children|kid|kids|boy|girl|baby|"
                          r"hand|hands|face|family|student|teacher|couple|crowd|selfie|backpacker|tourist|walker|"
                          r"worker|shopper|customer|guy|lady|player|someone|individual|portrait|female|male|millennial|"
                          r"young|adult|teen|toddler|mother|father|daughter|son|friend|human|body|finger|arm|leg)s?\b", re.I)
ODD_WORDS = re.compile(r"\b(conceptual|concept|surreal|abstract|illustration|3d|render)\b", re.I)


def api(query, page):
    key = open(KEY_FILE).read().strip()
    url = "https://api.pexels.com/v1/search?" + urllib.parse.urlencode(
        {"query": query, "per_page": 15, "page": page, "orientation": "square"})
    req = urllib.request.Request(url, headers={"Authorization": key, "User-Agent": "ZedSpeaks/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)["photos"]


def card(img_bytes, path, size=400):
    im = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    s = min(im.size)
    im = im.crop(((im.width - s) // 2, (im.height - s) // 2, (im.width + s) // 2, (im.height + s) // 2))
    im.resize((size, size), Image.LANCZOS).save(path, "JPEG", quality=82, optimize=True)  # no EXIF kept


def main():
    if not os.path.exists(KEY_FILE):
        sys.exit(f"Put your Pexels API key in {KEY_FILE}")
    os.makedirs(OUT, exist_ok=True)
    cred_f = os.path.join(OUT, "credits.json")
    credits = json.load(open(cred_f)) if os.path.exists(cred_f) else {}
    redo = sys.argv[1:]
    for cid, query in QUERIES.items():
        if cid in credits and cid not in redo:
            continue
        skip = credits.get(cid, {}).get("pexels_id")
        chosen = None
        for photo in [p for page in (1, 2, 3) for p in api(query, page)]:
            alt = photo.get("alt") or ""
            if (photo["id"] == skip or PEOPLE_WORDS.search(alt) or ODD_WORDS.search(alt) or AVOID.search(alt)
                    or (cid in MUST and not re.search(MUST[cid], alt, re.I))):
                continue
            try:
                with urllib.request.urlopen(urllib.request.Request(photo["src"]["large"], headers={"User-Agent": "ZedSpeaks/1.0"}), timeout=60) as r:
                    card(r.read(), os.path.join(OUT, cid + ".jpg"))
            except Exception as e:  # a photo that won't download: try the next one
                print(f"{cid}: skipped photo {photo['id']} ({e})")
                continue
            chosen = photo
            break
        if not chosen:
            print(f"{cid}: no suitable photo, using the icon")
            if credits.pop(cid, None):
                os.remove(os.path.join(OUT, cid + ".jpg"))
            continue
        credits[cid] = {"file": cid + ".jpg", "pexels_id": chosen["id"], "url": chosen["url"],
                        "photographer": chosen["photographer"], "photographer_url": chosen["photographer_url"],
                        "alt": chosen.get("alt") or "", "license": "Pexels License (https://www.pexels.com/license/)"}
        print(f"{cid}: {chosen['photographer']} — {chosen.get('alt') or chosen['url']}")
    json.dump(credits, open(cred_f, "w"), indent=1, sort_keys=True)
    rows = ",\n".join(f"  {cid}: {{ photographer: {json.dumps(c['photographer'])}, photographerUrl: {json.dumps(c['photographer_url'])}, url: {json.dumps(c['url'])} }}"
                      for cid, c in sorted(credits.items()))
    open(CREDITS_TS, "w").write("// Generated by scripts/fetch_photos.py — starter photos from Pexels, with credits.\n"
                                "export const PHOTO_CREDITS: Record<string, { photographer: string; photographerUrl: string; url: string }> = {\n"
                                + rows + ",\n}\n")
    print(f"{len(credits)} photos -> {OUT}")


if __name__ == "__main__":
    main()
