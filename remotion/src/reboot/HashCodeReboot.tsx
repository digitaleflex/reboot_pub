// Publicité HashCode Reboot — 1080×1920, 30 fps (storyboard F03), durée pilotée par la voix off.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { COLORS } from "../brand";
import { LightSweep } from "./common";
import { AI, CTA, Community, Cyber, Hook, Vision, Web } from "./scenes";
import timeline from "../data/timeline.json";

const COMPONENTS = {
  "01-hook": Hook,
  "02-vision": Vision,
  "03-web": Web,
  "04-cyber": Cyber,
  "05-ia": AI,
  "06-community": Community,
  "07-cta": CTA,
} as const;

// Chronologie générée par production/hashcode-reboot/audio/build.py (calée sur la voix off)
export const SCENES = timeline.scenes as unknown as { id: keyof typeof COMPONENTS; from: number; dur: number; cues: Record<string, number> }[];
export const TOTAL = timeline.total;

export const HashCodeReboot: React.FC<{ withMusic?: boolean }> = ({ withMusic = true }) => (
  <AbsoluteFill style={{ backgroundColor: COLORS.black }}>
    {SCENES.map(({ id, from, dur, cues }) => {
      const C = COMPONENTS[id];
      return (
        <Sequence key={id} name={id} from={from} durationInFrames={dur}>
          <C dur={dur} cues={cues} />
        </Sequence>
      );
    })}
    {SCENES.slice(2, 6).map(({ from }) => from - 7).map((f) => (
      <Sequence key={f} name="light-sweep" from={f} durationInFrames={15}>
        <LightSweep />
      </Sequence>
    ))}
    {withMusic ? <Audio src={staticFile("mix.wav")} /> : null}
  </AbsoluteFill>
);
