"use client";
import clsx from "clsx";

interface ScoreCircleProps {
  score: number;
  maxScore?: number;
  size?: "large" | "medium";
  className?: string;
}

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const STROKE_WIDTH = 10;
const CORNER_RADIUS = 3;

const sizeStyles = {
  large: {
    frame: "h-48 w-48",
    score: "text-[36px]",
  },
  medium: {
    frame: "h-[136px] w-[136px]",
    score: "text-[36px]",
  },
} as const;

export default function ScoreCircle({
  score,
  maxScore = 100,
  size = "large",
  className,
}: ScoreCircleProps) {
  const sizeStyle = sizeStyles[size];
  const progress = Math.min(score / maxScore, 1);
  const offset = CIRCUMFERENCE * (1 - progress);

  const strokeColorClass =
    score >= 60 ? "text-fill-primary-default" : "text-fill-system-fail-strong";

  return (
    <div
      className={clsx(
        "relative flex shrink-0 items-center justify-center",
        sizeStyle.frame,
        className,
      )}
    >
      {/* SVG와 내부 텍스트 영역 */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full -rotate-90 overflow-visible"
        >
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            className="text-fill-quaternary-assistive"
          />

          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="butt"
            className={clsx(
              strokeColorClass,
              "transition-all duration-500 ease-in-out",
            )}
          />

          {/* 3. 시작점 둥근 사각형 캡 (고정) */}
          {progress > 0 && (
            <rect
              x={50 + RADIUS - STROKE_WIDTH / 2}
              y={50 - STROKE_WIDTH / 2}
              width={STROKE_WIDTH}
              height={STROKE_WIDTH}
              rx={CORNER_RADIUS}
              fill="currentColor"
              className={clsx(
                strokeColorClass,
                "transition-colors duration-500",
              )}
            />
          )}

          {progress > 0 && (
            <g
              style={{
                transform: `rotate(${progress * 360}deg)`,
                transformOrigin: "50px 50px",
                transition: "transform 500ms ease-in-out",
              }}
            >
              <rect
                x={50 + RADIUS - STROKE_WIDTH / 2}
                y={50 - STROKE_WIDTH / 2}
                width={STROKE_WIDTH}
                height={STROKE_WIDTH}
                rx={CORNER_RADIUS}
                fill="currentColor"
                className={clsx(
                  strokeColorClass,
                  "transition-colors duration-500",
                )}
              />
            </g>
          )}
        </svg>

        {/* 중앙 텍스트 영역 */}
        <div className="z-10 flex flex-col items-center justify-center text-center">
          <span
            className={clsx(
              "font-bold tracking-normal text-text-neutral-title",
              sizeStyle.score,
            )}
          >
            {score}
          </span>
          <span className="mt-1 text-cap12-med text-text-neutral-caption">
            종합 점수
          </span>
        </div>
      </div>
    </div>
  );
}
