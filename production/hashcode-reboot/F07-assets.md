# F07 — Ressources et fichiers

## Checklist (à fournir avant production)
| # | Ressource | Emplacement | Statut |
|---|---|---|---|
| 1 | Logo officiel (SVG ou PNG transparent) | `brand/logo/` | ⏳ vu dans le chat, fichiers à déposer |
| 2 | Charte graphique et couleurs officielles | `brand/guidelines/` | 🟡 couleurs reçues, charte complète à confirmer |
| 3 | Polices autorisées | `brand/fonts/` | ⏳ proposition : Archivo + JetBrains Mono (OFL) |
| 4 | Capture réelle de la plateforme HashCode Reboot | `assets/images/` | ⏳ |
| 5 | Enregistrement voix off WAV | `assets/voice/` | ⏳ |
| 6 | Musique avec licence commerciale | `assets/music/` | ⏳ |
| 7 | Effets sonores avec licences | `assets/sfx/` | ⏳ |
| 8 | Images et vidéos de référence | `assets/images/`, `assets/video/` | ⏳ |
| 9 | URL officielle d'inscription | `brand/guidelines/brand.json` | ⏳ reboot.joinhashcode.com à confirmer |

**Prioritaires** : 1 (logo), 4 (capture), 5 (voix test).

## Ce qui sera créé par le studio (pas de ressource externe)
- Particules, grilles, tunnel, lignes lumineuses : Remotion (code).
- Fenêtres de code, interface abstraite, bouclier, réseau neuronal : SVG/CSS dans Remotion.
- Typographie animée : Remotion.

## Ce qui nécessite une ressource externe
Logo, voix, musique (ou fonds générés), SFX, capture réelle de la plateforme, polices si autres que OFL.

## Convention de nommage
`<type>-<sujet>-<variante>.<ext>` en minuscules, sans accents : `sfx-impact-deep-01.wav`, `music-hybrid-main.wav`.

## Licences
Chaque dossier d'assets tiers contient un `LICENSES.md` : source, licence, date, preuve d'achat.
