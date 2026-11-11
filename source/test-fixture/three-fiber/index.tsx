import type { ReactNode } from "react";
import { vi } from "vitest";

/** A stand-in for @react-three/fiber: frame callbacks are collected so tests can run them by hand. */
export const frames: ((state: unknown, deltaSeconds: number) => void)[] = [];
export const useFrame = (callback: (state: unknown, deltaSeconds: number) => void) => {
  frames.push(callback);
};
export const useThree = () => ({ gl: { getPixelRatio: () => 2 } });
export const Canvas = vi.fn(({ children }: { children: ReactNode }) => <div data-testid="canvas">{children}</div>);
