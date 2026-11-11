import { GLOW_VERTEX } from "@sharadox/globe-web-library/shader/glow-vertex";

/** The planet body with a fresnel rim, in the style's colours. */
export const BODY_SHADER = {
  vertex: GLOW_VERTEX,
  fragment: /* glsl */ `
    varying vec3 viewNormal;
    uniform vec3 base;
    uniform vec3 rimColor;
    void main() {
      float rim = pow(1.0 - abs(viewNormal.z), 3.0);
      gl_FragColor = vec4(mix(base, rimColor, rim), 1.0);
    }
  `,
};
