// Publicité HashCode Reboot — 30 s, 1080×1920, 30 fps (storyboard F03).
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { COLORS } from "../brand";
import { LightSweep } from "./common";
import { AI, CTA, Community, Cyber, Hook, Vision, Web } from "./scenes";

export const SCENES = [
  { id: "01-hook", from: 0, dur: 90, C: Hook },
  { id: "02-vision", from: 90, dur: 90, C: Vision },
  { id: "03-web", from: 180, dur: 150, C: Web },
  { id: "04-cyber", from: 330, dur: 150, C: Cyber },
  { id: "05-ia", from: 480, dur: 150, C: AI },
  { id: "06-community", from: 630, dur: 120, C: Community },
  { id: "07-cta", from: 750, dur: 150, C: CTA },
] as const;

export const TOTAL = 900;

export const HashCodeReboot: React.FC<{ withMusic?: boolean }> = ({ withMusic = true }) => (
  <AbsoluteFill style={{ backgroundColor: COLORS.black }}>
    {SCENES.map(({ id, from, dur, C }) => (
      <Sequence key={id} name={id} from={from} durationInFrames={dur}>
        <C />
      </Sequence>
    ))}
    {[173, 323, 473, 623].map((f) => (
      <Sequence key={f} name="light-sweep" from={f} durationInFrames={15}>
        <LightSweep />
      </Sequence>
    ))}
    {withMusic ? <Audio src={staticFile("score.wav")} /> : null}
  </AbsoluteFill>
);
