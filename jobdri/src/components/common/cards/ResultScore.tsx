import type { HTMLAttributes } from "react";
import clsx from "clsx";

interface ResultScoreProps extends HTMLAttributes<HTMLDivElement> {
  score?: number;
  maxScore?: number;
  size?: "large" | "small";
}

const sizeConfigs = {
  large: {
    diameter: 136,
    strokeWidth: 4,
    textClassName: "text-h28-bold",
  },
  small: {
    diameter: 64,
    strokeWidth: 4,
    textClassName: "text-b16-semibold",
  },
} as const;

export default function ResultScore({
  score = 64,
  maxScore = 100,
  size = "large",
  className,
  style,
  ...divProps
}: ResultScoreProps) {
  const { diameter, strokeWidth, textClassName } = sizeConfigs[size];
  const center = diameter / 2;
  const radius = (diameter - strokeWidth) / 2;
  const progressCircumference = 2 * Math.PI * radius;
  const normalizedScore = Math.min(Math.max(score, 0), maxScore);
  const progress = maxScore > 0 ? normalizedScore / maxScore : 0;
  const dashOffset = progressCircumference * (1 - progress);

  return (
    <div
      className={clsx(
        "relative flex aspect-square flex-col items-center justify-center",
        className,
      )}
      style={{ width: diameter, height: diameter, ...style }}
      role="img"
      aria-label={`${score}점`}
      {...divProps}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
        aria-hidden="true"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#D9D9D9"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#444444"
          strokeDasharray={progressCircumference}
          strokeDashoffset={dashOffset}
          strokeWidth={strokeWidth}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>

      <div className="relative flex items-start">
        <span
          className={clsx(
            "text-center text-[#1A1A1A] [font-feature-settings:'liga'_off,'clig'_off]",
            textClassName,
          )}
        >
          {score}
        </span>
        <span
          className={clsx(
            "text-center text-[#1A1A1A] [font-feature-settings:'liga'_off,'clig'_off]",
            textClassName,
          )}
        >
          점
        </span>
      </div>
    </div>
  );
}
