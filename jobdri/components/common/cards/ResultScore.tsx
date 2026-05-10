import type { HTMLAttributes } from "react";
import clsx from "clsx";

interface ResultScoreProps extends HTMLAttributes<HTMLDivElement> {
  score?: number;
  maxScore?: number;
}

const size = 136;
const backgroundStrokeWidth = 4;
const progressStrokeWidth = 4;
const center = size / 2;
const backgroundRadius = (size - backgroundStrokeWidth) / 2;
const progressRadius = (size - progressStrokeWidth) / 2;
const progressCircumference = 2 * Math.PI * progressRadius;

export default function ResultScore({
  score = 64,
  maxScore = 100,
  className,
  ...divProps
}: ResultScoreProps) {
  const normalizedScore = Math.min(Math.max(score, 0), maxScore);
  const progress = maxScore > 0 ? normalizedScore / maxScore : 0;
  const dashOffset = progressCircumference * (1 - progress);

  return (
    <div
      className={clsx(
        "relative flex aspect-square h-[136px] w-[136px] flex-col items-center justify-center",
        className,
      )}
      role="img"
      aria-label={`${score}점`}
      {...divProps}
    >
      <svg
        className="absolute inset-0"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        <circle
          cx={center}
          cy={center}
          r={backgroundRadius}
          fill="none"
          stroke="#D9D9D9"
          strokeWidth={backgroundStrokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={progressRadius}
          fill="none"
          stroke="#444444"
          strokeDasharray={progressCircumference}
          strokeDashoffset={dashOffset}
          strokeWidth={progressStrokeWidth}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>

      <div className="relative flex items-start">
        <span className="text-center text-h28-bold text-[#1A1A1A] [font-feature-settings:'liga'_off,'clig'_off]">
          {score}
        </span>
        <span className="text-center text-h28-bold text-[#1A1A1A] [font-feature-settings:'liga'_off,'clig'_off]">
          점
        </span>
      </div>
    </div>
  );
}
