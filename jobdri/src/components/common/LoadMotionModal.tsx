"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

interface LoadMotionModalProps {
  className?: string;
}

export default function LoadMotionModal({ className }: LoadMotionModalProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % 3);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={clsx("flex items-center gap-2 py-2", className)}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="flex h-3 w-2 shrink-0 items-end justify-center overflow-visible"
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            aria-hidden="true"
            className={clsx(
              "block h-2 w-2 shrink-0 overflow-visible transition-transform duration-300",
              active === index
                ? "-translate-y-1 text-icon-neutral-heavy"
                : "translate-y-0 text-icon-neutral-assistive",
            )}
          >
            <circle cx="4" cy="4" r="4" fill="currentColor" />
          </svg>
        </div>
      ))}
    </div>
  );
}
