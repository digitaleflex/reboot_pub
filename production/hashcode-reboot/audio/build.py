"""Construit la voix off, la chronologie et le mix final de la pub HashCode Reboot.

  python3 -I build.py --piper <piper> --models <dossier des voix .onnx> [--whisper <whisper-cli>]

Sorties :
  remotion/src/data/timeline.json   scènes (frames) + repères (cues) pour les animations
  assets/voice/voiceover-master.wav voix seule traitée
  remotion/public/score.wav         musique seule (version instrumentale)
  remotion/public/mix.wav           voix + musique (baisse automatique sous la voix), -14 LUFS
"""
import argparse, json, os, re, subprocess, tempfile, unicodedata, wave
from difflib import SequenceMatcher

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "../../.."))


def sh(*args):
    subprocess.run(args, check=True)


def dur(path):
    with wave.open(path) as w:
        return w.getnframes() / w.getframerate()


def words(txt):
    txt = unicodedata.normalize("NFKD", txt.lower())
    txt = "".join(c for c in txt if not unicodedata.combining(c))
    return re.findall(r"[a-z]+", txt)


def transcribe(cli, model, wav, tmp):
    w16 = os.path.join(tmp, "w16.wav")
    sh("ffmpeg", "-v", "error", "-y", "-i", wav, "-ar", "16000", "-ac", "1", w16)
    r = subprocess.run([cli, "-m", model, "-l", "fr", "-nt", "-f", w16], capture_output=True, text=True)
    return " ".join(r.stdout.split())


