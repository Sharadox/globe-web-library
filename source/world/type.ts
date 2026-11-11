import type { GlobeColors } from "@sharadox/globe-web-library/color/type";
import type { GlobeDragController } from "@sharadox/globe-web-library/drag-controller/type";
import type { Place } from "@sharadox/globe-web-library/place/type";

export interface WorldProperties {
  /** Float32 [latitude, longitude] land pairs. */
  data: Float32Array;
  /** Supplies the rotation each frame. */
  drag: GlobeDragController;
  colors: GlobeColors;
  /** Where arcs start, marked with a pulsing ring. */
  home: Place;
  /** Where arcs go. */
  destinations: readonly Place[];
}
