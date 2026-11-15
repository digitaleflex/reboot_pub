# HashCode Creative Studio

Studio de production vidéo de HashCode. Langue de travail : **français**.

## Deux moteurs, deux usages
- **Remotion** (`remotion/`) : publicités de marque et motion design sur mesure. Skills `remotion-*`.
- **Video Agent Skills** (`video-agent/`, skills `/editing`, `/short-editing`, etc.) : vidéos face caméra, sous-titres, clips, réseaux sociaux.

## Deux profils, jamais mélangés
- Marque **HashCode** : `video-agent/voice.md` + `video-agent/styles/hashcode/` (style par défaut).
- Personnel **Eurin HASH** : `profiles/eurin-hash/voice.md` + `video-agent/styles/eurin-hash/` (`/short-editing <take> style eurin-hash`).

## Sources de vérité
- Charte : `brand/guidelines/brand.json` (Remotion l'importe directement). Couleurs : #050505, #C8FF00, #FFFFFF, #A0A0A0.
- Campagne en cours : `production/hashcode-reboot/` (fiches F01 à F08).
- Le logo vient **uniquement** de `brand/logo/`. Ne jamais le redessiner.

## Règles non négociables
- Aucun témoignage, chiffre ou résultat inventé.
- Aucune fausse interface ou fonctionnalité de la plateforme.
- Aucun livrable validé sans rendu réel et contrôle visuel (F08).
- Ressources tierces : licence commerciale archivée dans un `LICENSES.md`.

## Environnement
- Moteur short-editing : `node .claude/skills/short-editing/engine/setup.mjs`. Sous Linux, définir `WHISPER_CLI` (whisper.cpp compilé).
- Remotion : `cd remotion && npm install && npm run studio`.
