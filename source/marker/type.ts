export interface MarkerProperties {
  /** "#rrggbb". */
  color: string;
  latitude: number;
  longitude: number;
  /** The home marker is larger and sends out a pulsing ring. */
  home?: boolean;
}
