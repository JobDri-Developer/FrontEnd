"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

interface LoadMotionProps {
  className?: string;
}

export default function LoadMotion({ className }: LoadMotionProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % 3);
    }, 400);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className={clsx("flex items-end gap-2 h-4", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={clsx(
            "w-2 h-2 rounded-full transition-all duration-300",
            active === i
              ? "bg-icon-neutral-heavy -translate-y-1"
              : "bg-icon-neutral-assistive translate-y-0",
          )}
        />
      ))}
    </div>
  );
}
