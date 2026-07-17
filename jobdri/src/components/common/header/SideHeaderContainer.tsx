import React from "react";
import clsx from "clsx";

interface SideHeaderContainerProps {
  leading?: React.ReactNode;
  title: string;
  subtitle?: string;
  element: React.ReactElement;
  className?: string;
}

export default function SideHeaderContainer({
  leading,
  title,
  subtitle,
  className,
  element,
}: SideHeaderContainerProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-start gap-4 transition-all w-80",
        leading ? "py-16 pl-18" : "py-20 pl-20",
        className,
      )}
    >
      {leading && (
        <div className="mb-3 shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-icon-neutral-strong text-text-neutral-white text-sub14-semibold">
          {leading}
        </div>
      )}

      <div className="flex flex-col gap-5 justify-center min-w-0">
        <h4 className="text-h24-bold text-text-neutral-title break-keep">
          {title}
        </h4>
        {subtitle && (
          <p className="text-sub14-reg text-text-neutral-title break-keep">
            {subtitle}
          </p>
        )}
      </div>
      {element}
    </div>
  );
}
