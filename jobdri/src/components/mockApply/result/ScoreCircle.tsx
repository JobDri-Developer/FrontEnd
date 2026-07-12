"use client";
import clsx from "clsx";

interface ScoreCircleProps {
  score: number;
  maxScore?: number;
}

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const STROKE_WIDTH = 10;
const CORNER_RADIUS = 3;

export default function ScoreCircle({
  score,
  maxScore = 100,
}: ScoreCircleProps) {
  const progress = Math.min(score / maxScore, 1);
  const offset = CIRCUMFERENCE * (1 - progress);

  const strokeColorClass =
    score >= 60 ? "text-fill-primary-default" : "text-fill-system-fail-strong";

  return (
    <div className="relative flex h-48 w-48 shrink-0 items-center justify-center">
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
          <span className="text-[36px] font-bold tracking-tight text-text-neutral-title">
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
