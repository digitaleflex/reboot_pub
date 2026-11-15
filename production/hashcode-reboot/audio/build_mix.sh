#!/usr/bin/env bash
# Voix off (synthèse Piper, voix « upmc » Pierre, CC BY-SA 4.0) + musique (score.py) → remotion/public/mix.wav
# Usage : PIPER=<chemin piper> VOICE=<fr_FR-upmc-medium.onnx> bash build_mix.sh
# Chaque réplique est placée au début de sa scène (F03, 34 s).
set -euo pipefail
cd "$(dirname "$0")"
ROOT=../../..
OUT=$ROOT/assets/voice
TMP=$(mktemp -d)
mkdir -p "$OUT"

# id | départ (s) | texte (la marque est écrite en phonétique : « hach-code ri-boute », voir F02)
LINES=(
  "01|0.25|Le futur ne se regarde pas…"
  "02|3.15|Il se construit."
  "03|6.20|Le Web. Là où les idées deviennent des applications."
  "04|11.15|La cybersécurité. Là où les compétences protègent le monde numérique."
  "05|16.15|L'intelligence artificielle. Là où les possibilités repoussent les limites."
  "06|21.20|Les trois univers. Une ambition : apprendre, expérimenter, construire."
  "07|26.80|[[ aʃkˈod ʁibˈut ]]. Ta place est parmi les bâtisseurs. Rejoins-nous : le lien est dans ma bio."
)

inputs=(); filters=""; n=0
for l in "${LINES[@]}"; do
  IFS='|' read -r id start txt <<<"$l"
  echo "$txt" | "$PIPER" -m "$VOICE" -s 0 --length-scale 0.92 --sentence-silence 0.22 -f "$TMP/l$id.wav" 2>/dev/null
  ms=$(python3 -c "print(int(float('$start')*1000))")
  inputs+=(-i "$TMP/l$id.wav")
  filters+="[$n:a]aresample=48000,aformat=channel_layouts=stereo,adelay=${ms}|${ms}[v$n];"
  n=$((n+1))
done
mix_in=$(for i in $(seq 0 $((n-1))); do printf "[v%s]" "$i"; done)

# Piste voix : nettoyage, chaleur, présence, compression douce
ffmpeg -v error -y "${inputs[@]}" -filter_complex \
  "${filters}${mix_in}amix=inputs=$n:normalize=0,apad=whole_dur=34,atrim=0:34,highpass=f=70,equalizer=f=160:t=q:w=1:g=2.5,equalizer=f=3200:t=q:w=1.2:g=2,acompressor=threshold=-20dB:ratio=3:attack=8:release=150:makeup=2,loudnorm=I=-16:TP=-3[vo]" \
  -map "[vo]" -ar 48000 "$OUT/voiceover-master.wav"

# Musique 34 s
python3 -I score.py "$TMP/score.wav"

# Mix : la musique baisse automatiquement sous la voix (sidechain), puis loudness TikTok
ffmpeg -v error -y -i "$TMP/score.wav" -i "$OUT/voiceover-master.wav" -filter_complex \
  "[0:a]volume=-5dB[m];[1:a]asplit=2[vk][vs];[m][vs]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=350:makeup=1[duck];[duck][vk]amix=inputs=2:normalize=0,acompressor=threshold=-16dB:ratio=2.5:attack=5:release=120,loudnorm=I=-14:TP=-3:LRA=9,alimiter=limit=0.7:level=false[out]" \
  -map "[out]" -ar 48000 "$ROOT/remotion/public/mix.wav"

# Versions annexes (F05) : instrumentale seule
cp "$TMP/score.wav" "$ROOT/remotion/public/score.wav"
rm -rf "$TMP"
echo "ok : assets/voice/voiceover-master.wav, remotion/public/mix.wav"