def find_pauses(wav, min_len=0.28):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", wav, "-af", f"silencedetect=noise=-40dB:d={min_len}", "-f", "null", "-"],
                       capture_output=True, text=True)
    st = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", r.stderr)]
    en = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", r.stderr)]
    return list(zip(st, en))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--piper", required=True)
    ap.add_argument("--models", required=True)
    ap.add_argument("--whisper", default=os.environ.get("WHISPER_CLI", "whisper-cli"))
    ap.add_argument("--whisper-model", default=os.path.expanduser("~/.cache/whisper-cpp/ggml-large-v3-turbo-q5_0.bin"))
    a = ap.parse_args()
    spec = json.load(open(os.path.join(HERE, "script.json")))
    v = spec["voice"]
    model = os.path.join(a.models, v["model"] + ".onnx")
    fps = spec["fps"]
    tmp = tempfile.mkdtemp()

    # 1. Synthèse : plusieurs prises par scène, la plus fidèle au texte est retenue
    placed = []  # (wav, start_s)
    timeline = {"fps": fps, "scenes": []}
    report = []
    t = 0.0
    for sc in spec["scenes"]:
        lead = sc.get("lead", spec["lead"])
        tail = sc.get("tail", spec["tail"])
        sents = [x if isinstance(x, dict) else {"say": x, "text": x} for x in sc["sentences"]]
        say = " ".join(x["say"] for x in sents)
        expected = " ".join(x["text"] for x in sents)
        best = None
        for k in range(v["takes"]):
            raw = os.path.join(tmp, f"{sc['id']}-{k}.wav")
            cmd = [a.piper, "-m", model, "--length-scale", str(v["lengthScale"]), "--sentence-silence", str(v["sentenceSilence"]), "-f", raw]
            if v.get("speaker") is not None:
                cmd += ["-s", str(v["speaker"])]
            subprocess.run(cmd, input=say.encode(), check=True, stderr=subprocess.DEVNULL)
            take = os.path.join(tmp, f"{sc['id']}-{k}-trim.wav")
            sh("ffmpeg", "-v", "error", "-y", "-i", raw, "-af",
               "silenceremove=start_periods=1:start_threshold=-42dB,areverse,silenceremove=start_periods=1:start_threshold=-42dB,areverse",
               take)
            heard = transcribe(a.whisper, a.whisper_model, take, tmp)
            sim = SequenceMatcher(None, words(expected), words(heard)).ratio()
            pauses = find_pauses(take)
            need = len(sents) - 1
            ok_pauses = len(pauses) >= need
            score = sim - (0 if ok_pauses else 0.5)
            if best is None or score > best[0]:
                best = (score, take, heard, sorted(sorted(pauses, key=lambda p: -(p[1] - p[0]))[:need]))
            if sim >= 0.97 and ok_pauses:
                break
        score, take, heard, pauses = best
        report.append((sc["id"], round(score, 3), heard))
        d = dur(take)
        starts = [0.0] + [p[1] for p in pauses]
        cues = {"voice": round(lead * fps), "voiceEnd": round((lead + d) * fps)}
        for name, idx in sc["cues"].items():
            cues[name] = round((lead + starts[min(idx, len(starts) - 1)]) * fps)
        placed.append((take, t + lead))
        scene_dur = max(sc["minDur"], lead + d + tail)
        frames = round(scene_dur * fps)
        timeline["scenes"].append({"id": sc["id"], "from": round(t * fps), "dur": frames, "cues": cues})
        t += frames / fps
    total = round(t * fps)
    timeline["total"] = total
    os.makedirs(os.path.join(ROOT, "remotion/src/data"), exist_ok=True)
    json.dump(timeline, open(os.path.join(ROOT, "remotion/src/data/timeline.json"), "w"), indent=2)
    total_s = total / fps
    print("prises retenues :")
    for sid, sc_, heard in report:
        print(f"  {sid:14s} fidélité {sc_:.3f} | {heard}")

    # 2. Piste voix : placement, voix plus grave (rubberband), chaleur, compression, légère ambiance
    args, filt = [], ""
    for i, (w, s) in enumerate(placed):
        ms = int(s * 1000)
        args += ["-i", w]
        filt += f"[{i}:a]aresample=48000,aformat=channel_layouts=stereo,adelay={ms}|{ms}[v{i}];"
    ins = "".join(f"[v{i}]" for i in range(len(placed)))
    ratio = 2 ** (v["pitchSemitones"] / 12)
    chain = (
        f"{ins}amix=inputs={len(placed)}:normalize=0,apad=whole_dur={total_s},atrim=0:{total_s},"
        f"rubberband=pitch={ratio:.4f}:formant=preserved,"
        "highpass=f=60,equalizer=f=120:t=q:w=1:g=3,equalizer=f=350:t=q:w=1.2:g=-2,equalizer=f=4000:t=q:w=1.5:g=1.5,"
        "acompressor=threshold=-22dB:ratio=3:attack=10:release=180:makeup=2,"
        "aecho=0.8:0.6:40|85:0.10|0.06,loudnorm=I=-16:TP=-3[vo]"
    )
    voice = os.path.join(ROOT, "assets/voice/voiceover-master.wav")
    os.makedirs(os.path.dirname(voice), exist_ok=True)
    sh("ffmpeg", "-v", "error", "-y", *args, "-filter_complex", filt + chain, "-map", "[vo]", "-ar", "48000", voice)

    # 3. Musique calée sur la chronologie
    score = os.path.join(ROOT, "remotion/public/score.wav")
    raw = os.path.join(tmp, "score.wav")
    sh("python3", "-I", os.path.join(HERE, "score.py"), raw, os.path.join(ROOT, "remotion/src/data/timeline.json"))
    sh("ffmpeg", "-v", "error", "-y", "-i", raw, "-af", "loudnorm=I=-16:TP=-2", "-ar", "48000", score)

    # 4. Mix : musique baissée sous la voix (sidechain), loudness TikTok
    mix = os.path.join(ROOT, "remotion/public/mix.wav")
    sh("ffmpeg", "-v", "error", "-y", "-i", score, "-i", voice, "-filter_complex",
       "[0:a]volume=-6dB[m];[1:a]asplit=2[vk][vs];[m][vs]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400:makeup=1[d];"
       "[d][vk]amix=inputs=2:normalize=0,acompressor=threshold=-16dB:ratio=2.5:attack=5:release=120,"
       "loudnorm=I=-14:TP=-3:LRA=9,alimiter=limit=0.7:level=false[o]",
       "-map", "[o]", "-ar", "48000", mix)
    print(f"ok : {total} frames ({total_s:.2f} s)")
    for sc in timeline["scenes"]:
        print(f"  {sc['id']:14s} from {sc['from']:4d}  dur {sc['dur']:4d}  cues {sc['cues']}")


if __name__ == "__main__":
    main()
