"use client";

import { useEffect, useState, type ComponentType } from "react";
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

/*
 * 애니메이션 JSON은 페이지 번들에 포함하지 않고, 화면에 그릴 때 별도 청크로 불러온다.
 */
const animationLoaders = {
  questionLoadingBook: () =>
    import("@/assets/lottie/question-loading-book.json"),
  questionLoadingSparkle: () =>
    import("@/assets/lottie/question-loading-sparkle.json"),
  resumeAnalysisLoading: () =>
    import("@/assets/lottie/resume-analysis-loading.json"),
};

export type LoadingAnimation = keyof typeof animationLoaders;

export default function LoadingGraphic({
  animation,
  className,
}: {
  animation: LoadingAnimation;
  className: string;
}) {
  const [animationData, setAnimationData] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    // 플레이어도 함께 받아 두어, 데이터가 준비된 뒤 빈 화면이 한 번 더 생기지 않게 한다.
    Promise.all([animationLoaders[animation](), import("lottie-react")]).then(
      ([mod]) => {
        if (!cancelled) {
          setAnimationData(mod.default);
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [animation]);

  // 불러오는 동안에도 같은 크기의 자리를 잡아 레이아웃이 흔들리지 않게 한다.
  if (!animationData) {
    return <div aria-hidden className={className} />;
  }

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
