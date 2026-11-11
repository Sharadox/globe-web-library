import type { GlobeColors } from "@sharadox/globe-web-library/color/type";

export interface DotsProperties {
  colors: GlobeColors;
  /** Float32 [latitude, longitude] pairs. */
  data: Float32Array;
}
