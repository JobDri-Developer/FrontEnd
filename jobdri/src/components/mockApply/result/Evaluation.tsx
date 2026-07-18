"use client";

import type { HTMLAttributes } from "react";
import Icon from "@/components/common/icons/Icon";
import clsx from "clsx";

interface EvaluateProps extends HTMLAttributes<HTMLDivElement> {
  score?: number;
  rating?: "good" | "bad";
  evaluate?: string;
  content?: string;
  quote: string;
}

export default function Evaluation({
  score,
  rating,
  evaluate,
  content,
  quote,
  className,
  ...divProps
}: EvaluateProps) {
  const isWarning = rating ? rating === "bad" : (score ?? 0) < 60;
  const title = content ?? evaluate;

  return (
    <div
      className={clsx(
        "flex flex-col items-start gap-6 self-stretch rounded-card-l border border-line-neutral-assistive px-5 pt-5 pb-6",
        className,
      )}
      {...divProps}
    >
      <div
        className={clsx(
          "flex h-11 w-11 items-center justify-center rounded-chip-s",
          isWarning
            ? "bg-fill-system-fail-hover text-text-system-fail"
            : "bg-fill-secondary-assistive text-text-system-complete",
        )}
      >
        {isWarning ? (
          <Icon type="WARN" className="h-5 w-5" />
        ) : (
          <Icon type="GOOD" className="h-5 w-5 text-fill-secondary-default" />
        )}
      </div>

      <div className="flex w-full flex-col gap-6">
        <h3 className="text-t20-semibold tracking-normal text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
          {title}
        </h3>
        <p className="w-full truncate rounded-marker bg-fill-quaternary-assistive px-3 py-2 text-label14-med tracking-normal text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
          예) {quote}
        </p>
      </div>
    </div>
  );
}
