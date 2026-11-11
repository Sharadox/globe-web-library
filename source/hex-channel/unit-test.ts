import { expect, test } from "vitest";
import { hexChannel } from "@sharadox/globe-web-library/hex-channel";

test("reads long and short hex colors", () => {
  expect(hexChannel("#ffffff")).toEqual([1, 1, 1]);
  expect(hexChannel("#000")).toEqual([0, 0, 0]);
  expect(hexChannel("#ff0080")).toEqual([1, 0, 128 / 255]);
});
