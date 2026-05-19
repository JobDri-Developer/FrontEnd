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
          className="flex h-3 w-2 items-end justify-center"
        >
          <span
            className={clsx(
              "aspect-square h-2 w-2 rounded-full transition-transform duration-300",
              active === index
                ? "-translate-y-1 bg-icon-neutral-heavy"
                : "translate-y-0 bg-icon-neutral-assistive",
            )}
          />
        </div>
      ))}
    </div>
  );
}
