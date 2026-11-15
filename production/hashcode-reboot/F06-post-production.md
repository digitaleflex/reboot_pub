# F06 — Montage et postproduction

## Pipeline
1. Voix off verrouillée → transcription mot à mot (whisper.cpp) → timings dans `remotion/src/data/voice-timings.json`.
2. Scènes Remotion indépendantes (une composition par scène + composition maître).
3. Intégration voix, musique, SFX dans Remotion (`<Audio>`, volumes animés pour le ducking).
4. Previews basse définition → contrôle visuel → corrections.
5. Rendu master.
6. Finition DaVinci Resolve **uniquement si nécessaire** (étalonnage avancé, mixage fin).

## Sous-titres
Sous-titres incrustés **mot à mot** en plus des titres (beaucoup regardent sans le son) — ou version sans sous-titres si les titres reprennent déjà tout le texte. À décider en preview.
Fichier `.srt` livré dans tous les cas.

## Exports
| Fichier | Spécification | Dossier |
|---|---|---|
| Master | 1080×1920, 30 fps, H.264 High, CRF 16, AAC 320 kb/s, −14 LUFS | `exports/master/` |
| TikTok / Reels / Shorts | 1080×1920, H.264, ~12 Mb/s, AAC 192 kb/s | `exports/tiktok/` |
| Previews | 540×960, CRF 28 | `exports/previews/` |
| Versions audio | avec voix / instrumentale / sans musique | `exports/master/` |
| Sous-titres | `.srt` | `exports/master/` |
| Couverture | PNG 1080×1920 (frame CTA) | `exports/master/` |
