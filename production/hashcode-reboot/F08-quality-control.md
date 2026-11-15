# F08 — Contrôle qualité

Aucun livrable n'est validé sans avoir été **réellement rendu et regardé**.

## Technique
- [ ] 1080×1920, 30 fps, 900 frames exactement (`ffprobe`)
- [ ] Pas de frame noire ou figée involontaire
- [ ] Audio : −14 LUFS ±1, true peak ≤ −1 dBTP, aucune saturation (`ffmpeg -af ebur128`)
- [ ] Voix synchronisée avec les titres (écart ≤ 2 frames)
- [ ] Fichier lisible sur iPhone et Android

## Lisibilité mobile
- [ ] Tout le texte dans la zone sûre (220 px en haut, 380 px en bas, 64 px sur les côtés)
- [ ] Chaque titre reste affiché assez longtemps pour être lu (≥ 0,4 s par mot)
- [ ] Contraste suffisant (blanc/lime sur #050505)
- [ ] Compréhensible sans le son (sous-titres ou titres)

## Cohérence artistique
- [ ] Palette respectée (4 couleurs, pas d'intrus)
- [ ] Logo officiel, non déformé, non redessiné
- [ ] Un mouvement principal par plan, pas d'accumulation d'effets
- [ ] Hook en mouvement dès les premières frames

## Conformité publicitaire
- [ ] Aucun témoignage, statistique ou résultat inventé
- [ ] Aucune fausse interface / fonctionnalité de la plateforme
- [ ] URL vérifiée et fonctionnelle
- [ ] Licences de toutes les ressources tierces archivées
- [ ] Respect des règles publicitaires TikTok / Meta / YouTube

## Validation
| Étape | Qui | Date | OK |
|---|---|---|---|
| Preview v1 | | | |
| Preview v2 | | | |
| Master | | | |
