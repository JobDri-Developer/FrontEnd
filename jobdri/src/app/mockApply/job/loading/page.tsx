"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Header from "@/components/common/header/Header";
import { TextButton } from "@/components/common/buttons";
import Icon from "@/components/common/icons/Icon";
import { ModalNotice } from "@/components/common/modal";
import LoadingGraphic from "@/components/mockApply/LoadingGraphic";
import questionLoadingBook from "@/assets/lottie/question-loading-book.json";
import questionLoadingSparkle from "@/assets/lottie/question-loading-sparkle.json";
import { clearJobPostingDraft } from "../jobPostingDraftStore";

const MIN_LOADING_DURATION_MS = 50_000;
const MAX_LOADING_DURATION_MS = 60_000;

const loadingStatusMessages = [
  "입력해주신 이미지를 확인하고 있어요.",
  "입력해주신 텍스트를 확인하고 있어요.",
  "보기 좋게 정리하고 있어요.",
];

type LoadingStepStatus = "done" | "active" | "pending";

function createRandomLoadingDurationMs() {
  return (
    MIN_LOADING_DURATION_MS +
    Math.floor(
      Math.random() * (MAX_LOADING_DURATION_MS - MIN_LOADING_DURATION_MS + 1),
    )
  );
}

function LoadingStatusRow({
  message,
  status,
}: {
  message: string;
  status: LoadingStepStatus;
}) {
  const isActive = status === "active";
  const isDone = status === "done";

  return (
    <div className="flex items-center gap-2">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center">
        {isActive && (
          <LoadingGraphic
            animationData={questionLoadingSparkle}
            className="h-6 w-6 shrink-0"
          />
        )}
        {isDone && (
          <Icon
            type="CIRCLE_CHECK"
            className="h-6 w-6 shrink-0 text-icon-neutral-assistive"
          />
        )}
      </span>
      <span
        className={clsx(
          "text-b16-reg [font-feature-settings:'liga'_off,'clig'_off]",
          isActive ? "text-text-neutral-title" : "text-text-neutral-caption",
        )}
      >
        {message}
      </span>
    </div>
  );
}

function LoadingStatusRows({ durationMs }: { durationMs: number }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const stepDurationMs = durationMs / loadingStatusMessages.length;
    const timers = loadingStatusMessages.map((_, index) =>
      window.setTimeout(() => {
        setActiveStep(index + 1);
      }, stepDurationMs * (index + 1)),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [durationMs]);

  return (
    <div className="flex flex-col items-start gap-1">
      {loadingStatusMessages.map((message, index) => (
        <LoadingStatusRow
          key={message}
          message={message}
          status={
            index < activeStep
              ? "done"
              : index === activeStep
                ? "active"
                : "pending"
          }
        />
      ))}
    </div>
  );
}

export default function JobPostingLoadingPage() {
  const router = useRouter();
  const [loadingDurationMs] = useState(createRandomLoadingDurationMs);
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  useEffect(() => {
    if (showStopConfirm) {
      return;
    }

    const errorTimer = window.setTimeout(() => {
      router.replace("/mockApply/job/create?analysisError=1");
    }, loadingDurationMs);

    return () => {
      window.clearTimeout(errorTimer);
    };
  }, [loadingDurationMs, router, showStopConfirm]);

  const closeStopConfirm = () => setShowStopConfirm(false);
  const stopAnalysis = () => {
    router.replace("/mockApply/job/create?analysisCanceled=1");
  };

  return (
    <div className="flex h-dvh min-w-[1100px] flex-col overflow-hidden bg-line-neutral-assistive">
      <Header
        type="apply"
        currentStep={2}
        homeAction={{
          label: "홈으로",
          onClick: () => clearJobPostingDraft(),
        }}
        className="min-w-[1100px] max-w-none shrink-0 self-stretch"
      />

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center self-stretch px-2 pb-2">
        <main
          className="flex h-full min-h-0 items-center justify-between self-stretch overflow-hidden rounded-card-l bg-fill-quaternary-assistive"
          aria-live="polite"
          aria-busy="true"
        >
          <section className="flex [flex:0_0_auto] self-stretch flex-col items-start justify-between pt-20 pr-0 pb-16 pl-20">
            <div className="flex flex-col items-start gap-10">
              <h1 className="whitespace-pre-line text-[28px] leading-[140%] font-bold tracking-[-0.56px] text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                {"입력해주신 내용을\n확인하고 있어요!"}
              </h1>

              <LoadingStatusRows durationMs={loadingDurationMs} />
            </div>

            <TextButton
              label="돌아가기"
              styleType="secondary"
              size="large"
              iconType="ARROW_L"
              iconPosition="left"
              onClick={() => setShowStopConfirm(true)}
            />
          </section>

          <section className="flex [flex:1_0_0] self-stretch flex-col items-center gap-16 pt-[120px]">
            <div className="h-[468.422px] w-[640px] shrink-0 [aspect-ratio:97/71]">
              <LoadingGraphic
                animationData={questionLoadingBook}
                className="h-full w-full"
              />
            </div>
          </section>
        </main>
      </div>

      {showStopConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
          <ModalNotice
            type="confirmationModal"
            title="분석을 중단하시겠습니까?"
            description="분석을 중단하고 공고 입력으로 돌아갑니다."
            onClose={closeStopConfirm}
            secondaryAction={{
              label: "중단하기",
              onClick: stopAnalysis,
            }}
            primaryAction={{
              label: "취소",
              onClick: closeStopConfirm,
            }}
          />
        </div>
      )}
    </div>
  );
}
