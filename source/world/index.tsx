"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { isSoftNavigation } from "@sharadox/web-library/navigation/soft-navigation";
import { AdditiveBlending, BackSide, MathUtils, NormalBlending, ShaderMaterial, type Group } from "three";
import { Arc } from "@sharadox/globe-web-library/arc";
import { Dots } from "@sharadox/globe-web-library/dots";
import { Marker } from "@sharadox/globe-web-library/marker";
import { ATMOSPHERE_SHADER } from "@sharadox/globe-web-library/shader/atmosphere";
import { BODY_SHADER } from "@sharadox/globe-web-library/shader/body";
import type { WorldProperties } from "@sharadox/globe-web-library/world/type";

/** The planet scene: body, atmosphere, land dots, arcs from home and markers. Rotation comes from the drag controller. */
export function World({ data, drag, colors, home, destinations }: WorldProperties) {
  const group = useRef<Group>(null);
  // After a soft navigation the planet starts exactly where it was; on a first visit it swings into place.
  const [settled] = useState(isSoftNavigation);
  const placed = useRef(false);
  useFrame((_, deltaSeconds) => {
    const planet = group.current;
    if (!planet) return;
    const target = drag.step(deltaSeconds);
    const snap = settled && !placed.current;
    placed.current = true;
    planet.rotation.y = snap ? target.y : MathUtils.damp(planet.rotation.y, target.y, 6, deltaSeconds);
    planet.rotation.x = snap ? target.x : MathUtils.damp(planet.rotation.x, target.x, 6, deltaSeconds);
  });
  const body = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: BODY_SHADER.vertex,
        fragmentShader: BODY_SHADER.fragment,
        uniforms: { base: { value: colors.body }, rimColor: { value: colors.rim } },
      }),
    [colors],
  );
  const atmosphere = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: ATMOSPHERE_SHADER.vertex,
        fragmentShader: ATMOSPHERE_SHADER.fragment,
        uniforms: { strength: { value: colors.additive ? 0.42 : 0.2 }, color: { value: colors.ink } },
        side: BackSide,
        transparent: true,
        blending: colors.additive ? AdditiveBlending : NormalBlending,
        depthWrite: false,
      }),
    [colors],
  );
  return (
    <>
      <mesh scale={1.16} material={atmosphere}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>
      <group ref={group}>
        <mesh material={body}>
          <sphereGeometry args={[0.995, 96, 96]} />
        </mesh>
        <Dots data={data} colors={colors} />
        {destinations.map((place, index) => (
          <Arc
            key={index}
            from={home}
            to={[place.latitude, place.longitude]}
            offset={index / destinations.length}
            colors={colors}
          />
        ))}
        {destinations.map((place, index) => (
          <Marker key={`marker${index}`} latitude={place.latitude} longitude={place.longitude} color={colors.inkHex} />
        ))}
        <Marker latitude={home.latitude} longitude={home.longitude} color={colors.inkHex} home />
      </group>
    </>
  );
}
