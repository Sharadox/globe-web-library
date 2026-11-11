import { expect, test } from "vitest";
import { latitudeLongitudeToVector } from "@sharadox/globe-web-library/latitude-longitude-to-vector";

test("puts (0,0) in front, the north pole on top and 90°E to the right", () => {
  const close = (vector: { x: number; y: number; z: number }, x: number, y: number, z: number) =>
    [vector.x - x, vector.y - y, vector.z - z].every((difference) => Math.abs(difference) < 1e-9);
  expect(close(latitudeLongitudeToVector(0, 0), 0, 0, 1)).toBe(true);
  expect(close(latitudeLongitudeToVector(90, 0), 0, 1, 0)).toBe(true);
  expect(close(latitudeLongitudeToVector(0, 90, 2), 2, 0, 0)).toBe(true);
});
