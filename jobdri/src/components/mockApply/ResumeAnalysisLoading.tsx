"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/header/Header";
import ProgressPanelRow from "@/components/common/progress/ProgressPanelRow";
import { TextButton } from "@/components/common/buttons";
import resumeAnalysisLoading from "@/assets/lottie/resume-analysis-loading.json";
import LoadingGraphic from "./LoadingGraphic";
import { ModalNotice } from "@/components/common/modal";

interface ResumeAnalysisLoadingProps {
  durationMs: number;
  onBack?: () => void;
  onComplete?: () => void;
  applicationLabel?: string;
  isFailed?: boolean;
  onErrorConfirm?: () => void;
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
  onComplete,
  applicationLabel,
  isFailed = false,
}: ResumeAnalysisLoadingProps) {
  const initialRemainingSeconds = Math.max(1, Math.ceil(durationMs / 1000));
  const [remainingSeconds, setRemainingSeconds] = useState(
    initialRemainingSeconds,
  );
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  useEffect(() => {
    if (isFailed) return;

    const countdownTimer = window.setInterval(() => {
      setRemainingSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    const completeTimer = window.setTimeout(() => {
      onComplete?.();
    }, durationMs);

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
      window.clearTimeout(completeTimer);
      window.clearTimeout(secondStepTimer);
      window.clearTimeout(thirdStepTimer);
      window.clearTimeout(fourthStepTimer);
    };
  }, [durationMs, onComplete, isFailed]);

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
    <div className="relative flex h-dvh min-w-[1100px] flex-col overflow-hidden bg-fill-quaternary-default">
      <Header currentStep={5} applicationLabel={applicationLabel} />

      <div className="flex min-h-0 flex-1 items-start px-2 pb-2">
        <section
          className="flex min-h-0 flex-1 items-center justify-between self-stretch overflow-hidden rounded-card-l bg-bg-default"
          aria-live="polite"
          aria-busy="true"
        >
          <main className="flex min-h-0 flex-1 items-center justify-between self-stretch">
            <aside className="flex min-h-0 w-[360px] shrink-0 flex-col items-start justify-between self-stretch pt-20 pr-0 pb-16 pl-20">
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

            <div className="flex min-h-0 min-w-0 [flex:1_0_0] items-start justify-center gap-16 self-stretch pt-40">
              <LoadingGraphic
                animationData={resumeAnalysisLoading}
                className="aspect-[35/29] w-full max-w-[560px] min-w-0 shrink"
              />
            </div>
          </main>
        </section>
      </div>

      {isFailed && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
          <ModalNotice
            type="alertModal"
            title="나중에 다시 시도해주세요."
            description="응답 대기 시간이 길어져 작업을 멈췄어요. 소모된 크레딧이 복구됐어요."
            onClose={() => router.replace("/")}
            primaryAction={{
              label: "확인",
              onClick: () => router.replace("/"),
            }}
          />
        </div>
      )}
    </div>
  );
}
