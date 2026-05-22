"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Header from "@/components/common/header/Header";
import Icon from "@/components/common/icons/Icon";
import LoadMotion from "@/components/common/LoadMotion";

interface QuestionGenerationLoadingProps {
  companyName: string;
  jobName: string;
  durationMs: number;
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

  return (
    <div className="flex min-h-[19.5px] items-start justify-center gap-2 self-stretch">
      <div className="flex h-[19.5px] w-5 shrink-0 items-center justify-center">
        {isActive ? (
          <LoadMotion
            className="py-1"
            dotFrameClassName="h-1.5 w-1"
            dotClassName="h-1 w-1"
          />
        ) : isDone ? (
          <Icon type="CHECK_M" className="h-5 w-5 text-icon-neutral-assistive" />
        ) : (
          <span aria-hidden="true" className="h-5 w-5" />
        )}
      </div>

      <p
        className={clsx(
          "min-w-0 max-w-full text-center !leading-[1.1] [font-feature-settings:'liga'_off,'clig'_off]",
          isActive ? "text-text-neutral-title" : "text-text-neutral-caption",
        )}
      >
        <span className="text-cap12-semibold !leading-[1.2]">{emphasis}</span>
        <span className="text-cap12-med !leading-[1.2]">{description}</span>
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
            <article className="flex h-[426px] w-[364px] flex-col items-center gap-10 rounded-card-l bg-bg-contents-default px-10 py-16 shadow-card">
              <div className="h-[156px] w-[156px] shrink-0 bg-[#E1E1E1]" />

              <div className="flex flex-col items-center justify-center gap-4 self-stretch">
                <div className="h-4 w-4 shrink-0 bg-[#E1E1E1]" />

                <div className="flex flex-col items-start gap-2 self-stretch">
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
