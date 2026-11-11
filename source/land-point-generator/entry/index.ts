#!/usr/bin/env node
// globe-land-points <output file>: writes the land dots for the globe (for example public/globe/land.bin).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname } from "node:path";
import type { Topology } from "topojson-specification";
import { landPoints } from "@sharadox/globe-web-library/land-point-generator";

const output = process.argv[2] ?? "public/globe/land.bin";
const topology = JSON.parse(
  readFileSync(createRequire(import.meta.url).resolve("world-atlas/land-110m.json"), "utf8"),
) as Topology;
const points = landPoints(topology);
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, Buffer.from(points.buffer));
console.log(`${points.length / 2} land dots written to ${output}`);
