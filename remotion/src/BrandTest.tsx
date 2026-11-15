// Composition de TEST du pipeline (pas la campagne) : vérifie polices, couleurs,
// animation déterministe et rendu 1080x1920. Le logo n'est pas utilisé tant que
// les fichiers officiels ne sont pas dans brand/logo/.
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Archivo";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { COLORS, VIDEO } from "./brand";

const { fontFamily } = loadFont("normal", { weights: ["800", "900"], subsets: ["latin", "latin-ext"] });
const { fontFamily: mono } = loadMono("normal", { weights: ["500"], subsets: ["latin"] });

const PARTICLES = new Array(60).fill(0).map((_, i) => ({
  x: random(`x${i}`) * VIDEO.width,
  y: random(`y${i}`) * VIDEO.height,
  r: 1 + random(`r${i}`) * 2.5,
}));

export const BrandTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cy = VIDEO.height / 2;

  // Impulsion lumineuse horizontale (frames 0–20)
  const beam = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const beamFade = interpolate(frame, [18, 40], [1, 0.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Particules convergentes vers le centre
  const pull = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  // Titre : spring sans rebond + tracking qui se resserre
  const enter = spring({ frame: frame - 14, fps, config: { damping: 200 } });
  const tracking = interpolate(enter, [0, 1], [0.4, 0.04]);
  const blur = interpolate(enter, [0, 1], [12, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black }}>
      {PARTICLES.map((p, i) => {
        const x = interpolate(pull, [0, 1], [p.x, VIDEO.width / 2 + (p.x - VIDEO.width / 2) * 0.15]);
        const y = interpolate(pull, [0, 1], [p.y, cy + (p.y - cy) * 0.15]);
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
              opacity: 0.5 * (1 - pull * 0.6),
              boxShadow: `0 0 8px ${COLORS.lime}`,
            }}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          top: cy - 1,
          left: VIDEO.width / 2 - (VIDEO.width / 2) * beam,
          width: VIDEO.width * beam,
          height: 2,
          background: COLORS.lime,
          opacity: beamFade,
          boxShadow: `0 0 24px 4px ${COLORS.lime}`,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: `0 ${VIDEO.safe.side}px`,
        }}
      >
        <div
          style={{
            fontFamily,
            fontWeight: 900,
            fontSize: 112,
            lineHeight: 1.02,
            textAlign: "center",
            color: COLORS.white,
            letterSpacing: `${tracking}em`,
            opacity: enter,
            filter: `blur(${blur}px)`,
            transform: `scale(${interpolate(enter, [0, 1], [1.08, 1])})`,
          }}
        >
          LE FUTUR
          <br />
          NE SE <span style={{ color: COLORS.lime }}>REGARDE</span>
          <br />
          PAS.
        </div>
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          bottom: VIDEO.safe.bottom,
          width: "100%",
          textAlign: "center",
          fontFamily: mono,
          fontSize: 28,
          color: COLORS.gray,
          letterSpacing: "0.2em",
        }}
      >
        TEST DE RENDU · PIPELINE
      </div>
    </AbsoluteFill>
  );
};
