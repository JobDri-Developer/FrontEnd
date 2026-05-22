"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/common/header/Header";
import Icon from "@/components/common/icons/Icon";
import ProgressPanelRow from "@/components/common/progress/ProgressPanelRow";

interface ResumeAnalysisLoadingProps {
  durationMs: number;
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

    const fourthStepTimer = window.setTimeout(() => {
      setCurrentStep(4);
    }, (durationMs / 4) * 3);

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
    <div className="flex min-h-screen flex-col bg-bg-default">
      <Header
        currentStep={5}
        leftAction={{ label: "돌아가기", iconType: "HOME_S", disabled: true }}
        rightAction={{ label: "저장하기", disabled: true }}
      />

      <main className="flex flex-1 flex-col items-center justify-center gap-5 self-stretch px-[82px] py-20">
        <div
          className="flex flex-col items-center gap-5"
          aria-live="polite"
          aria-busy="true"
        >
          <section className="flex w-[776px] flex-col items-start gap-20 rounded-card-l bg-bg-contents-default px-12 py-10 shadow-card">
            <div className="flex items-start justify-between self-stretch">
              <div className="flex flex-col items-start gap-6">
                <h2 className="whitespace-pre-line text-h24-bold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                  {"지원한 회사 기준으로\n채점하고 있어요"}
                </h2>

                <div className="flex items-start gap-1">
                  <span className="text-b16-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
                    {formatRemainingTime(remainingSeconds)}
                  </span>
                  <span className="text-b16-med text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
                    남음
                  </span>
                </div>
              </div>

              <div className="h-28 w-[356px] bg-[#F2F2F2]" />
            </div>

            <ProgressPanelRow
              itemCount={4}
              currentStep={currentStep}
              items={progressItems}
              className="gap-8 self-stretch"
            />
          </section>

          <div className="flex flex-col items-center justify-center gap-2 rounded-[12px]">
            <div className="flex items-center gap-1">
              <Icon
                type="LIGHTBULB"
                className="h-4 w-4 text-icon-neutral-assistive"
              />
              <span className="text-cap12-med text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
                tip
              </span>
            </div>

            <p className="whitespace-pre-line text-center text-cap12-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
              {
                "자소서에 기록되지 않은 경험을 추가로 저장해보세요!\n어떤 기업이든 인재상을 파악한 뒤, 핵심 경험만 모아 자소서를 작성해드릴게요."
              }
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
