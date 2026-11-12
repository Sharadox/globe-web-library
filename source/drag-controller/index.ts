import { clamp } from "@sharadox/web-library/math/clamp";
import type { GlobeDragController, GlobeRotation } from "@sharadox/globe-web-library/drag-controller/type";

/** How far the globe may tip up and down, in radians. */
const TIP = [-0.9, 1.1] as const;

/**
 * The globe's motion: drag to spin with inertia, a slow auto-rotation that eases back in two seconds after a drag,
 * and a small tilt towards the pointer.
 *
 * @example
 * const controller = createDragController({ x: 0.4, y: -1 }, true);
 * controller.step(1 / 60); // { x, y }
 */
export function createDragController(initial: GlobeRotation, autoRotate: boolean): GlobeDragController {
  let rotationX = initial.x;
  let rotationY = initial.y;
  let velocityX = 0;
  let velocityY = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let idleSeconds = 0;
  let tiltX = 0;
  let tiltY = 0;
  return {
    down(clientX, clientY) {
      dragging = true;
      lastX = clientX;
      lastY = clientY;
    },
    move({ clientX, clientY, bounds }) {
      const width = Math.max(bounds.width, 1);
      tiltX = ((clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 0.18;
      tiltY = ((clientX - bounds.left) / width - 0.5) * 0.18;
      if (!dragging) return;
      const speed = 2.6 / width;
      velocityY = (clientX - lastX) * speed;
      velocityX = (clientY - lastY) * speed;
      lastX = clientX;
      lastY = clientY;
      rotationY += velocityY;
      rotationX = clamp(rotationX + velocityX, ...TIP);
      idleSeconds = 0;
    },
    up() {
      dragging = false;
    },
    leave() {
      tiltX = 0;
      tiltY = 0;
    },
    step(deltaSeconds) {
      if (!dragging) {
        rotationY += velocityY;
        rotationX = clamp(rotationX + velocityX, ...TIP);
        velocityY *= 0.94;
        velocityX *= 0.9;
        idleSeconds += deltaSeconds;
        if (autoRotate) rotationY += deltaSeconds * 0.06 * Math.min(1, idleSeconds / 2);
      }
      return { x: rotationX + tiltX, y: rotationY + tiltY };
    },
    rotation() {
      return { x: rotationX, y: rotationY };
    },
  };
}
