import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, VIDEO } from "../brand";
import { Backdrop, DISPLAY, KineticTitle, MONO, SceneShell, Subline, Tag, clamp, makeParticles } from "./common";

const W = VIDEO.width;
const H = VIDEO.height;

/* ───────────── 01 — THE HOOK (0–3 s) ───────────── */
const P1 = makeParticles(80, "hook");
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const cy = H / 2;
  const beam = interpolate(frame, [0, 12], [0.35, 1], clamp);
  const beamO = interpolate(frame, [14, 40], [1, 0.3], clamp);
  const pull = interpolate(frame, [0, 34], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  return (
    <SceneShell duration={90}>
      <Backdrop glow={interpolate(frame, [0, 20], [0.35, 0.12], clamp)} />
      {P1.map((p, i) => {
        const x = interpolate(pull, [0, 1], [p.x, W / 2 + (p.x - W / 2) * 0.12]);
        const y = interpolate(pull, [0, 1], [p.y, cy + (p.y - cy) * 0.12]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.r * 2,
              height: p.r * 2,
              borderRadius: "50%",
              background: COLORS.lime,
              opacity: 0.7 * (1 - pull * 0.55),
              boxShadow: `0 0 10px ${COLORS.lime}`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          top: cy - 1.5,
          left: W / 2 - (W / 2) * beam,
          width: W * beam,
          height: 3,
          background: COLORS.lime,
          opacity: beamO,
          boxShadow: `0 0 30px 6px ${COLORS.lime}`,
        }}
      />
      <KineticTitle
        delay={4}
        stagger={5}
        size={132}
        lines={[{ text: "LE FUTUR" }, { text: "NE SE" }, { text: "REGARDE", accent: true }, { text: "PAS." }]}
      />
    </SceneShell>
  );
};

/* ───────────── 02 — THE VISION (3–6 s) : tunnel numérique ───────────── */
export const Vision: React.FC = () => {
  const frame = useCurrentFrame();
  const rings = 18;
  const rays = 16;
  return (
    <SceneShell duration={90} outFrames={4}>
      <Backdrop glow={0.08} />
      <AbsoluteFill>
        {new Array(rays).fill(0).map((_, i) => {
          const a = (i / rays) * 360 + frame * 0.15;
          return (
            <div
              key={`r${i}`}
              style={{
                position: "absolute",
                left: W / 2,
                top: H / 2,
                width: 1400,
                height: 1.5,
                transformOrigin: "0 50%",
                transform: `rotate(${a}deg)`,
                background: "linear-gradient(90deg, transparent 5%, rgba(200,255,0,0.35) 60%, transparent)",
              }}
            />
          );
        })}
        {new Array(rings).fill(0).map((_, i) => {
          const z = (i / rings + frame * 0.011) % 1;
          const s = Math.pow(z, 2.6) * 3.2;
          const o = interpolate(z, [0, 0.15, 0.75, 1], [0, 0.9, 0.6, 0]);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: W / 2 - 300,
                top: H / 2 - 533,
                width: 600,
                height: 1066,
                border: `${2 / Math.max(s, 0.3)}px solid ${COLORS.lime}`,
                borderRadius: 18,
                opacity: o,
                transform: `scale(${s})`,
                boxShadow: `0 0 18px rgba(200,255,0,0.25)`,
              }}
            />
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(5,5,5,0.85) 18%, transparent 55%)" }} />
      <KineticTitle delay={6} stagger={6} size={150} lines={[{ text: "IL SE" }, { text: "CONSTRUIT.", accent: true }]} />
    </SceneShell>
  );
};

/* ───────────── 03 — WEB & APPLICATIONS (6–11 s) ───────────── */
const CODE: { t: string; c?: string }[] = [
  { t: "export function Projet() {", c: COLORS.lime },
  { t: "  const [idee, setIdee] =" },
  { t: "    useState(\"une idée\");" },
  { t: "" },
  { t: "  return (" },
  { t: "    <App>", c: COLORS.lime },
  { t: "      <Interface idee={idee} />" },
  { t: "      <Deploy />" },
  { t: "    </App>", c: COLORS.lime },
  { t: "  );" },
  { t: "}", c: COLORS.lime },
];
export const Web: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = Math.floor(interpolate(frame, [6, 90], [0, CODE.reduce((a, l) => a + l.t.length + 1, 0)], clamp));
  let left = chars;
  const pan = interpolate(frame, [0, 150], [60, -60]);
  const win = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 22 });
  const card = spring({ frame: frame - 26, fps, config: { damping: 200 }, durationInFrames: 22 });
  return (
    <SceneShell duration={150}>
      <Backdrop glow={0.12} glowY={36} />
      <Tag index="01" label="WEB & APPS" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, height: 700, perspective: 1600 }}>
        {/* fenêtre de code */}
        <div
          style={{
            position: "absolute",
            left: 90 + pan,
            top: 40,
            width: 780,
            height: 560,
            borderRadius: 22,
            background: "rgba(18,18,18,0.92)",
            border: "1.5px solid rgba(255,255,255,0.12)",
            boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 60px rgba(200,255,0,0.08)",
            transform: `rotateY(${interpolate(win, [0, 1], [-35, -14])}deg) rotateX(6deg) translateZ(${interpolate(win, [0, 1], [-300, 0])}px)`,
            opacity: win,
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", gap: 12, padding: "22px 26px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: i === 0 ? COLORS.lime : "rgba(255,255,255,0.2)" }} />
            ))}
          </div>
          <div style={{ padding: "22px 30px", fontFamily: MONO, fontSize: 29, lineHeight: 1.55, color: COLORS.white }}>
            {CODE.map((l, i) => {
              const shown = l.t.slice(0, Math.max(0, left));
              const typing = left >= 0 && left <= l.t.length;
              left -= l.t.length + 1;
              return (
                <div key={i} style={{ color: l.c ?? "rgba(255,255,255,0.85)", whiteSpace: "pre", minHeight: "1.55em" }}>
                  <span style={{ color: COLORS.gray, opacity: 0.5, marginRight: 22 }}>{String(i + 1).padStart(2, " ")}</span>
                  {shown}
                  {typing && Math.floor(frame / 8) % 2 === 0 ? <span style={{ color: COLORS.lime }}>▌</span> : null}
                </div>
              );
            })}
          </div>
        </div>
        {/* carte d'interface abstraite */}
        <div
          style={{
            position: "absolute",
            left: 600 + pan * 1.6,
            top: 380,
            width: 360,
            height: 270,
            borderRadius: 22,
            background: "rgba(24,24,24,0.95)",
            border: `1.5px solid rgba(200,255,0,0.45)`,
            boxShadow: "0 30px 90px rgba(0,0,0,0.85), 0 0 40px rgba(200,255,0,0.15)",
            transform: `rotateY(-10deg) translateX(${interpolate(card, [0, 1], [240, 0])}px)`,
            opacity: card,
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div style={{ width: 70, height: 70, borderRadius: 16, background: COLORS.lime }} />
          <div style={{ width: "85%", height: 18, borderRadius: 9, background: "rgba(255,255,255,0.85)" }} />
          <div style={{ width: "60%", height: 14, borderRadius: 7, background: "rgba(255,255,255,0.3)" }} />
          <div style={{ width: `${interpolate(card, [0, 1], [0, 100])}%`, height: 10, borderRadius: 5, background: COLORS.lime, marginTop: "auto" }} />
        </div>
      </div>
      <KineticTitle top={1060} delay={18} stagger={6} size={100} lines={[{ text: "WEB &" }, { text: "APPLICATIONS", accent: true }]} />
      <Subline top={1330} delay={40} text="Là où les idées deviennent des applications." />
    </SceneShell>
  );
};

