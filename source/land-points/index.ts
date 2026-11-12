"use client";
import { useEffect, useState } from "react";

/** Land dots already loaded, by address. */
const loaded = new Map<string, Float32Array>();

/**
 * Loads precomputed land dots (Float32 latitude/longitude pairs, see the `globe-land-points` command) from a URL.
 * `null` until loaded. Each address is loaded once per page session, so a globe that mounts again (for example after
 * switching language) draws at once.
 */
export function useLandPoints(url = "/globe/land.bin") {
  const [points, setPoints] = useState<Float32Array | null>(() => loaded.get(url) ?? null);
  useEffect(() => {
    if (loaded.has(url)) return;
    let live = true;
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const dots = new Float32Array(buffer);
        loaded.set(url, dots);
        if (live) setPoints(dots);
      });
    return () => {
      live = false;
    };
  }, [url]);
  return points;
}
