/** A rotation in radians. */
export interface GlobeRotation {
  x: number;
  y: number;
}

/** A pointer position and the element's box, as the controller needs them. */
export interface PointerSample {
  clientX: number;
  clientY: number;
  bounds: { left: number; top: number; width: number; height: number };
}

/** Drag-to-spin state machine: feed it pointer events and step it every frame. */
export interface GlobeDragController {
  down: (clientX: number, clientY: number) => void;
  move: (sample: PointerSample) => void;
  up: () => void;
  leave: () => void;
  /** Advances inertia and auto-rotation by `deltaSeconds`; returns the target rotation. */
  step: (deltaSeconds: number) => GlobeRotation;
}
