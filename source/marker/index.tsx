"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Quaternion, Vector3, type Mesh, type MeshBasicMaterial } from "three";
import { latitudeLongitudeToVector } from "@sharadox/globe-web-library/latitude-longitude-to-vector";
import type { MarkerProperties } from "@sharadox/globe-web-library/marker/type";

/** A city dot lying flat on the surface. */
export function Marker({ latitude, longitude, color, home = false }: MarkerProperties) {
  const ring = useRef<Mesh>(null);
  const position = useMemo(() => latitudeLongitudeToVector(latitude, longitude, 1.004), [latitude, longitude]);
  const quaternion = useMemo(
    () => new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), position.clone().normalize()),
    [position],
  );
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const progress = (clock.elapsedTime * 0.6) % 1;
    ring.current.scale.setScalar(1 + progress * 5);
    (ring.current.material as MeshBasicMaterial).opacity = (1 - progress) * 0.8;
  });
  return (
    <group position={position} quaternion={quaternion}>
      <mesh>
        <circleGeometry args={[home ? 0.014 : 0.008, 20]} />
        <meshBasicMaterial color={color} transparent opacity={home ? 1 : 0.85} />
      </mesh>
      {home && (
        <mesh ref={ring}>
          <ringGeometry args={[0.014, 0.018, 40]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
