"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import dynamic from "next/dynamic";
import questionLoadingBook from "@/assets/lottie/question-loading-book.json";
import questionLoadingSparkle from "@/assets/lottie/question-loading-sparkle.json";
import Header from "@/components/common/header/Header";
import Icon from "@/components/common/icons/Icon";

interface QuestionGenerationLoadingProps {
  companyName: string;
  jobName: string;
  durationMs: number;
}

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

function LoadingGraphic({
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

function LoadingStep({
  status,
  emphasis,
  description,
}: {
  status: "done" | "active" | "pending";
  emphasis: string;
  description: string;
}) {
  const isActive = status === "active";
  const isDone = status === "done";
  const showStatusIcon = isActive || isDone;

  return (
    <div className="flex min-h-5 w-[280px] items-start justify-center gap-2">
      {showStatusIcon && (
        <div className="flex h-5 w-5 shrink-0 items-center justify-center">
          {isActive ? (
            <LoadingGraphic
              animationData={questionLoadingSparkle}
              className="h-5 w-5"
            />
          ) : (
            <Icon
              type="CHECK_M"
              className="h-5 w-5 text-fill-secondary-default"
            />
          )}
        </div>
      )}

      <p
        className={clsx(
          "min-w-0 max-w-full text-center !leading-[1.1] [font-feature-settings:'liga'_off,'clig'_off]",
          isActive ? "text-text-neutral-title" : "text-text-neutral-caption",
        )}
      >
        <span className="text-cap12-semibold !leading-[1.2] [letter-spacing:0]">
          {emphasis}
        </span>
        <span className="text-cap12-med !leading-[1.2] [letter-spacing:0]">
          {description}
        </span>
      </p>
    </div>
  );
}

export default function QuestionGenerationLoading({
  companyName,
  jobName,
  durationMs,
}: QuestionGenerationLoadingProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const secondStepTimer = window.setTimeout(() => {
      setActiveStep(1);
    }, durationMs / 3);
    const thirdStepTimer = window.setTimeout(() => {
      setActiveStep(2);
    }, (durationMs / 3) * 2);

    return () => {
      window.clearTimeout(secondStepTimer);
      window.clearTimeout(thirdStepTimer);
    };
  }, [durationMs]);

  const steps = [
    {
      emphasis: companyName || "기업",
      description: "의 데이터를 분석하고 있어요",
    },
    {
      emphasis: jobName || "지원 직무",
      description: "직군의 최근 자소서 문항을 찾고 있어요",
    },
    {
      emphasis: "맞춤 질문",
      description: "을 생성하고 있어요",
    },
  ];

  return (
    <div className="flex-1 bg-line-neutral-assistive px-6 py-6">
      <div className="mx-auto flex w-[1280px] flex-col">
        <Header
          currentStep={4}
          leftAction={{ label: "돌아가기", iconType: "HOME_S", disabled: true }}
          rightAction={{ label: "저장하기", disabled: true }}
        />

        <section className="flex h-[614px] flex-col items-center justify-center self-stretch bg-bg-default px-[82px] py-[102px]">
          <div className="flex items-center gap-2.5">
            <article className="flex w-[364px] flex-col items-center justify-center gap-10 rounded-card-l bg-bg-contents-default px-10 pt-4 pb-10 shadow-card">
              <div className="flex aspect-[56/41] h-[205px] w-[280px] shrink-0 items-start justify-center overflow-hidden">
                <LoadingGraphic
                  animationData={questionLoadingBook}
                  className="h-[223.27px] w-[280px] shrink-0"
                />
              </div>

              <div className="flex w-[280px] flex-col items-center justify-center gap-4">
                <div className="flex w-[280px] flex-col items-center gap-2">
                  {steps.map((step, index) => (
                    <LoadingStep
                      key={`${index}-${step.description}`}
                      status={
                        index < activeStep
                          ? "done"
                          : index === activeStep
                            ? "active"
                            : "pending"
                      }
                      emphasis={step.emphasis}
                      description={step.description}
                    />
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
