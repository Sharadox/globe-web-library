"use client";
import { pseudoRandom } from "@sharadox/web-library/math/pseudo-random";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { BufferAttribute, BufferGeometry, type ShaderMaterial } from "three";
import { DOT_SHADER } from "@sharadox/globe-web-library/shader/dot";
import { latitudeLongitudeToVector } from "@sharadox/globe-web-library/latitude-longitude-to-vector";
import type { DotsProperties } from "@sharadox/globe-web-library/dots/type";

/** The land, drawn as twinkling points that fade towards the globe's edge. */
export function Dots({ data, colors }: DotsProperties) {
  const { gl } = useThree();
  const material = useRef<ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const count = data.length / 2;
    const position = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let index = 0; index < count; index++) {
      const point = latitudeLongitudeToVector(data[index * 2]!, data[index * 2 + 1]!, 1.001);
      position.set([point.x, point.y, point.z], index * 3);
      seed[index] = pseudoRandom(index);
    }
    const points = new BufferGeometry();
    points.setAttribute("position", new BufferAttribute(position, 3));
    points.setAttribute("seed", new BufferAttribute(seed, 1));
    return points;
  }, [data]);
  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      pointSize: { value: 2.6 * Math.min(gl.getPixelRatio(), 2) },
      color: { value: colors.ink },
    }),
    [gl, colors],
  );
  useFrame((_, deltaSeconds) => {
    if (material.current) material.current.uniforms.time!.value += deltaSeconds;
  });
  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={material}
        vertexShader={DOT_SHADER.vertex}
        fragmentShader={DOT_SHADER.fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
