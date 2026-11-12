// @vitest-environment happy-dom
import { render } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { beginSoftNavigation } from "@sharadox/web-library/navigation/soft-navigation";
import { frames } from "@sharadox/globe-web-library/test-fixture/three-fiber";

vi.mock("@react-three/fiber", () => import("@sharadox/globe-web-library/test-fixture/three-fiber"));
const { World } = await import("@sharadox/globe-web-library/world");
const { globeColors } = await import("@sharadox/globe-web-library/color");
const { createDragController } = await import("@sharadox/globe-web-library/drag-controller");

beforeEach(() => {
  frames.length = 0;
  vi.spyOn(console, "error").mockImplementation(() => {});
});
const home = { latitude: 37, longitude: -8 };
const colorsFor = (dark: boolean) =>
  globeColors({ ink: dark ? "#ffffff" : "#000000", body: "#050505", rim: "#525252", dark });

test.each([true, false])("renders the planet, dots, arcs and markers, and animates them (dark %s)", (dark) => {
  const drag = createDragController({ x: 0, y: 0 }, true);
  const { container } = render(
    <World
      data={new Float32Array([10, 20, 30, 40])}
      drag={drag}
      colors={colorsFor(dark)}
      home={home}
      destinations={[{ latitude: 51, longitude: 0 }]}
    />,
  );
  expect(container.querySelectorAll("mesh").length).toBeGreaterThan(3);
  // The fake renderer draws plain elements; give the planet group the rotation three.js would have.
  const group = container.querySelector("group") as unknown as { rotation: { x: number; y: number } };
  Object.assign(group, { rotation: { x: 0, y: 0 } });
  for (const material of container.querySelectorAll("shadermaterial"))
    Object.assign(material, { uniforms: { time: { value: 0 } } });
  for (const mesh of container.querySelectorAll("mesh"))
    Object.assign(mesh, { scale: { setScalar: vi.fn() }, material: { opacity: 1 } });
  for (const frame of frames) frame({ clock: { elapsedTime: 1 } }, 0.016);
  expect(group.rotation.y).not.toBe(0);
});

test("after a soft navigation the planet starts exactly at its rotation", () => {
  beginSoftNavigation();
  const drag = createDragController({ x: 0.4, y: 1.2 }, false);
  const { container } = render(
    <World data={new Float32Array()} drag={drag} colors={colorsFor(true)} home={home} destinations={[]} />,
  );
  beginSoftNavigation(0);
  const group = container.querySelector("group") as unknown as { rotation: { x: number; y: number } };
  Object.assign(group, { rotation: { x: 0, y: 0 } });
  for (const material of container.querySelectorAll("shadermaterial"))
    Object.assign(material, { uniforms: { time: { value: 0 } } });
  for (const mesh of container.querySelectorAll("mesh"))
    Object.assign(mesh, { scale: { setScalar: vi.fn() }, material: { opacity: 1 } });
  for (const frame of frames) frame({ clock: { elapsedTime: 1 } }, 0.016);
  expect(group.rotation).toEqual({ x: 0.4, y: 1.2 });
  for (const frame of frames) frame({ clock: { elapsedTime: 1 } }, 0.016);
  expect(group.rotation).toEqual({ x: 0.4, y: 1.2 });
});

test("frames do nothing once the scene is gone", () => {
  const { unmount } = render(
    <World
      data={new Float32Array()}
      drag={createDragController({ x: 0, y: 0 }, false)}
      colors={colorsFor(true)}
      home={home}
      destinations={[{ latitude: 1, longitude: 1 }]}
    />,
  );
  unmount();
  // After unmounting, every frame callback finds its object gone and does nothing.
  for (const frame of frames) expect(() => frame({ clock: { elapsedTime: 1 } }, 0.016)).not.toThrow();
});
