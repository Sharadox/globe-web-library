"use client";
import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import { classNames } from "@sharadox/web-library/class-name";
import { radians } from "@sharadox/web-library/math/radians";
import { globeColors } from "@sharadox/globe-web-library/color";
import { useGlobeDrag } from "@sharadox/globe-web-library/globe-drag";
import { useLandPoints } from "@sharadox/globe-web-library/land-points";
import { supportsWebGl } from "@sharadox/globe-web-library/web-gl-support";
import { World } from "@sharadox/globe-web-library/world";
import styles from "./index.module.css";
import type { GlobeProperties } from "@sharadox/globe-web-library/globe/type";

/**
 * An interactive 3D dot globe: land as twinkling dots, arcs with traveling pulses from home to each destination,
 * markers, a soft halo, drag to spin with inertia and a slow auto-rotation (off with reduced motion). It pauses
 * when off screen and shows a static sphere without WebGL. Client only: load it with `next/dynamic` and `ssr: false`.
 *
 * @example
 * const Globe = dynamic(() => import("@sharadox/globe-web-library/globe").then((module) => module.Globe), { ssr: false });
 * <Globe palette={{ ink: "#fff", body: "#050505", rim: "#525252", dark: true }} home={{ latitude: 37.08, longitude: -8.03 }} />
 */
export function Globe({
  palette,
  home,
  destinations = [],
  landPoints = "/globe/land.bin",
  label = "Interactive globe",
  className,
}: GlobeProperties) {
  const data = useLandPoints(landPoints);
  const colors = useMemo(() => globeColors(palette), [palette]);
  const [visible, setVisible] = useState(true);
  const [webGl] = useState(supportsWebGl);
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [wrapper, drag] = useGlobeDrag(
    { y: -radians(home.longitude) - 0.5, x: radians(home.latitude) * 0.62 },
    !reduced,
  );
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting), {
      rootMargin: "100px",
    });
    observer.observe(wrapper.current!);
    return () => observer.disconnect();
  }, [wrapper]);
  return (
    <div ref={wrapper} className={classNames(styles.globe, className)}>
      <div className={styles.halo} aria-hidden />
      {webGl && data ? (
        <Canvas
          // Measured without CSS transforms: a parent that scales in (an entrance animation) would otherwise fix the
          // canvas at the scaled-down size until the next resize or scroll, and the globe would jump later.
          resize={{ offsetSize: true }}
          dpr={[1, 2]}
          camera={{ position: [0, 0, 3.7], fov: 38 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          frameloop={visible ? "always" : "never"}
          aria-label={label}
        >
          <World data={data} drag={drag} colors={colors} home={home} destinations={destinations} />
        </Canvas>
      ) : (
        <div className={styles.fallback} aria-hidden />
      )}
    </div>
  );
}
