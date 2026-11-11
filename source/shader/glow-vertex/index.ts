/** Vertex shader that passes the view-space normal on, for fresnel effects. */
export const GLOW_VERTEX = /* glsl */ `
  varying vec3 viewNormal;
  void main() {
    viewNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
