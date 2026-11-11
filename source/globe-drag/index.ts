"use client";
import { useEffect, useRef, useState } from "react";
import { createDragController } from "@sharadox/globe-web-library/drag-controller";
import type { GlobeDragController, GlobeRotation } from "@sharadox/globe-web-library/drag-controller/type";

/**
 * Connects the drag controller to an element's pointer events (with pointer capture and grab cursors). Attach the
 * returned reference to the element that receives the pointer; step the controller every frame.
 */
export function useGlobeDrag(initial: GlobeRotation, autoRotate: boolean) {
  const target = useRef<HTMLDivElement>(null);
  const [controller] = useState(() => createDragController(initial, autoRotate));
  useEffect(() => {
    const element = target.current;
    if (!element) return;
    const sample = (event: PointerEvent) => ({
      clientX: event.clientX,
      clientY: event.clientY,
      bounds: element.getBoundingClientRect(),
    });
    const down = (event: PointerEvent) => {
      controller.down(event.clientX, event.clientY);
      element.setPointerCapture(event.pointerId);
      element.style.cursor = "grabbing";
    };
    const move = (event: PointerEvent) => controller.move(sample(event));
    const up = (event: PointerEvent) => {
      controller.up();
      element.style.cursor = "grab";
      if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
    };
    element.style.cursor = "grab";
    element.style.touchAction = "pan-y";
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    element.addEventListener("pointerleave", controller.leave);
    return () => {
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", up);
      element.removeEventListener("pointerleave", controller.leave);
    };
  }, [controller]);
  return [target, controller as GlobeDragController] as const;
}
