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

## Version produite (v3, 15/11/2026) — script réécrit, voix grave et posée
Voix de synthèse en attendant un enregistrement humain : Piper `fr_FR-gilles-low` (≈ 94 Hz, CC0), hauteur abaissée d'1 demi-ton, débit ×1,05, pauses de 0,45 s entre les phrases.
Pour chaque scène, 8 prises au maximum sont générées ; la plus fidèle au texte (contrôle whisper) est retenue.

| Scène | Voix off |
|---|---|
| 01 Hook | En ce moment même… quelqu'un écrit le code qui changera ta vie. |
| 02 Vision | Et si… c'était toi ? |
| 03 Web | Tout commence par une idée. Quelques lignes de code. Et elle devient une application. |
| 04 Cyber | Derrière chaque écran, des menaces invisibles. Apprends à les arrêter. |
| 05 IA | Et l'intelligence artificielle ? Ne la subis pas. Construis-la. |
| 06 Communauté | Ici, personne n'avance seul. On apprend. On expérimente. On construit. Ensemble. |
| 07 CTA | HashCode Reboot. Ta place t'attend, où que tu sois. Le lien est dans ma bio. |

Source unique : `production/hashcode-reboot/audio/script.json`. Génération : `build.py` (voix + chronologie + musique + mix).
La durée totale découle de la voix : 44,2 s.
Limite connue : la synthèse prononce imparfaitement « HashCode Reboot » (le logo est affiché au même instant).
