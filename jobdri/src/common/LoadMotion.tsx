"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

interface LoadMotionProps {
  className?: string;
  dotFrameClassName?: string;
  dotClassName?: string;
  activeDotClassName?: string;
  inactiveDotClassName?: string;
  activeMotionClassName?: string;
  inactiveMotionClassName?: string;
}

export default function LoadMotion({
  className,
  dotFrameClassName,
  dotClassName,
  activeDotClassName = "bg-icon-neutral-heavy",
  inactiveDotClassName = "bg-icon-neutral-assistive",
  activeMotionClassName = "-translate-y-0.5",
  inactiveMotionClassName = "translate-y-0",
}: LoadMotionProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % 3);
    }, 400);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className={clsx("flex items-center gap-1 py-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={clsx(
            "flex h-1.5 w-1 items-end justify-center",
            dotFrameClassName,
          )}
        >
          <span
            className={clsx(
              "aspect-square h-1 w-1 rounded-full transition-transform duration-300",
              dotClassName,
              active === i
                ? clsx(activeDotClassName, activeMotionClassName)
                : clsx(inactiveDotClassName, inactiveMotionClassName),
            )}
          />
        </div>
      ))}
    </div>
  );
}
