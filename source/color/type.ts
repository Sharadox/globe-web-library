/** The globe's colours, channels from 0 to 1 (as shaders take them). */
export interface GlobeColors {
  /** Land dots, arcs and markers. */
  ink: [number, number, number];
  /** The same, as "#rrggbb", for standard three.js materials. */
  inkHex: string;
  /** The planet body, and its rim where it turns away. */
  body: [number, number, number];
  rim: [number, number, number];
  /** Light adds up on dark backgrounds; on light ones the ink is drawn normally. */
  additive: boolean;
}

/** Colours as a site writes them: "#rrggbb" values and whether the background is dark. */
export interface GlobePalette {
  ink: string;
  body: string;
  rim: string;
  dark: boolean;
}