/* ───────────── 04 — CYBERSÉCURITÉ (11–16 s) ───────────── */
const NODES4 = makeParticles(22, "cyber").map((p) => ({ x: 80 + (p.x / W) * (W - 160), y: 300 + (p.y / H) * 760 }));
const SHIELD = "M200 20 L360 80 V200 C360 300 290 370 200 410 C110 370 40 300 40 200 V80 Z";
export const Cyber: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(frame, [8, 50], [1, 0], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) });
  const fill = interpolate(frame, [45, 70], [0, 1], clamp);
  const lock = spring({ frame: frame - 55, fps, config: { damping: 14 }, durationInFrames: 25 });
  const scan = interpolate(frame % 50, [0, 50], [0, 1]);
  const cx = W / 2;
  const cy = 680;
  return (
    <SceneShell duration={150}>
      <Backdrop glow={0.1} glowY={36} />
      <Tag index="02" label="CYBERSÉCURITÉ" />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {NODES4.map((n, i) => {
          const o = interpolate(frame, [i * 1.5, i * 1.5 + 12], [0, 1], clamp);
          // paquet de données voyageant vers le bouclier
          const tp = ((frame * 0.018 + i * 0.137) % 1);
          const px = n.x + (cx - n.x) * tp;
          const py = n.y + (cy - n.y) * tp;
          return (
            <g key={i} opacity={o}>
              <line x1={n.x} y1={n.y} x2={cx} y2={cy} stroke="rgba(255,255,255,0.10)" strokeWidth={1.5} />
              <circle cx={n.x} cy={n.y} r={6} fill="none" stroke={COLORS.gray} strokeWidth={2} />
              <circle cx={px} cy={py} r={4} fill={COLORS.lime} opacity={interpolate(tp, [0, 0.1, 0.85, 1], [0, 1, 1, 0])} />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: cx - 220, top: cy - 230, width: 440, height: 460 }}>
        <svg viewBox="0 0 400 430" width={440} height={460} style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="sh" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="rgba(200,255,0,0.35)" />
              <stop offset="1" stopColor="rgba(200,255,0,0.04)" />
            </linearGradient>
            <clipPath id="clip">
              <path d={SHIELD} />
            </clipPath>
          </defs>
          <path d={SHIELD} fill="#0a0a0a" />
          <path d={SHIELD} fill="url(#sh)" opacity={fill} />
          <g clipPath="url(#clip)">
            <rect x={0} y={scan * 470 - 40} width={400} height={40} fill="rgba(200,255,0,0.35)" opacity={fill} />
            {new Array(14).fill(0).map((_, i) => (
              <line key={i} x1={0} x2={400} y1={i * 32} y2={i * 32} stroke="rgba(200,255,0,0.12)" opacity={fill} />
            ))}
          </g>
          <path
            d={SHIELD}
            fill="none"
            stroke={COLORS.lime}
            strokeWidth={6}
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={draw}
            style={{ filter: "drop-shadow(0 0 14px rgba(200,255,0,0.8))" }}
          />
          {/* cadenas */}
          <g transform={`translate(200 225) scale(${lock})`}>
            <path d="M-36 -10 V-38 A36 36 0 0 1 36 -38 V-10" fill="none" stroke={COLORS.white} strokeWidth={12} />
            <rect x={-56} y={-14} width={112} height={88} rx={14} fill={COLORS.white} />
            <circle cx={0} cy={22} r={11} fill={COLORS.black} />
          </g>
        </svg>
      </div>
      <KineticTitle top={1060} delay={20} stagger={6} size={112} lines={[{ text: "CYBER" }, { text: "SÉCURITÉ", accent: true }]} />
      <Subline top={1330} delay={42} text="Là où les compétences protègent le monde numérique." />
    </SceneShell>
  );
};

/* ───────────── 05 — INTELLIGENCE ARTIFICIELLE (16–21 s) ───────────── */
const LAYERS = [4, 6, 6, 3];
const NN = LAYERS.map((n, li) =>
  new Array(n).fill(0).map((_, ni) => ({
    x: 150 + (li * (W - 300)) / (LAYERS.length - 1),
    y: 680 + (ni - (n - 1) / 2) * 105,
  })),
);
export const AI: React.FC = () => {
  const frame = useCurrentFrame();
  const wave = (frame * 0.035) % 1.4; // position de l'onde (0 → 1 = gauche → droite)
  const appear = (li: number) => interpolate(frame, [li * 6, li * 6 + 14], [0, 1], clamp);
  return (
    <SceneShell duration={150}>
      <Backdrop glow={0.12} glowY={36} />
      <Tag index="03" label="IA" />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {NN.slice(0, -1).map((layer, li) =>
          layer.map((a, ai) =>
            NN[li + 1].map((b, bi) => {
              const pos = (li + 0.5) / (LAYERS.length - 1);
              const hot = Math.max(0, 1 - Math.abs(wave - pos) * 5);
              return (
                <line
                  key={`${li}-${ai}-${bi}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={hot > 0.05 ? COLORS.lime : "rgba(255,255,255,0.12)"}
                  strokeOpacity={hot > 0.05 ? 0.2 + hot * 0.7 : 1}
                  strokeWidth={1.5 + hot * 1.5}
                  opacity={appear(li + 1)}
                />
              );
            }),
          ),
        )}
        {NN.map((layer, li) =>
          layer.map((n, ni) => {
            const pos = li / (LAYERS.length - 1);
            const hot = Math.max(0, 1 - Math.abs(wave - pos) * 5);
            return (
              <g key={`${li}-${ni}`} opacity={appear(li)}>
                <circle cx={n.x} cy={n.y} r={22 + hot * 10} fill="rgba(200,255,0,0.12)" opacity={hot} />
                <circle cx={n.x} cy={n.y} r={14} fill={hot > 0.3 ? COLORS.lime : "#111"} stroke={COLORS.lime} strokeWidth={3} />
              </g>
            );
          }),
        )}
      </svg>
      <KineticTitle top={1060} delay={18} stagger={6} size={100} lines={[{ text: "INTELLIGENCE" }, { text: "ARTIFICIELLE", accent: true }]} />
      <Subline top={1330} delay={42} text="Là où les possibilités repoussent les limites." />
    </SceneShell>
  );
};

/* ───────────── 06 — THE COMMUNITY (21–25 s) ───────────── */
/** Symbole H officiel : partie gauche du logo (aucun redessin). */
export const LogoSymbol: React.FC<{ height: number }> = ({ height }) => {
  // logo.png : 1232 × 294, le symbole occupe ~30 % de la largeur à gauche
  const scale = height / 294;
  return (
    <div style={{ width: 372 * scale, height, overflow: "hidden", position: "relative" }}>
      <Img src={staticFile("logo.png")} style={{ height, width: 1232 * scale, position: "absolute", left: 0 }} />
    </div>
  );
};

const GLYPHS = [
  { label: "</>", from: [-360, -260] },
  { label: "◈", from: [360, -260] },
  { label: "⬡", from: [0, 380] },
];
export const Community: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const conv = interpolate(frame, [0, 26], [0, 1], { ...clamp, easing: (t) => t * t * t });
  const flash = interpolate(frame, [24, 28, 40], [0, 1, 0], clamp);
  const sym = spring({ frame: frame - 26, fps, config: { damping: 200 }, durationInFrames: 20 });
  const words = ["APPRENDRE.", "EXPÉRIMENTER.", "CONSTRUIRE."];
  const cy = 640;
  return (
    <SceneShell duration={165} outFrames={6}>
      <Backdrop glow={0.1 + flash * 0.5} glowY={33} />
      <div
        style={{
          position: "absolute",
          top: VIDEO.safe.top + 10,
          width: "100%",
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 32,
          letterSpacing: "0.2em",
          color: COLORS.gray,
          opacity: interpolate(frame, [0, 10], [0, 1], clamp),
        }}
      >
        LES TROIS UNIVERS. <span style={{ color: COLORS.lime }}>UNE AMBITION.</span>
      </div>
      {GLYPHS.map((g, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: W / 2 - 80 + g.from[0] * (1 - conv),
            top: cy - 80 + g.from[1] * (1 - conv),
            width: 160,
            height: 160,
            borderRadius: 32,
            border: `2px solid ${COLORS.lime}`,
            background: "rgba(200,255,0,0.06)",
            color: COLORS.lime,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 1 - interpolate(frame, [22, 28], [0, 1], clamp),
            boxShadow: "0 0 40px rgba(200,255,0,0.25)",
          }}
        >
          {g.label}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: cy - 150,
          display: "flex",
          justifyContent: "center",
          opacity: sym,
          transform: `scale(${interpolate(sym, [0, 1], [0.6, 1])})`,
          filter: `drop-shadow(0 0 ${30 + flash * 60}px rgba(200,255,0,0.5))`,
        }}
      >
        <LogoSymbol height={300} />
      </div>
      <AbsoluteFill style={{ background: COLORS.white, opacity: flash * 0.35, mixBlendMode: "screen" }} />
      <div style={{ position: "absolute", top: 960, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        {words.map((w, i) => {
          const p = spring({ frame: frame - [72, 93, 125][i], fps, config: { damping: 200 }, durationInFrames: 14 });
          return (
            <div
              key={w}
              style={{
                fontFamily: DISPLAY,
                fontWeight: 900,
                fontSize: 96,
                lineHeight: 1.05,
                color: i === 2 ? COLORS.lime : COLORS.white,
                opacity: p,
                letterSpacing: `${interpolate(p, [0, 1], [0.3, 0.02])}em`,
                filter: `blur(${(1 - p) * 12}px)`,
                textShadow: i === 2 ? "0 0 40px rgba(200,255,0,0.45)" : undefined,
              }}
            >
              {w}
            </div>
          );
        })}
      </div>
    </SceneShell>
  );
};

/* ───────────── 07 — FINAL CTA (25–30 s) ───────────── */
export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wipe = interpolate(frame, [2, 24], [0, 100], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const glow = interpolate(frame, [10, 30, 70], [0, 1, 0.45], clamp);
  const btn = spring({ frame: frame - 110, fps, config: { damping: 12 }, durationInFrames: 30 });
  const pulse = 1 + Math.max(0, Math.sin((frame - 130) / 9)) * 0.03 * (frame > 130 ? 1 : 0);
  const url = interpolate(frame, [96, 108], [0, 1], clamp);
  const bio = spring({ frame: frame - 136, fps, config: { damping: 14 }, durationInFrames: 20 });
  const bioPulse = frame > 160 ? 0.5 + 0.5 * Math.sin((frame - 160) / 6) : 1;
  return (
    <AbsoluteFill style={{ opacity: interpolate(frame, [0, 6], [0, 1], clamp) }}>
      <Backdrop glow={0.12 + glow * 0.12} glowY={30} />
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", clipPath: `inset(0 ${100 - wipe}% 0 0)`, filter: `drop-shadow(0 0 ${20 * glow}px rgba(200,255,0,0.6))` }}>
          <Img src={staticFile("logo.png")} style={{ width: 920, display: "block" }} />
        </div>
      </div>
      <KineticTitle
        top={720}
        delay={56}
        stagger={5}
        size={92}
        lines={[{ text: "TA PLACE EST" }, { text: "PARMI LES" }, { text: "BÂTISSEURS.", accent: true }]}
      />
      <div
        style={{
          position: "absolute",
          top: 1110,
          width: "100%",
          textAlign: "center",
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: 42,
          color: COLORS.lime,
          letterSpacing: "0.04em",
          opacity: url,
          transform: `translateY(${(1 - url) * 16}px)`,
        }}
      >
        reboot.joinhashcode.com
      </div>
      <div style={{ position: "absolute", top: 1210, width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            padding: "34px 84px",
            borderRadius: 999,
            background: COLORS.lime,
            color: COLORS.black,
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 58,
            letterSpacing: "0.06em",
            transform: `scale(${btn * pulse})`,
            boxShadow: `0 0 ${40 + 30 * Math.max(0, Math.sin(frame / 9))}px rgba(200,255,0,0.55)`,
          }}
        >
          REJOINS-NOUS →
        </div>
      </div>
      <div style={{ position: "absolute", top: 1395, width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "18px 34px",
            borderRadius: 16,
            border: `2px solid ${COLORS.lime}`,
            background: "rgba(200,255,0,0.08)",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 38,
            letterSpacing: "0.12em",
            color: COLORS.white,
            opacity: bio,
            transform: `translateY(${(1 - bio) * 30}px) scale(${interpolate(bio, [0, 1], [0.85, 1])})`,
            boxShadow: `0 0 ${24 * bioPulse}px rgba(200,255,0,0.45)`,
          }}
        >
          <span style={{ color: COLORS.lime }}>↑</span> LIEN DANS MA BIO
        </div>
      </div>
    </AbsoluteFill>
  );
};
