// @vitest-environment happy-dom
import { act, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

vi.mock("@react-three/fiber", () => import("@sharadox/globe-web-library/test-fixture/three-fiber"));
vi.mock("@sharadox/globe-web-library/web-gl-support", () => ({ supportsWebGl: vi.fn(() => true) }));
const { Globe } = await import("@sharadox/globe-web-library/globe");
const { Canvas } = await import("@sharadox/globe-web-library/test-fixture/three-fiber");
const { supportsWebGl } = await import("@sharadox/globe-web-library/web-gl-support");

let visibility: (entries: { isIntersecting: boolean }[]) => void = () => {};
beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(window, "matchMedia").mockReturnValue({ matches: false } as MediaQueryList);
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ arrayBuffer: async () => new Float32Array([1, 2]).buffer })),
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: typeof visibility) {
        visibility = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
const palette = { ink: "#ffffff", body: "#050505", rim: "#525252", dark: true };

test("draws the globe once the land dots arrive, and pauses off screen", async () => {
  const { getByTestId, unmount, container } = render(
    <Globe palette={palette} home={{ latitude: 37, longitude: -8 }} className="hero" />,
  );
  expect(container.firstElementChild!.className).toContain("hero");
  await waitFor(() => getByTestId("canvas"));
  // Sized by layout, not by transforms, so an entrance scale animation never leaves it the wrong size.
  expect(vi.mocked(Canvas).mock.calls.at(-1)![0]).toMatchObject({ resize: { offsetSize: true } });
  act(() => visibility([{ isIntersecting: false }]));
  act(() => visibility([]));
  unmount();
});

test("shows a static sphere without WebGL", () => {
  vi.mocked(supportsWebGl).mockReturnValueOnce(false);
  const { container, queryByTestId } = render(
    <Globe
      palette={palette}
      home={{ latitude: 0, longitude: 0 }}
      destinations={[]}
      landPoints="/x.bin"
      label="Globe"
    />,
  );
  expect(queryByTestId("canvas")).toBeNull();
  expect(container.querySelectorAll("div").length).toBe(3);
});
