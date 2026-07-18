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
      <div className="flex flex-col items-start gap-3 self-stretch px-1">
        <div
          className={clsx(
            "flex h-[30px] w-[30px] items-center justify-center gap-2.5 rounded-chip-s p-1",
            isWarning
              ? "bg-fill-system-fail-hover text-fill-system-fail-strong"
              : "bg-fill-secondary-assistive text-fill-secondary-default",
          )}
        >
          {isWarning ? (
            <Icon type="WARN" className="h-4 w-4 shrink-0" />
          ) : (
            <Icon type="GOOD" className="h-4 w-4 shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-2.5 self-stretch">
          <h3 className="max-h-[22px] flex-1 overflow-hidden text-btn16-semibold tracking-normal text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
            {title}
          </h3>
        </div>
      </div>

      <div className="flex h-[30px] items-center gap-1 self-stretch rounded-marker bg-fill-quaternary-assistive px-2 py-1.5">
        <span className="shrink-0 text-cap12-med tracking-normal text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
          예)
        </span>
        <span className="max-h-[17px] flex-1 truncate text-cap12-med tracking-normal text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
          {quote}
        </span>
      </div>
    </div>
  );
}
