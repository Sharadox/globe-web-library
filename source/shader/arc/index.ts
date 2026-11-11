/** Arcs: a faint path plus a bright pulse traveling along it. */
export const ARC_SHADER = {
  vertex: /* glsl */ `
    varying float alongArc;
    void main() {
      alongArc = uv.x;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragment: /* glsl */ `
    uniform float time;
    uniform float offset;
    uniform vec3 color;
    varying float alongArc;
    void main() {
      float phase = fract(time * 0.16 + offset);
      float pulse = smoothstep(0.0, 0.16, 0.16 - abs(alongArc - phase * 1.3 + 0.15));
      float base = 0.10;
      float ends = smoothstep(0.0, 0.04, alongArc) * smoothstep(1.0, 0.96, alongArc);
      gl_FragColor = vec4(color, (base + pulse * 0.95) * ends);
    }
  `,
};
