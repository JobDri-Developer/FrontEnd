"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/common/header/Header";
import ProgressPanelRow from "@/components/common/progress/ProgressPanelRow";
import { TextButton } from "@/components/common/buttons";
import resumeAnalysisLoading from "@/assets/lottie/resume-analysis-loading.json";
import LoadingGraphic from "./LoadingGraphic";

interface ResumeAnalysisLoadingProps {
  durationMs: number;
  onBack?: () => void;
}

function formatRemainingTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}초`;
  }

  return `${minutes}분 ${seconds}초`;
}

export default function ResumeAnalysisLoading({
  durationMs,
  onBack,
}: ResumeAnalysisLoadingProps) {
  const initialRemainingSeconds = Math.max(1, Math.ceil(durationMs / 1000));
  const [remainingSeconds, setRemainingSeconds] = useState(
    initialRemainingSeconds,
  );
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const countdownTimer = window.setInterval(() => {
      setRemainingSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    const secondStepTimer = window.setTimeout(() => {
      setCurrentStep(2);
    }, durationMs / 4);

    const thirdStepTimer = window.setTimeout(() => {
      setCurrentStep(3);
    }, durationMs / 2);

    const fourthStepTimer = window.setTimeout(
      () => {
        setCurrentStep(4);
      },
      (durationMs / 4) * 3,
    );

    return () => {
      window.clearInterval(countdownTimer);
      window.clearTimeout(secondStepTimer);
      window.clearTimeout(thirdStepTimer);
      window.clearTimeout(fourthStepTimer);
    };
  }, [durationMs]);

  const progressItems = useMemo(
    () => [
      {
        title: "내용 구조 파악",
        description: "작성해주신 내용을 확인하고 의미를 분석합니다.",
      },
      {
        title: "자소서 평가",
        description: "직무 스킬을 매칭하고 적합도를 평가합니다.",
      },
      {
        title: "지원자 간 비교",
        description: "동일 회사 및 직무의 지원자와 비교 평가합니다.",
      },
      {
        title: "리포트 생성",
        description: "분석 결과를 토대로 약점 리포트를 생성합니다.",
      },
    ],
    [],
  );

  return (
    <div className="flex min-h-screen min-w-[1100px] flex-col bg-fill-quaternary-default">
      <Header currentStep={5} />

      <div className="flex h-[839px] items-start px-2 pb-2">
        <section
          className="flex flex-1 items-center justify-between self-stretch rounded-card-l bg-bg-default"
          aria-live="polite"
          aria-busy="true"
        >
          <main className="flex flex-1 items-center justify-between self-stretch">
            <aside className="flex w-[360px] shrink-0 flex-col items-start justify-between self-stretch pt-20 pr-0 pb-16 pl-20">
              <div className="flex flex-col items-start gap-8">
                <div className="flex flex-col items-start gap-5">
                  <h1 className="whitespace-pre-line text-h24-bold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                    {"지원한 회사 기준으로\n채점하고 있어요"}
                  </h1>

                  <div className="flex items-start gap-1">
                    <span className="text-b16-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
                      {formatRemainingTime(remainingSeconds)}
                    </span>
                    <span className="text-b16-med text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
                      남음
                    </span>
                  </div>
                </div>

                <ProgressPanelRow
                  itemCount={4}
                  currentStep={currentStep}
                  items={progressItems}
                  className="gap-1 self-stretch"
                  itemClassName="!w-[224px]"
                />
              </div>

              <TextButton
                label="돌아가기"
                size="large"
                styleType="secondary"
                iconPosition="left"
                onClick={onBack}
              />
            </aside>

            <div className="flex flex-1 flex-col items-center gap-16 self-stretch pt-40">
              <LoadingGraphic
                animationData={resumeAnalysisLoading}
                className="h-[464px] w-[560px] shrink-0 [aspect-ratio:35/29]"
              />
            </div>
          </main>
        </section>
      </div>
    </div>
  );
}
