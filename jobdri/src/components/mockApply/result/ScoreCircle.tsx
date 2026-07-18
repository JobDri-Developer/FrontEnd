"use client";
import type { CSSProperties } from "react";
import clsx from "clsx";

interface ScoreCircleProps {
  score: number;
  maxScore?: number;
  size?: "large" | "medium";
  className?: string;
}

const RING_GRADIENT_STOP_DEGREES = 46.73077046871185;

const sizeStyles = {
  large: {
    frame: "h-48 w-48",
    diameter: 192,
    ringWidth: 18,
    score: "text-[36px]",
  },
  medium: {
    frame: "h-[136px] w-[136px]",
    diameter: 136,
    ringWidth: 14,
    score: "text-[36px]",
  },
} as const;

function getProgressGradient(progressDegrees: number, isWarning: boolean) {
  const gradientStop = Math.min(
    RING_GRADIENT_STOP_DEGREES,
    progressDegrees,
  );
  const startColor = isWarning
    ? "var(--color-red-400)"
    : "var(--color-blue-400)";
  const endColor = isWarning
    ? "var(--color-red-600)"
    : "var(--color-blue-700)";

  return `conic-gradient(from 0deg at 50% 50%, ${startColor} 0deg, ${endColor} ${gradientStop}deg, ${endColor} ${progressDegrees}deg, transparent ${progressDegrees}deg, transparent 360deg)`;
}

function getCapPosition({
  degrees,
  diameter,
  ringWidth,
}: {
  degrees: number;
  diameter: number;
  ringWidth: number;
}) {
  const angleRadians = (degrees * Math.PI) / 180;
  const center = diameter / 2;
  const radius = (diameter - ringWidth) / 2;

  return {
    left: center + radius * Math.sin(angleRadians) - ringWidth / 2,
    top: center - radius * Math.cos(angleRadians) - ringWidth / 2,
  };
}

export default function ScoreCircle({
  score,
  maxScore = 100,
  size = "large",
  className,
}: ScoreCircleProps) {
  const sizeStyle = sizeStyles[size];
  const normalizedScore = Math.min(Math.max(score, 0), maxScore);
  const progress = maxScore > 0 ? normalizedScore / maxScore : 0;
  const progressDegrees = progress * 360;
  const isWarning = score < 60;
  const ringMask = `radial-gradient(farthest-side, transparent calc(100% - ${sizeStyle.ringWidth}px), #000 calc(100% - ${sizeStyle.ringWidth}px))`;
  const ringMaskStyle = {
    WebkitMask: ringMask,
    mask: ringMask,
  } satisfies CSSProperties;
  const startCapPosition = getCapPosition({
    degrees: 0,
    diameter: sizeStyle.diameter,
    ringWidth: sizeStyle.ringWidth,
  });
  const endCapPosition = getCapPosition({
    degrees: progressDegrees,
    diameter: sizeStyle.diameter,
    ringWidth: sizeStyle.ringWidth,
  });

  const capColor = isWarning
    ? "var(--color-red-600)"
    : "var(--color-blue-700)";
  const startCapColor = isWarning
    ? "var(--color-red-400)"
    : "var(--color-blue-400)";

  return (
    <div
      className={clsx(
        "relative flex shrink-0 items-center justify-center",
        sizeStyle.frame,
        className,
      )}
    >
      <div
        className="absolute inset-0 rounded-full bg-fill-quaternary-assistive"
        style={ringMaskStyle}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 rounded-full transition-all duration-500 ease-in-out"
        style={{
          ...ringMaskStyle,
          background: getProgressGradient(progressDegrees, isWarning),
        }}
        aria-hidden="true"
      />
      {progress > 0 && (
        <>
          <span
            className="absolute rounded-full"
            style={{
              width: sizeStyle.ringWidth,
              height: sizeStyle.ringWidth,
              background: startCapColor,
              ...startCapPosition,
            }}
            aria-hidden="true"
          />
          <span
            className="absolute rounded-full"
            style={{
              width: sizeStyle.ringWidth,
              height: sizeStyle.ringWidth,
              background: capColor,
              ...endCapPosition,
            }}
            aria-hidden="true"
          />
        </>
      )}

      <div className="relative z-10 flex h-full w-full items-center justify-center">
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
