"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

const DOT_COUNT = 3;
const DOT_INTERVAL_MS = 400;

export type LoadMotionSize = "small" | "medium";

/*
 * 크기별 기본 클래스
 */
const SIZE_STYLES: Record<
  LoadMotionSize,
  { container: string; dotFrame: string; dot: string; activeMotion: string }
> = {
  small: {
    container: "gap-1 py-1",
    dotFrame: "h-1.5 w-1",
    dot: "h-1 w-1",
    activeMotion: "-translate-y-0.5",
  },
  medium: {
    container: "gap-2 py-2",
    dotFrame: "h-3 w-2 shrink-0",
    dot: "h-2 w-2",
    activeMotion: "-translate-y-1",
  },
};

interface LoadMotionProps {
  size?: LoadMotionSize;
  className?: string;
  dotFrameClassName?: string;
  dotClassName?: string;
  activeDotClassName?: string;
  inactiveDotClassName?: string;
  activeMotionClassName?: string;
  inactiveMotionClassName?: string;
}

export default function LoadMotion({
  size = "small",
  className,
  dotFrameClassName,
  dotClassName,
  activeDotClassName = "bg-icon-neutral-heavy",
  inactiveDotClassName = "bg-icon-neutral-assistive",
  activeMotionClassName,
  inactiveMotionClassName = "translate-y-0",
}: LoadMotionProps) {
  const [active, setActive] = useState(0);
  const sizeStyles = SIZE_STYLES[size];
  const activeMotion = activeMotionClassName ?? sizeStyles.activeMotion;

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % DOT_COUNT);
    }, DOT_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={clsx("flex items-center", sizeStyles.container, className)}>
      {Array.from({ length: DOT_COUNT }, (_, index) => (
        <div
          key={index}
          className={clsx(
            "flex items-end justify-center",
            sizeStyles.dotFrame,
            dotFrameClassName,
          )}
        >
          <span
            className={clsx(
              "aspect-square rounded-full transition-transform duration-300",
              sizeStyles.dot,
              dotClassName,
              active === index
                ? clsx(activeDotClassName, activeMotion)
                : clsx(inactiveDotClassName, inactiveMotionClassName),
            )}
          />
        </div>
      ))}
    </div>
  );
}
