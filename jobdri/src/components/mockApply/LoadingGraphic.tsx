"use client";

import type { ComponentType } from "react";
import dynamic from "next/dynamic";

type LottieAnimationProps = {
  animationData: unknown;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  rendererSettings?: {
    preserveAspectRatio?: string;
  };
  "aria-hidden"?: boolean;
};

const LottiePlayer = dynamic<LottieAnimationProps>(
  () =>
    import("lottie-react").then(
      (mod) => mod.default as ComponentType<LottieAnimationProps>,
    ),
  { ssr: false },
);

export default function LoadingGraphic({
  animationData,
  className,
}: {
  animationData: unknown;
  className: string;
}) {
  return (
    <LottiePlayer
      aria-hidden
      animationData={animationData}
      autoplay
      className={className}
      loop
      rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
    />
  );
}
