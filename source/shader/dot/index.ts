/** Land dots: facing dots are bright, edge dots fade, a few twinkle. */
export const DOT_SHADER = {
  vertex: /* glsl */ `
    attribute float seed;
    uniform float time;
    uniform float pointSize;
    varying float opacity;
    void main() {
      vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
      vec3 surfaceNormal = normalize(normalMatrix * position);
      float facing = dot(surfaceNormal, vec3(0.0, 0.0, 1.0));
      float twinkle = 0.75 + 0.25 * sin(time * 1.6 + seed * 40.0);
      opacity = smoothstep(-0.05, 0.55, facing) * twinkle;
      gl_PointSize = pointSize * (0.9 + 0.5 * seed) * (3.2 / -viewPosition.z);
      gl_Position = projectionMatrix * viewPosition;
    }
  `,
  fragment: /* glsl */ `
    uniform vec3 color;
    varying float opacity;
    void main() {
      vec2 fromCenter = gl_PointCoord - 0.5;
      float distanceFromCenter = length(fromCenter);
      if (distanceFromCenter > 0.5) discard;
      gl_FragColor = vec4(color, smoothstep(0.5, 0.1, distanceFromCenter) * opacity);
    }
  `,
};
