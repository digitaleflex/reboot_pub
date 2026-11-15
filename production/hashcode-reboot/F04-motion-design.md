# F04 — Motion design

Référence pour le développement Remotion (`remotion/`) et le motion designer.

| Élément | Animation attendue | Réalisation proposée |
|---|---|---|
| Logo | Reveal, glow, particules | Remotion : SVG officiel, masque + `spring()`, bloom CSS |
| Titres | Kinetic typography, tracking, scale | Remotion : `interpolate()` sur letter-spacing / scale / blur |
| Arrière-plans | Parallax, profondeur | Remotion : 3 calques, vitesses différentes |
| Particules | Attraction, dispersion | Remotion : canvas/SVG déterministe (seed `random()`) |
| Interfaces Web | Perspective, slide, reveal | Remotion : CSS 3D `perspective` + `rotateY` |
| Cyber | Scanline, shield reveal | Remotion : SVG `stroke-dashoffset` + dégradé balayé |
| IA | Neural connections, pulse | Remotion : SVG nœuds/arêtes, pulsation par onde |
| Transitions | Light sweep, morph, match cut | `@remotion/transitions` + overlay lumineux custom |
| CTA | Scale-in, accent lumineux | Remotion : `spring()` + soulignement lime |
| Tunnel (scène 02) | Travelling avant | Remotion : grille en perspective ; Blender seulement si rendu 3D réaliste voulu |

## Courbes et timing
- Entrées : `spring({damping: 200})` (pas de rebond) ou ease-out cubique, 10–18 frames.
- Sorties : 6–10 frames, plus rapides que les entrées.
- Un mouvement principal à la fois par plan.

## Règles
- Cohérence avant spectacle : pas d'accumulation d'effets.
- Tout le texte dans la zone sûre (F01).
- Animations 100 % déterministes (frame-based) : jamais de `Math.random()` ni de CSS animations.
- Rien qui ressemble à une capture de la plateforme si ce n'est pas une capture réelle.

## Répartition des outils
- **Remotion** : tout le film (recommandé : un seul moteur pour la publicité).
- **Blender** : optionnel, uniquement si une scène exige de la vraie 3D (tunnel, bouclier volumétrique) ; rendu en séquence PNG avec alpha puis intégré dans Remotion.
- **Video Agent Skills** : non utilisé pour cette pub (réservé aux vidéos face caméra).
