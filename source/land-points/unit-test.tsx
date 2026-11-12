// @vitest-environment happy-dom
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { useLandPoints } from "@sharadox/globe-web-library/land-points";

afterEach(() => vi.unstubAllGlobals());

test("loads the dots, null until then", async () => {
  const fetch = vi.fn(async () => ({ arrayBuffer: async () => new Float32Array([1, 2]).buffer }));
  vi.stubGlobal("fetch", fetch);
  const { result } = renderHook(() => useLandPoints("/dots.bin"));
  expect(result.current).toBeNull();
  await waitFor(() => expect(Array.from(result.current ?? [])).toEqual([1, 2]));
  expect(fetch).toHaveBeenCalledWith("/dots.bin");
});

test("loads each address once, so a globe mounted again draws at once", async () => {
  const fetch = vi.fn(async () => ({ arrayBuffer: async () => new Float32Array([3]).buffer }));
  vi.stubGlobal("fetch", fetch);
  const first = renderHook(() => useLandPoints("/once.bin"));
  await waitFor(() => expect(first.result.current).not.toBeNull());
  const second = renderHook(() => useLandPoints("/once.bin"));
  expect(Array.from(second.result.current ?? [])).toEqual([3]);
  expect(fetch).toHaveBeenCalledOnce();
});

test("ignores an answer that arrives after unmounting, and has a default address", async () => {
  let finish: (value: unknown) => void = () => {};
  const fetch = vi.fn(() => new Promise((resolve) => (finish = resolve)));
  vi.stubGlobal("fetch", fetch);
  const { unmount } = renderHook(() => useLandPoints());
  expect(fetch).toHaveBeenCalledWith("/globe/land.bin");
  unmount();
  finish({ arrayBuffer: async () => new ArrayBuffer(8) });
  await new Promise((resolve) => setTimeout(resolve, 0));
});
