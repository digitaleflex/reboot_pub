// Source unique de vérité : brand/guidelines/brand.json
import brand from "../../brand/guidelines/brand.json";

export const COLORS = brand.colors;

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
  // Zone sûre TikTok / Reels / Shorts (F01)
  safe: { top: 220, bottom: 380, side: 64 },
} as const;
