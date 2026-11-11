import { hexChannel } from "@sharadox/globe-web-library/hex-channel";
import type { GlobeColors, GlobePalette } from "@sharadox/globe-web-library/color/type";

/**
 * Turns a palette (hex colors and whether the page is dark) into the colors the globe's shaders need.
 *
 * @example
 * globeColors({ ink: "#ffffff", body: "#050505", rim: "#525252", dark: true });
 */
export function globeColors({ ink, body, rim, dark }: GlobePalette): GlobeColors {
  return { ink: hexChannel(ink), inkHex: ink, body: hexChannel(body), rim: hexChannel(rim), additive: dark };
}
