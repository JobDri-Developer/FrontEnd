"use client";
import clsx from "clsx";

interface ScoreCircleProps {
  score: number;
  maxScore?: number;
}

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const STROKE_WIDTH = 3;

export default function ScoreCircle({
  score,
  maxScore = 100,
}: ScoreCircleProps) {
  const progress = Math.min(score / maxScore, 1);
  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="relative flex h-30 w-30 shrink-0 items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        className="-rotate-90 absolute inset-0 h-full w-full"
      >
        {/* 트랙 */}
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE_WIDTH}
          className="text-fill-quaternary-assistive"
        />
        {/* 진행 */}
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={clsx(
            score >= 60
              ? ` text-text-primary-strong `
              : `text-text-system-fail`,
            "transition-all duration-500",
          )}
        />
      </svg>
      <span className="text-h24-bold text-text-neutral-title">{score}점</span>
    </div>
  );
}
