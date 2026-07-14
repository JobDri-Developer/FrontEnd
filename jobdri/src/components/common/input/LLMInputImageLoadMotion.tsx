"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

export interface LLMInputImageLoadMotionProps {
  activeDotClassName?: string;
  className?: string;
  inactiveDotClassName?: string;
}

export function LLMInputImageLoadMotion({
  activeDotClassName = "bg-icon-neutral-heavy",
  className,
  inactiveDotClassName = "bg-icon-neutral-assistive",
}: LLMInputImageLoadMotionProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActive((prevActive) => (prevActive + 1) % 3);
    }, 400);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className={clsx("flex items-center gap-2 py-2", className)}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="flex h-3 w-2 shrink-0 items-end justify-center"
        >
          <span
            className={clsx(
              "aspect-square h-2 w-2 rounded-full transition-transform duration-300",
              active === index
                ? clsx("-translate-y-1", activeDotClassName)
                : clsx("translate-y-0", inactiveDotClassName),
            )}
          />
        </div>
      ))}
    </div>
  );
}
