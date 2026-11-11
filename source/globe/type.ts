import type { GlobePalette } from "@sharadox/globe-web-library/color/type";
import type { Place } from "@sharadox/globe-web-library/place/type";

export interface GlobeProperties {
  /** Colours (hex) and whether the background is dark; pass new ones when the page's style changes. */
  palette: GlobePalette;
  /** Where arcs start and the globe first faces. */
  home: Place;
  /** Where arcs go. */
  destinations?: readonly Place[];
  /** The land dots file made by `globe-land-points`; "/globe/land.bin" by default. */
  landPoints?: string;
  /** Accessible name of the canvas; "Interactive globe" by default. */
  label?: string;
  className?: string;
}
