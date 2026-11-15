# F02 — Voix off et narration

- **Projet** : HashCode Reboot · Cinematic Technology Advertisement
- **Langue** : français
- **Voix** : masculine, grave, assurée, naturelle
- **Interprétation** : institutionnelle, inspirante, déterminée
- **Durée cible** : 30 s

## Script

| Temps | Intention | Texte |
|---|---|---|
| 0–3 s | Mystère, voix basse | Le futur ne se regarde pas… |
| 3–6 s | Montée en intensité | Il se construit. |
| 6–11 s | Ton affirmé | Le Web. Là où les idées deviennent des applications. |
| 11–16 s | Ton ferme | La cybersécurité. Là où les compétences protègent le monde numérique. |
| 16–21 s | Ton inspirant | L'intelligence artificielle. Là où les possibilités repoussent les limites. |
| 21–25 s | Ton fédérateur | Trois univers. Une même ambition : apprendre, expérimenter et construire ensemble. |
| 25–30 s | Conclusion puissante | HashCode Reboot. Ta place est parmi les bâtisseurs. Rejoins-nous. |

≈ 56 mots, soit ~112 mots/min : faisable mais soutenu pour une voix « cinématique » (souvent 90–100 mots/min).

### ⚠️ Point de tension identifié
Le segment **21–25 s** (≈ 22 syllabes en 4 s) est le plus serré : il faudra soit l'enregistrer plus vite que le reste, soit le raccourcir. Proposition de variante :
> « Trois univers. Une ambition : construire ensemble. »

À trancher après l'enregistrement test.

### Prononciation
- « HashCode » : *hach-code* (comme en anglais), accent sur la première syllabe.
- « Reboot » : *ri-boute*.

## Directives d'enregistrement
- Pièce calme, traitée acoustiquement ; distance au micro constante.
- WAV 48 kHz / 24 bits.
- Plusieurs prises complètes + prises alternatives des phrases clés.
- Pas de réverbération ni d'effet à l'enregistrement.
- Ne pas surjouer. Laisser 1 s de silence entre les phrases.

## Livrables (→ `assets/voice/`)
1. `voiceover-master.wav`
2. `voiceover-clean.wav`
3. `voiceover-alternatives.wav`
4. `voiceover-script.pdf`

## Étape suivante
**Enregistrement test** (même au téléphone) → mesure du timing réel (whisper.cpp est installé pour mesurer chaque mot) → verrouillage de la timeline F03.

## Version produite (v4, 15/11/2026) — neuromarketing, voix « pub »
Script et leviers détaillés dans [F09](F09-neuromarketing.md). Source unique : `audio/script.json`.
Voix : Piper `fr_FR-gilles-low` (CC0), débit ×0,9, pauses 0,28 s, hauteur −0,5 demi-ton, traitement « radio » (compression forte, présence).
10 prises max par scène, la plus fidèle (whisper) et la plus dynamique est retenue. Durée : 29,4 s.
Limite connue : « HashCode Reboot » reste prononcé approximativement (logo affiché au même instant).
