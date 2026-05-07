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
    <div className={clsx("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={clsx(
            "rounded-full transition-all duration-300",
            active === i
              ? "w-1 h-1 bg-icon-heavy -translate-y-0.5"
              : "w-1 h-1 bg-icon-assistive translate-y-0",
          )}
        />
      ))}
    </div>
  );
}
