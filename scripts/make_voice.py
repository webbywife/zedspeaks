#!/usr/bin/env python3
"""Pre-record every ZedSpeaks word/phrase with ElevenLabs (one-time, cached).

  python3 scripts/make_voice.py --voices            # list voices on the account (free)
  python3 scripts/make_voice.py --sample VOICE_ID   # one test clip -> scripts/samples/
  python3 scripts/make_voice.py --voice VOICE_ID    # all clips -> apps/web/public/voice/

Clips are keyed by a hash of the spoken text, so re-runs only record new phrases.
The API key is read from ~/LXD/.env (ELEVENLABS...=) and never written anywhere.
"""
import hashlib, json, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "apps/web/src/data")
OUT = os.path.join(ROOT, "apps/web/public/voice")
API = "https://api.elevenlabs.io/v1"
MODEL = "eleven_multilingual_v2"
SETTINGS = {"stability": 0.6, "similarity_boost": 0.8, "style": 0.2, "use_speaker_boost": True, "speed": 0.9}


def key():
    for line in open(os.path.expanduser("~/LXD/.env")):
        if line.startswith("ELEVENLABS") and "KEY" in line.split("=")[0]:
            return line.split("=", 1)[1].strip().strip("'\"")
    sys.exit("No ELEVENLABS..KEY in ~/LXD/.env")


def call(path, body=None):
    req = urllib.request.Request(API + path, data=json.dumps(body).encode() if body else None,
                                 headers={"xi-api-key": key(), "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def texts():
    q = r"'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\""
    q = "(?:" + q + ")"
    s = open(os.path.join(DATA, "symbols.ts")).read()
    p = open(os.path.join(DATA, "phrases.ts")).read()
    out = [a or b for a, b in re.findall(r"spokenText:\s*" + q, s)]
    for m in re.finditer(r"\bp\(\s*" + q + r"\s*,\s*" + q + r"\s*,\s*" + q, p):
        out.append(m.group(5) or m.group(6) or "")
    for name in os.listdir(DATA):
        if name.endswith(".ts"):
            out += [a or b for a, b in re.findall(r"\bsay\(\s*" + q + r"\s*\)", open(os.path.join(DATA, name)).read())]
    return sorted({(t or "").replace("\\'", "'") for t in out if (t or "").strip()})


def norm(t):  # must match normalize() in useTTS.ts
    return re.sub(r"\s+", " ", re.sub(r"[^\w\s']", "", t.lower())).strip()


def tts(text, voice):
    return call(f"/text-to-speech/{voice}?output_format=mp3_44100_64",
                {"text": text, "model_id": MODEL, "voice_settings": SETTINGS})


def main():
    a = sys.argv[1:]
    if a[:1] == ["--voices"]:
        for v in json.loads(call("/voices"))["voices"]:
            l = v.get("labels", {})
            print(v["voice_id"], "|", v["name"], "|", l.get("gender"), l.get("age"), l.get("accent"))
    elif a[:1] == ["--sample"]:
        os.makedirs(os.path.join(ROOT, "scripts/samples"), exist_ok=True)
        f = os.path.join(ROOT, "scripts/samples", a[2] if len(a) > 2 else a[1]) + ".mp3"
        open(f, "wb").write(tts("Hi! I'm Zed. I want to eat, please. Thank you!", a[1]))
        print(f)
    elif a[:1] == ["--voice"]:
        os.makedirs(OUT, exist_ok=True)
        man_f = os.path.join(OUT, "manifest.json")
        man = json.load(open(man_f)) if os.path.exists(man_f) else {}
        if man.get("_voice") not in (None, a[1]):
            man = {}  # voice changed: re-record everything
        man["_voice"] = a[1]
        new = 0
        for t in texts():
            k = norm(t)
            name = hashlib.sha1(k.encode()).hexdigest()[:10] + ".mp3"
            if man.get(k) == name and os.path.exists(os.path.join(OUT, name)):
                continue
            open(os.path.join(OUT, name), "wb").write(tts(t, a[1]))
            man[k] = name
            new += 1
        json.dump(man, open(man_f, "w"), indent=1, sort_keys=True)
        print(f"{new} new clips, {len(man) - 1} total -> {OUT}")
    else:
        print(__doc__)
    

if __name__ == "__main__":
    main()
