"""Bande-son originale HashCode Reboot (34 s, 48 kHz), générée par code : aucun droit tiers.
Calée sur le storyboard F03 : 120 BPM (1 temps = 0,5 s), changements de scène sur les temps.
Usage : python3 -I score.py <sortie.wav>
"""
import sys, wave
import numpy as np

SR = 48000
DUR = 34.0
N = int(SR * DUR)
t = np.arange(N) / SR
rng = np.random.default_rng(7)
out = np.zeros((N, 2))

SCENES = [0, 3, 6, 11, 16, 21, 26.5]  # secondes (F03)


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

# 00–03 : impact sub + silence contrôlé, souffle sombre
add(impact(2.8, 45, 1.2), 0.43, 0.9)
add(pad([A, A * 2], 3.0, 0.4), 0.0, 0.10)
add(reverse_sweep(0.7), 2.3, 0.35)

# 03–06 : montée atmosphérique (tunnel)
add(pad([A, E * 2, A * 2, C * 4], 3.2, 1.2), 3.0, 0.22)
add(riser(2.8, 150, 3000), 3.2, 0.30)
add(impact(1.5, 60, 0.5), 3.0, 0.45)

# 06–21 : pulsations électroniques + kicks, texture qui s'intensifie
for sc, (root, chord) in zip([6, 11, 16], [(A, [A, C * 2, E * 2]), (F, [F, A * 2, C * 4]), (D, [D, F * 2, A * 2])]):
    length = 5.0
    add(bass_pulse(root, length), sc, 0.22)
    add(pad([c * 2 for c in chord], length, 0.6), sc, 0.16)
    add(impact(1.2, 50, 0.4), sc, 0.55)
    for b in np.arange(sc, sc + length, 0.5):
        add(kick(), b, 0.55)
    for b in np.arange(sc + 0.25, sc + length, 0.5):
        add(tick(1.0), b, 1.0, pan=0.3)
    for b in np.arange(sc, sc + length, 0.125):
        add(tick(0.4), b, 0.5, pan=-0.3)
add(data_burst(0.9), 7.0, 0.5, pan=-0.4)
add(data_burst(0.9), 12.0, 0.5, pan=0.4)
add(data_burst(0.6), 17.5, 0.4)
for sc in [10.4, 15.4, 20.3]:
    add(reverse_sweep(0.6), sc, 0.4)

# 21–26,5 : crescendo (fusion des trois univers) + battements des mots
add(pad([A, E * 2, A * 2, C * 4, E * 4], 5.5, 2.0), 21.0, 0.32)
add(riser(5.5, 120, 5000), 21.0, 0.30)
for b in np.arange(21.0, 26.5, 0.5):
    add(kick(), b, 0.45 + (b - 21) * 0.06)
for w in [23.4, 24.1, 25.17]:  # apprendre / expérimenter / construire (voix)
    add(impact(0.8, 70, 0.3), w, 0.5)

# 26,5–34 : impact final + signature sonore (accord lumineux qui s'éteint)
add(impact(4.5, 40, 1.6), 26.5, 1.0)
add(pad([A, E * 2, A * 2, C * 4, E * 4, A * 4], 7.5, 0.05), 26.5, 0.30)
sig_n = int(2.5 * SR)
tt = np.arange(sig_n) / SR
sig = (np.sin(2 * np.pi * 880 * tt) + 0.5 * np.sin(2 * np.pi * 1318.5 * tt)) * env(sig_n, 0.003, 0.5) * 0.3
add(sig, 30.17, 0.6)  # « Rejoins-nous »

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
