"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

interface ProgressPanelLoadMotionProps {
  className?: string;
  activeDotClassName?: string;
  inactiveDotClassName?: string;
}

export default function ProgressPanelLoadMotion({
  className,
  activeDotClassName = "text-icon-neutral-white",
  inactiveDotClassName = "text-icon-neutral-assistive",
}: ProgressPanelLoadMotionProps) {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % 3);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={clsx("flex items-center gap-1 py-1", className)}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="flex h-[6px] w-[4px] shrink-0 items-end justify-center overflow-visible"
        >
          <svg
            width="4"
            height="4"
            viewBox="0 0 4 4"
            aria-hidden="true"
            className={clsx(
              "block h-[4px] w-[4px] shrink-0 overflow-visible transition-transform duration-300",
              active === index
                ? clsx("-translate-y-0.5", activeDotClassName)
                : clsx("translate-y-0", inactiveDotClassName),
            )}
          >
            <circle cx="2" cy="2" r="2" fill="currentColor" />
          </svg>
        </div>
      ))}
    </div>
  );
}
