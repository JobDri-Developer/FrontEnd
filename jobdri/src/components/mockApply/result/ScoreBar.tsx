"use client";
import clsx from "clsx";

interface ScoreBarProps {
  score: number;
  maxScore?: number;
  tone?: "auto" | "primary" | "danger";
  className?: string;
  indicatorClassName?: string;
}

export default function ScoreBar({
  score,
  maxScore = 100,
  tone = "auto",
  className,
  indicatorClassName,
}: ScoreBarProps) {
  const progress = Math.min(score / maxScore, 1);
  const percentage = progress * 100;

  const bgColorClass =
    tone === "primary"
      ? "bg-[linear-gradient(90deg,var(--color-blue-500)_0%,var(--color-blue-700)_100%)]"
      : tone === "danger"
        ? "bg-[linear-gradient(90deg,var(--color-red-400)_0%,var(--color-red-600)_100%)]"
        : score >= 60
          ? "bg-[linear-gradient(90deg,var(--color-blue-500)_0%,var(--color-blue-700)_100%)]"
          : "bg-[linear-gradient(90deg,var(--color-red-400)_0%,var(--color-red-600)_100%)]";

  return (
    <div
      className={clsx(
        "h-4 flex-1 overflow-hidden rounded-full bg-fill-quaternary-assistive",
        className,
      )}
    >
      <div
        className={clsx(
          "h-full rounded-full transition-all duration-500 ease-in-out",
          bgColorClass,
          indicatorClassName,
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
