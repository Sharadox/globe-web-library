import { expect, test } from "vitest";
import { globeColors } from "@sharadox/globe-web-library/color";

test("turns hex colors into shader channels", () => {
  expect(globeColors({ ink: "#ffffff", body: "#000000", rim: "#ff0000", dark: true })).toEqual({
    ink: [1, 1, 1],
    inkHex: "#ffffff",
    body: [0, 0, 0],
    rim: [1, 0, 0],
    additive: true,
  });
});
