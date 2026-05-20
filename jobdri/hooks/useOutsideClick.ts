import type { RefObject } from "react";
import { useEffect } from "react";

export default function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutsideClick?: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled || !onOutsideClick) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (target instanceof Node && !ref.current?.contains(target)) {
        onOutsideClick();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [enabled, onOutsideClick, ref]);
}
