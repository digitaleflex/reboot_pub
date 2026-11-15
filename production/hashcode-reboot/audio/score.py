"""Bande-son originale HashCode Reboot (48 kHz), générée par code : aucun droit tiers.
Calée sur remotion/src/data/timeline.json (scènes et repères de la voix off).
Calée sur le storyboard F03 : 120 BPM (1 temps = 0,5 s), changements de scène sur les temps.
Usage : python3 -I score.py <sortie.wav> <timeline.json>
"""
import json, sys, wave
import numpy as np

SR = 48000
TL = json.load(open(sys.argv[2]))
FPS = TL["fps"]
DUR = TL["total"] / FPS
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(7)
out = np.zeros((N, 2))

SC = {x["id"]: (x["from"] / FPS, x["dur"] / FPS, {k: x["from"] / FPS + v / FPS for k, v in x["cues"].items()}) for x in TL["scenes"]}


def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    out[i : i + len(sig), 0] += sig * gain * l * 1.414
    out[i : i + len(sig), 1] += sig * gain * r * 1.414


def env(n, a, d):
    e = np.ones(n)
    na = max(1, int(a * SR))
    e[:na] = np.linspace(0, 1, na)
    e[na:] = np.exp(-np.arange(n - na) / (d * SR))
    return e


def impact(length=2.5, f0=55, deep=1.0):
    n = int(length * SR)
    tt = np.arange(n) / SR
    f = f0 + 90 * np.exp(-tt * 18)  # pitch drop
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.9 * deep)
    noise = rng.standard_normal(n) * env(n, 0.001, 0.05) * 0.5
    return np.tanh((body + noise) * 1.6)


def kick():
    n = int(0.35 * SR)
    tt = np.arange(n) / SR
    f = 48 + 110 * np.exp(-tt * 35)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.12)


def tick(bright=1.0):
    n = int(0.05 * SR)
    s = rng.standard_normal(n)
    s = np.diff(np.concatenate([[0], s]))  # passe-haut grossier
    return s * env(n, 0.0005, 0.012) * 0.35 * bright


def riser(length, f_from=200, f_to=2400):
    n = int(length * SR)
    tt = np.arange(n) / SR
    noise = rng.standard_normal(n)
    # balayage : modulation d'un bruit filtré par une sinusoïde montante
    f = np.geomspace(f_from, f_to, n)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25
    k = 60
    filt = np.convolve(noise, np.ones(k) / k, mode="same")
    e = np.linspace(0, 1, n) ** 2.2
    return (filt * 2.5 + tone) * e


def reverse_sweep(length=0.6):
    return riser(length, 400, 5000) * 0.8


def pad(freqs, length, attack=1.5):
    n = int(length * SR)
    tt = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * tt + i) + 0.4 * np.sin(2 * np.pi * f * 1.003 * tt) for i, f in enumerate(freqs))
    e = np.minimum(1, tt / attack) * np.minimum(1, (length - tt) / 0.6)
    return s / len(freqs) * e


def bass_pulse(freq, length, bpm=120, sixteenth=True):
    n = int(length * SR)
    tt = np.arange(n) / SR
    step = 60 / bpm / (4 if sixteenth else 2)
    phase = (tt % step) / step
    gate = np.exp(-phase * 6)
    saw = 2 * ((tt * freq) % 1) - 1
    s = np.tanh((np.sin(2 * np.pi * freq * tt) + 0.3 * saw) * 1.5) * gate
    return s * np.minimum(1, tt / 0.05)


def data_burst(length=0.8):
    n = int(length * SR)
    tt = np.arange(n) / SR
    f = 1800 + 1200 * np.sign(np.sin(2 * np.pi * 22 * tt))
    s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.15
    return s * env(n, 0.005, length / 2.5)


A, D, F, E, C = 55.0, 73.42, 87.31, 82.41, 65.41  # La, Ré, Fa, Mi, Do (graves)

# 01 — hook : impact sub sur le titre, souffle sombre
s0, d0, c0 = SC["01-hook"]
add(impact(3.0, 42, 1.3), c0.get("title", 0.4), 0.85)
add(data_burst(0.35), 0.0, 0.55)  # interruption de schéma : glitch dès la 1re frame
add(impact(1.2, 65, 0.5), c0.get("s2", 1.2), 0.6)  # « Ce message est pour toi »
add(pad([A, A * 2], d0 + 0.5, 0.6), 0.0, 0.10)
add(reverse_sweep(0.7), s0 + d0 - 0.7, 0.3)

# 02 — vision : montée atmosphérique, impact sur « c'était toi ? »
s1, d1, c1 = SC["02-vision"]
add(pad([A, E * 2, A * 2, C * 4], d1 + 0.3, 1.0), s1, 0.20)
add(riser(d1, 150, 3000), s1, 0.28)
add(impact(1.6, 55, 0.6), c1.get("title2", s1 + 1), 0.6)

# 03 à 05 — pulsations électroniques, une tonalité par univers (tempo 120 BPM, énergique)
BEAT = 0.5
for sid, root, chord in [("03-web", A, [A, C * 2, E * 2]), ("04-cyber", F, [F, A * 2, C * 4]), ("05-ia", D, [D, F * 2, A * 2])]:
    st, du, cu = SC[sid]
    add(bass_pulse(root, du, bpm=120), st, 0.18)
    add(pad([c * 2 for c in chord], du, 0.8), st, 0.15)
    add(impact(1.2, 50, 0.4), st, 0.5)
    for b in np.arange(st, st + du - 0.05, BEAT):
        add(kick(), b, 0.45)
    for b in np.arange(st + BEAT / 2, st + du - 0.05, BEAT):
        add(tick(1.0), b, 0.8, pan=0.3)
    add(data_burst(0.8), st + 0.9, 0.35, pan=-0.4)
    add(reverse_sweep(0.6), st + du - 0.6, 0.35)

# 06 — communauté : crescendo, un battement par mot prononcé
s5, d5, c5 = SC["06-community"]
add(pad([A, E * 2, A * 2, C * 4, E * 4], d5, 2.0), s5, 0.30)
add(riser(d5, 120, 5000), s5, 0.28)
for b in np.arange(s5, s5 + d5 - 0.05, BEAT):
    add(kick(), b, 0.4 + (b - s5) / d5 * 0.3)
for w in ["w1", "w2", "w3", "w4"]:
    if w in c5:
        add(impact(0.9, 70, 0.35), c5[w], 0.5)

# 07 — CTA : impact final, nappe lumineuse, signature sur « Ta place t'attend »
s6, d6, c6 = SC["07-cta"]
add(impact(4.5, 40, 1.6), s6, 1.0)
add(pad([A, E * 2, A * 2, C * 4, E * 4, A * 4], d6, 0.05), s6, 0.28)
sig_n = int(2.5 * SR)
tt = np.arange(sig_n) / SR
sig = (np.sin(2 * np.pi * 880 * tt) + 0.5 * np.sin(2 * np.pi * 1318.5 * tt)) * env(sig_n, 0.003, 0.5) * 0.3
add(sig, c6.get("title", s6 + 3), 0.55)

# fondu final + normalisation de crête (la loudness finale est réglée par ffmpeg)
fade = np.minimum(1, (DUR - t) / 1.2)[:, None]
out *= fade
out /= np.max(np.abs(out)) * 1.12
pcm = (out * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("ok", sys.argv[1])
