import type { GlobeColors } from "@sharadox/globe-web-library/color/type";

export interface ArcProperties {
  colors: GlobeColors;
  from: { latitude: number; longitude: number };
  to: readonly [number, number];
  /** Phase of the travelling pulse, 0–1, so arcs don't pulse in sync. */
  offset: number;
}
