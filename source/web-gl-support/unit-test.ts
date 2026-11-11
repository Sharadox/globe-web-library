// @vitest-environment happy-dom
import { afterEach, expect, test, vi } from "vitest";
import { supportsWebGl } from "@sharadox/globe-web-library/web-gl-support";

afterEach(() => vi.restoreAllMocks());
const canvasWith = (getContext: (kind: string) => unknown) =>
  vi.spyOn(document, "createElement").mockReturnValue({ getContext } as unknown as HTMLElement);

test("is true with WebGL 2 or WebGL", () => {
  canvasWith((kind) => (kind === "webgl2" ? {} : null));
  expect(supportsWebGl()).toBe(true);
  vi.restoreAllMocks();
  canvasWith((kind) => (kind === "webgl" ? {} : null));
  expect(supportsWebGl()).toBe(true);
});

test("is false without either, or when the browser refuses", () => {
  canvasWith(() => null);
  expect(supportsWebGl()).toBe(false);
  vi.restoreAllMocks();
  canvasWith(() => {
    throw new Error("blocked");
  });
  expect(supportsWebGl()).toBe(false);
});
