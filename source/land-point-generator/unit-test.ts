import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { expect, test } from "vitest";
import type { Topology } from "topojson-specification";
import { landPoints } from "@sharadox/globe-web-library/land-point-generator";

const topology = JSON.parse(
  readFileSync(createRequire(import.meta.url).resolve("world-atlas/land-110m.json"), "utf8"),
) as Topology;

test("places dots on land only, north of the limit", { timeout: 30_000 }, () => {
  const points = landPoints(topology, 600);
  expect(points.length % 2).toBe(0);
  expect(points.length / 2).toBeGreaterThan(100);
  expect(points.length / 2).toBeLessThan(260);
  for (let index = 0; index < points.length; index += 2) expect(points[index]).toBeGreaterThanOrEqual(-60);
  expect(landPoints(topology, 600, -90).length).toBeGreaterThan(points.length);
});
