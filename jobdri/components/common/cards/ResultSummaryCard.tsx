import type { HTMLAttributes } from "react";
import clsx from "clsx";

type ResultSummaryVariant = "default" | "low";

interface ResultSummaryCardProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  score?: number;
  maxScore?: number;
  variant?: ResultSummaryVariant;
}

const variantStyles: Record<ResultSummaryVariant, string> = {
  default: "border-line-neutral-default",
  low: "border-line-fail-default",
};

export default function ResultSummaryCard({
  title = "직무 적합도",
  score = 78,
  maxScore = 100,
  variant = "default",
  className,
  ...articleProps
}: ResultSummaryCardProps) {
  return (
    <article
      className={clsx(
        "flex w-[308px] flex-col items-start gap-2 rounded-card-result border bg-bg-contents-default px-4 py-3",
        variantStyles[variant],
        className,
      )}
      {...articleProps}
    >
      <span className="text-right text-label14-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
        {title}
      </span>

      <div className="flex items-end gap-1">
        <span className="text-right text-label14-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
          {score}점
        </span>

        <span className="flex items-center justify-center gap-2.5 pb-0.5 text-right text-cap12-semibold text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
          / {maxScore}점
        </span>
      </div>
    </article>
  );
}
