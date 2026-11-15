import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Archivo";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { COLORS, VIDEO } from "../brand";

export const { fontFamily: DISPLAY } = loadFont("normal", {
  weights: ["500", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
});
export const { fontFamily: MONO } = loadMono("normal", { weights: ["400", "500", "700"], subsets: ["latin", "latin-ext"] });

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Fond commun : noir, grille de points discrète, halo lime, vignette. */
export const Backdrop: React.FC<{ glow?: number; glowY?: number }> = ({ glow = 0.18, glowY = 50 }) => (
  <AbsoluteFill style={{ backgroundColor: COLORS.black }}>
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(rgba(255,255,255,0.07) 1.6px, transparent 1.6px)`,
        backgroundSize: "44px 44px",
        backgroundPosition: "22px 22px",
      }}
    />
    <AbsoluteFill
      style={{ background: `radial-gradient(ellipse 70% 40% at 50% ${glowY}%, rgba(200,255,0,${glow}), transparent 70%)` }}
    />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.85) 100%)" }} />
  </AbsoluteFill>
);

/** Entrée/sortie d'une scène : fondu + léger zoom. */
export const SceneShell: React.FC<{ duration: number; children: React.ReactNode; outFrames?: number }> = ({
  duration,
  children,
  outFrames = 8,
}) => {
  const frame = useCurrentFrame();
  const inO = interpolate(frame, [0, 6], [0, 1], clamp);
  const outO = interpolate(frame, [duration - outFrames, duration], [1, 0], clamp);
  const scale = interpolate(frame, [0, duration], [1.0, 1.04]);
  return (
    <AbsoluteFill style={{ opacity: Math.min(inO, outO), transform: `scale(${scale})` }}>{children}</AbsoluteFill>
  );
};

/** Typographie cinétique : chaque ligne entre avec flou → net, tracking qui se resserre. */
export const KineticTitle: React.FC<{
  lines: { text: string; accent?: boolean }[];
  size: number;
  delay?: number;
  stagger?: number;
  top?: number;
  weight?: number;
}> = ({ lines, size, delay = 0, stagger = 5, top, weight = 900 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: VIDEO.safe.side,
        right: VIDEO.safe.side,
        top: top ?? undefined,
        bottom: top === undefined ? 0 : undefined,
        height: top === undefined ? "100%" : undefined,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {lines.map((l, i) => {
        const p = spring({ frame: frame - delay - i * stagger, fps, config: { damping: 200 }, durationInFrames: 18 });
        return (
          <div
            key={i}
            style={{
              fontFamily: DISPLAY,
              fontWeight: weight,
              fontSize: size,
              lineHeight: 1.04,
              color: l.accent ? COLORS.lime : COLORS.white,
              letterSpacing: `${interpolate(p, [0, 1], [0.35, 0.02])}em`,
              opacity: p,
              filter: `blur(${interpolate(p, [0, 1], [14, 0])}px)`,
              transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
              textAlign: "center",
              whiteSpace: "nowrap",
              textShadow: l.accent ? `0 0 40px rgba(200,255,0,0.45)` : "0 0 30px rgba(0,0,0,0.6)",
            }}
          >
            {l.text}
          </div>
        );
      })}
    </div>
  );
};

/** Sous-titre (phrase de la narration), apparition mot à mot. */
export const Subline: React.FC<{ text: string; delay: number; top: number; size?: number; perWord?: number }> = ({
  text,
  delay,
  top,
  size = 46,
  perWord = 3,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: VIDEO.safe.side + 20,
        right: VIDEO.safe.side + 20,
        textAlign: "center",
        fontFamily: DISPLAY,
        fontWeight: 500,
        fontSize: size,
        lineHeight: 1.3,
        color: COLORS.gray,
      }}
    >
      {words.map((w, i) => {
        const o = interpolate(frame, [delay + i * perWord, delay + i * perWord + 6], [0, 1], clamp);
        return (
          <span key={i} style={{ opacity: o, display: "inline-block", marginRight: "0.28em", transform: `translateY(${(1 - o) * 10}px)` }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Label monospace du type « 01 / WEB » en haut de l'écran. */
export const Tag: React.FC<{ index: string; label: string; delay?: number }> = ({ index, label, delay = 4 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [delay, delay + 10], [0, 1], clamp);
  const w = interpolate(frame, [delay, delay + 20], [0, 120], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: VIDEO.safe.top + 10,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 22,
        opacity: o,
        fontFamily: MONO,
        fontSize: 30,
        letterSpacing: "0.3em",
        color: COLORS.gray,
      }}
    >
      <span style={{ color: COLORS.lime }}>{index}</span>
      <span style={{ width: w, height: 2, background: COLORS.lime }} />
      <span>{label}</span>
    </div>
  );
};

/** Balayage lumineux diagonal (transition entre scènes). */
export const LightSweep: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 14], [-1400, 1800], clamp);
  const o = interpolate(frame, [0, 3, 11, 14], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: o, mixBlendMode: "screen" }}>
      <div
        style={{
          position: "absolute",
          top: -400,
          left: x,
          width: 260,
          height: 2800,
          transform: "rotate(18deg)",
          background: "linear-gradient(90deg, transparent, rgba(200,255,0,0.55), rgba(255,255,255,0.9), rgba(200,255,0,0.55), transparent)",
          filter: "blur(18px)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Particules déterministes. */
export const makeParticles = (n: number, seed: string) =>
  new Array(n).fill(0).map((_, i) => ({
    x: random(`${seed}x${i}`) * VIDEO.width,
    y: random(`${seed}y${i}`) * VIDEO.height,
    r: 1 + random(`${seed}r${i}`) * 2.6,
    s: 0.4 + random(`${seed}s${i}`) * 1.2,
  }));
