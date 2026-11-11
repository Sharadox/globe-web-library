# @sharadox/globe-web-library

An interactive 3D dot globe for React websites, built on three.js:

- **Land:** twinkling dots that fade towards the edge.
- **Arcs:** a pulse travels from your home to each destination, and a marker with a pulsing ring sits at home.
- **Motion:** drag to spin with inertia, a slow auto-rotation that eases back in, and a small tilt towards the pointer.
- **Colors:** they come from your page, so a dark style draws white light and a light style draws dark ink.
- **Performance and fallbacks:** it pauses while off screen, shows a static sphere without WebGL, and stops auto-rotating for reduced motion.

It also ships `globe-land-points`, which generates the land dots file from Natural Earth data.

## Install

```sh
pnpm add @sharadox/globe-web-library
pnpm exec globe-land-points public/globe/land.bin   # once; commit the file
```

## Use

```tsx
"use client";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("@sharadox/globe-web-library/globe").then((module) => module.Globe), { ssr: false });

<div style={{ position: "relative", aspectRatio: 1 }}>
  <Globe
    palette={{ ink: "#ffffff", body: "#050505", rim: "#525252", dark: true }}
    home={{ latitude: 37.08, longitude: -8.03 }}
    destinations={[
      { latitude: 51.51, longitude: -0.13 },
      { latitude: 40.71, longitude: -74 },
    ]}
  />
</div>;
```

The globe fills its positioned parent. Its halo and fallback follow `--globe-glow` (default `currentColor`) and `--globe-surface`.

## API

| Import                                                                | Export                                                                             |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `…/globe`                                                             | `<Globe palette home destinations? landPoints? label? className?>`                 |
| `…/world`                                                             | `<World>`, the three.js scene, to use inside your own `<Canvas>`                   |
| `…/drag-controller`                                                   | `createDragController(initial, autoRotate)`: the motion, without React             |
| `…/globe-drag`                                                        | `useGlobeDrag(initial, autoRotate)` → `[reference, controller]`                    |
| `…/land-points`                                                       | `useLandPoints(url)` → `Float32Array` of latitude and longitude pairs, or `null`   |
| `…/land-point-generator`                                              | `landPoints(topology, samples?, southernLimit?)`; bin `globe-land-points [output]` |
| `…/color`                                                             | `globeColors({ ink, body, rim, dark })`                                            |
| `…/latitude-longitude-to-vector`, `…/hex-channel`, `…/web-gl-support` | Helpers                                                                            |

## Develop

Tests replace the three.js renderer with a stand-in and run every frame callback by hand. `pnpm verify` runs formatting, lint, type-check, tests with 100% coverage and the build. Branches follow `<feature>.development` → `development` → `index`, and releases are `v<version>` tags on `index`.

## License

Licença Sharadox de Código Aberto, versão 0.1.0. See [português](LICENCA.md) (the binding text) and the [English translation](LICENSE.md).
