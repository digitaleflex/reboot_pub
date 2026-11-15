# Rapport technique — HashCode Creative Studio

Date : 15/11/2026 · Environnement d'installation : conteneur cloud Linux (Claude Code on the web).

## 1. Logiciels installés et vérifiés

| Outil | Version | Statut |
|---|---|---|
| Node.js / npm | 22.23.4 / 10.9.9 | ✅ déjà présent |
| Git | 2.43.0 | ✅ déjà présent |
| FFmpeg / FFprobe | 6.1.1 | ✅ déjà présent |
| Chrome (rendu) | Chrome for Testing 153.0.8010.12 | ✅ déjà présent |
| Python | 3.13.18 | ✅ déjà présent |
| Claude Code | 2.1.325 | ✅ déjà présent |
| whisper.cpp | commit 5922450, compilé depuis les sources | 🆕 installé (hors dépôt) |
| Modèle de transcription | ggml-large-v3-turbo-q5_0 (~0,5 Go) | 🆕 téléchargé (`~/.cache/whisper-cpp`) |
| Moteur short-editing | playwright-core 1.63.0, @mediapipe/tasks-vision | 🆕 installé |
| Remotion | 4.0.543 (+ @remotion/cli, google-fonts, transitions) | 🆕 installé dans `remotion/` |
| React | 19.3.1 | 🆕 |

Non installés (non requis à ce stade) : yt-dlp et deno (récupérer des vidéos YouTube pour `/studio-setup voice`, `/steal`, `/studio-script viral`), Treg, ElevenLabs, Codex, Blender, DaVinci Resolve.

## 2. Compétences disponibles (`.claude/skills/`, versions figées dans `skills-lock.json`)

**Video Agent Skills (13)** : editing, studio-setup, studio-script, short-editing, broll, clips, vox, steal, short-translate, publish, insta-audit, outliers, codex-images.

**Remotion (13)** : remotion-best-practices, remotion-create, remotion-docs, remotion-studio, remotion-render, remotion-multimedia, remotion-captions, remotion-saas, remotion-maps, remotion-markup, remotion-interactivity, remotion-upgrade, remotion-license.

Note : `npx remotion skills add` ne fonctionne qu'à l'intérieur d'un projet Remotion. Les skills ont été installés depuis le dépôt officiel `remotion-dev/skills`.

## 3. Tests effectués

| Test | Résultat |
|---|---|
| `engine/setup.mjs` (moteur Video Agent) | ✅ « engine ready » : Chrome, whisper, 10 fonds musicaux, 337 icônes |
| Transcription mot à mot (whisper.cpp) | ✅ 22 mots détectés sur l'échantillon de test |
| Short complet (init → words → prepare → render → final) avec le style `hashcode` | ✅ 1080×1920, 30 fps, −14,0 LUFS, true peak −4,3 dBTP, rendu à 95 fps |
| Composition Remotion `BrandTest` | ✅ `tsc` sans erreur, rendu MP4 1080×1920, 30 fps, 90 frames + still PNG |
| Coexistence des deux moteurs | ✅ `node_modules` séparés (`remotion/` et `short-editing/engine/`), aucun conflit |
| Lecture des fichiers de marque | ✅ Remotion lit `brand/guidelines/brand.json` directement |

Captures de contrôle : [`docs/tests/remotion-brand-test.png`](tests/remotion-brand-test.png), [`docs/tests/video-agent-engine-test.jpg`](tests/video-agent-engine-test.jpg).

## 4. Problèmes détectés

1. **Corrigé : sous-titres invisibles.** Avec un fond noir et une encre blanche, le bandeau prenait la couleur de l'encre : texte blanc sur bandeau blanc. Le style `hashcode` impose maintenant bandeau `#C8FF00` + texte `#050505`. Résultat vérifié sur le rendu.
2. **Logo officiel absent.** Les images envoyées dans le chat ne sont pas récupérables comme fichiers. À déposer dans `brand/logo/` (voir son README). Il faut aussi une version empilée **transparente** (celle reçue a un fond blanc).
3. **Script voix off serré** sur 21–25 s : environ 4,5 s de parole pour 4 s d'image. Variante proposée dans F02.
4. **URL d'inscription** `reboot.joinhashcode.com` non vérifiée.
5. **Handle Instagram et mot de commentaire du CTA** : valeurs provisoires dans `video-agent/styles/hashcode/style.json`.
6. **Brief son / moteur** : F05 prévoit des whooshes alors que le style par défaut de Video Agent les exclut. Aucun conflit pour la pub, qui est faite dans Remotion.
7. **Installation Windows** : ce studio a été installé dans le cloud. Sur ton PC, `setup.mjs` télécharge lui-même whisper.cpp pour Windows (voir §7).

## 5. Points en attente de validation (non appliqués)

- **Permissions Claude Code** : `/studio-setup` propose d'ajouter à `.claude/settings.json` :
  `Bash(yt-dlp *)`, `Bash(ffmpeg *)`, `Bash(ffprobe *)`, `Bash(node .claude/skills/short-editing/engine/*)`.
  Pas encore appliqué : il faut ton accord.
- **Profil personnel Eurin HASH** : `profiles/eurin-hash/voice.md` à remplir via `/studio-setup voice` (3 à 5 vidéos face caméra ou entretien), puis `/studio-setup style` sur une vraie prise.

## 6. Structure du studio

```
reboot_pub/
├── .claude/skills/          26 compétences (Video Agent + Remotion)
├── brand/
│   ├── logo/                ⏳ fichiers officiels à déposer
│   ├── fonts/
│   └── guidelines/brand.json  couleurs, domaines, plateformes, règles
├── production/hashcode-reboot/  README + F01 à F08
├── assets/{voice,music,sfx,images,video}/
├── remotion/                projet Remotion (BrandTest, lit brand.json)
├── video-agent/             studio Video Agent Skills
│   ├── voice.md             profil HashCode (marque)
│   ├── style.json           → style par défaut « hashcode »
│   └── styles/hashcode/     style de marque testé
├── profiles/eurin-hash/     profil personnel (séparé)
├── exports/{master,tiktok,previews}/
└── docs/                    ce rapport + captures de test
```

## 7. Prochaines étapes

1. **Déposer les 3 ressources prioritaires** : logo officiel (SVG/PNG transparent) → `brand/logo/`, capture réelle de la plateforme → `assets/images/`, voix test → `assets/voice/`.
2. Mesurer la voix test avec whisper.cpp, puis verrouiller la timeline F03.
3. Valider l'URL, le handle et les polices (Archivo + JetBrains Mono proposées, licence OFL).
4. Valider les permissions (§5).
5. Lancer la production de la pub avec le prompt maître (Remotion, 900 frames).
6. Sur ton PC Windows, pour travailler en local :
   ```powershell
   git clone https://github.com/digitaleflex/reboot_pub.git C:\HashCode-Creative-Studio
   cd C:\HashCode-Creative-Studio
   node .claude/skills/short-editing/engine/setup.mjs
   cd remotion; npm install; npm run studio
   ```
