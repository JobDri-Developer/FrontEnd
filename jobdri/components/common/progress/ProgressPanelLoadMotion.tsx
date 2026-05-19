"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

export default function ProgressPanelLoadMotion() {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % 3);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1 py-1">
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
                ? "-translate-y-0.5 text-icon-neutral-white"
                : "translate-y-0 text-icon-neutral-assistive",
            )}
          >
            <circle cx="2" cy="2" r="2" fill="currentColor" />
          </svg>
        </div>
      ))}
    </div>
  );
}
