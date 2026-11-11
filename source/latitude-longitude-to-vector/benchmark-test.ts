import { expect, test } from "vitest";
import { latitudeLongitudeToVector } from "@sharadox/globe-web-library/latitude-longitude-to-vector";

/** The globe converts about 11,000 land dots on load; it must fit well inside one 60 frames-per-second frame. */
test("converts the globe's land dots within one frame", async ({ bench }) => {
  const result = await bench("convert 11,000 land dots", () => {
    for (let index = 0; index < 11_000; index++) {
      latitudeLongitudeToVector((index % 150) - 60, (index % 360) - 180, 1.001);
    }
  }).run();
  expect(result.latency.mean).toBeLessThan(16);
});
