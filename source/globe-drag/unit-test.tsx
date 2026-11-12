// @vitest-environment happy-dom
import { render } from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, expect, test, vi } from "vitest";
import { useGlobeDrag } from "@sharadox/globe-web-library/globe-drag";
import { beginSoftNavigation } from "@sharadox/web-library/navigation/soft-navigation";

const controllers: ReturnType<typeof useGlobeDrag>[1][] = [];
function Surface() {
  const [target, controller] = useGlobeDrag({ x: 0, y: 0 }, false);
  useEffect(() => {
    controllers.push(controller);
  }, [controller]);
  return <div ref={target} data-testid="surface" />;
}
const pointer = (element: HTMLElement, type: string, clientX = 0) =>
  element.dispatchEvent(Object.assign(new Event(type), { clientX, clientY: 0, pointerId: 1 }));
afterEach(() => vi.restoreAllMocks());

test("drives the controller from pointer events, with grab cursors and pointer capture", () => {
  HTMLElement.prototype.setPointerCapture = vi.fn();
  HTMLElement.prototype.releasePointerCapture = vi.fn();
  HTMLElement.prototype.hasPointerCapture = vi.fn(() => true);
  const { getByTestId, unmount } = render(<Surface />);
  const surface = getByTestId("surface");
  surface.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect;
  expect(surface.style.cursor).toBe("grab");
  pointer(surface, "pointerdown");
  expect(surface.style.cursor).toBe("grabbing");
  pointer(surface, "pointermove", 50);
  expect(controllers.at(-1)!.step(0).y).toBeGreaterThan(0);
  pointer(surface, "pointerup");
  expect(HTMLElement.prototype.releasePointerCapture).toHaveBeenCalled();
  HTMLElement.prototype.hasPointerCapture = vi.fn(() => false);
  pointer(surface, "pointercancel");
  pointer(surface, "pointerleave");
  unmount();
});

test("a globe mounted by a soft navigation carries on from the last one's rotation", () => {
  const { unmount } = render(<Surface />);
  const first = controllers.at(-1)!;
  first.down(0, 0);
  first.move({ clientX: 80, clientY: 0, bounds: { left: 0, top: 0, width: 100, height: 100 } });
  first.step(0.016);
  const where = first.rotation();
  // The new globe is built while the old one is still there, as when a page is rebuilt in place.
  beginSoftNavigation();
  render(<Surface />);
  expect(controllers.at(-1)!.rotation()).toEqual(where);
  unmount();
  beginSoftNavigation(0);
  render(<Surface />);
  expect(controllers.at(-1)!.rotation()).toEqual({ x: 0, y: 0 });
});

test("does nothing until the reference is attached", () => {
  function Detached() {
    useGlobeDrag({ x: 0, y: 0 }, true);
    return null;
  }
  expect(() => render(<Detached />)).not.toThrow();
});
