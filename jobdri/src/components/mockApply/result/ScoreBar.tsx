"use client";
import clsx from "clsx";

interface ScoreBarProps {
  score: number;
  maxScore?: number;
}

export default function ScoreBar({ score, maxScore = 100 }: ScoreBarProps) {
  const progress = Math.min(score / maxScore, 1);
  const percentage = progress * 100;

  const bgColorClass =
    score >= 60 ? "bg-fill-primary-default" : "bg-fill-system-fail-strong";

  return (
    <div className="h-4 w-121 w-max-[400px] overflow-hidden rounded-full bg-fill-quaternary-assistive">
      <div
        className={clsx(
          "h-full rounded-full transition-all duration-500 ease-in-out",
          bgColorClass,
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
