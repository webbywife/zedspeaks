#!/usr/bin/env python3
"""Import the open Mulberry AAC symbol set (CC BY-SA 4.0, Steve Lee) into ZedSpeaks.

  python3 scripts/import_mulberry.py <path to mulberry-symbols-master>

Download: https://github.com/mulberrysymbols/mulberry-symbols (Code → Download ZIP).
Writes apps/web/public/symbols/<slug>.svg (lightly minified) and symbols/index.json:
  [{"w": word, "c": category, "g": grammar, "f": file}]
Skips the few symbols Mulberry marks as adult ("rated"). The app credits Mulberry on
the Me tab; the SVGs are shared unchanged apart from whitespace/metadata removal.
"""
import csv, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "apps/web/public/symbols")
SKIP_CATEGORIES = {"Country Flags", "Country Maps"}  # not needed for a child's board, and large


def word(name):
    # "fold_clothes_,_to" -> "fold clothes"; "a_-_lower_case" -> "a (lower case)"
    w = name.replace("_", " ")
    w = re.sub(r"\s*,\s*to$", "", w)
    w = re.sub(r"\s+-\s+(.*)$", r" (\1)", w)
    return re.sub(r"\s+", " ", w).strip()


def slug(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def minify(svg):
    svg = re.sub(r"<\?xml.*?\?>|<!--.*?-->|<metadata.*?</metadata>|<title>.*?</title>", "", svg, flags=re.S)
    svg = re.sub(r">\s+<", "><", svg)
    return re.sub(r"\s{2,}", " ", svg).strip()


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    src = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    index, seen = [], set()
    with open(os.path.join(src, "scripts/data/symbol-info.csv"), newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            name = row["symbol-en"]
            path = os.path.join(src, "EN", name + ".svg")
            if row["rated"] != "0" or row["category-en"] in SKIP_CATEGORIES or not os.path.exists(path):
                continue
            s = slug(name)
            if s in seen:
                continue
            seen.add(s)
            open(os.path.join(OUT, s + ".svg"), "w", encoding="utf-8").write(minify(open(path, encoding="utf-8").read()))
            index.append({"w": word(name), "c": row["category-en"], "g": row["grammar"], "f": s + ".svg"})
    json.dump(index, open(os.path.join(OUT, "index.json"), "w"), separators=(",", ":"))
    print(f"{len(index)} symbols -> {OUT}")


if __name__ == "__main__":
    main()
