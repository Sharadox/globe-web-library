import { describe, expect, test } from "vitest";
import { createDragController } from "@sharadox/globe-web-library/drag-controller";

const bounds = { left: 0, top: 0, width: 260, height: 260 };

describe("createDragController", () => {
  test("drifts slowly on its own, easing in after a pause", () => {
    const controller = createDragController({ x: 0, y: 0 }, true);
    const early = controller.step(0.5).y;
    const later = controller.step(2).y;
    expect(early).toBeGreaterThan(0);
    expect(later - early).toBeGreaterThan(early);
  });

  test("stays still without auto-rotation", () => {
    expect(createDragController({ x: 0.2, y: 0.3 }, false).step(1)).toEqual({ x: 0.2, y: 0.3 });
  });

  test("tilts towards the pointer and back when it leaves", () => {
    const controller = createDragController({ x: 0, y: 0 }, false);
    controller.move({ clientX: 260, clientY: 260, bounds });
    expect(controller.step(0)).toEqual({ x: 0.09, y: 0.09 });
    controller.leave();
    expect(controller.step(0)).toEqual({ x: 0, y: 0 });
  });

  test("spins while dragging, keeps the tip within limits, and coasts after release", () => {
    const controller = createDragController({ x: 0, y: 0 }, false);
    controller.down(0, 0);
    controller.move({ clientX: 100, clientY: 1000, bounds });
    controller.leave();
    const dragged = controller.step(0.016);
    expect(dragged.y).toBeGreaterThan(0.9);
    expect(dragged.x).toBe(1.1);
    controller.up();
    const coasting = controller.step(0.016);
    expect(coasting.y).toBeGreaterThan(dragged.y - 0.18);
    expect(createDragController({ x: 0, y: 0 }, false).step(0)).toEqual({ x: 0, y: 0 });
  });

  test("copes with a zero-width element", () => {
    const controller = createDragController({ x: 0, y: 0 }, false);
    controller.down(0, 0);
    controller.move({ clientX: 1, clientY: 0, bounds: { left: 0, top: 0, width: 0, height: 0 } });
    expect(Number.isFinite(controller.step(0).y)).toBe(true);
  });
});
