"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/header/Header";
import { LLMInput } from "@/components/common/input";
import { ModalNotice } from "@/components/common/modal";
import { Toast } from "@/components/common/toast";
import { INTRO_STEPS } from "@/components/mockApply/home/homeSteps";
import clsx from "clsx";
import {
  clearJobPostingDraft,
  getJobPostingDraft,
  saveJobPostingDraft,
} from "../jobPostingDraftStore";

function JobPostingStepCard({ step }: { step: (typeof INTRO_STEPS)[number] }) {
  const StepImage = step.Image;
  const isStepTwo = step.step === "STEP 02";
  const isStepThree = step.step === "STEP 03";

  return (
    <article className="flex h-[280px] w-[309.333px] items-start justify-center gap-3 overflow-hidden rounded-card bg-[#EFF1FF] px-6 py-8">
      <div className="flex w-[280px] shrink-0 flex-col items-center gap-[18px]">
        <div className="flex flex-col items-center gap-2 self-stretch">
          <div className="flex flex-col items-start self-stretch">
            <span className="line-clamp-1 self-stretch text-center text-label14-semibold text-text-primary-default [font-feature-settings:'liga'_off,'clig'_off]">
              {step.step}
            </span>
            <h3 className="line-clamp-1 self-stretch text-center text-sub14-med text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
              {step.title}
            </h3>
          </div>

          <p className="line-clamp-3 whitespace-pre-line text-center text-cap12-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
            {step.description}
          </p>
        </div>

        {isStepThree ? (
          <div className="flex h-[240px] w-[240px] shrink-0 items-start justify-center overflow-visible pt-0 pr-[16.051px] pb-[44.283px] pl-[15.06px]">
            <StepImage
              aria-hidden="true"
              className="h-[200.718px] w-[208.889px] shrink-0 -translate-y-6"
              preserveAspectRatio="xMidYMid meet"
            />
          </div>
        ) : (
          <div
            className={clsx(
              "flex h-[240px] w-[240px] shrink-0 items-start overflow-visible",
              isStepTwo ? "justify-start" : "justify-center",
            )}
          >
            <StepImage
              aria-hidden="true"
              className={clsx(
                "shrink-0",
                isStepTwo
                  ? "h-[157px] w-[313px] max-w-none -translate-x-10"
                  : "h-[240px] w-[240px]",
              )}
              preserveAspectRatio={
                isStepTwo ? "xMinYMin meet" : "xMidYMin meet"
              }
            />
          </div>
        )}
      </div>
    </article>
  );
}

export default function JobPostingCreatePage() {
  const router = useRouter();
  const [initialDraft] = useState(getJobPostingDraft);
  const [isInputActive, setIsInputActive] = useState(
    initialDraft.value.trim().length > 0 || initialDraft.files.length > 0,
  );
  const [jobPostingInputValue, setJobPostingInputValue] = useState(
    initialDraft.value,
  );
  const [attachedFiles, setAttachedFiles] = useState<File[]>(
    initialDraft.files,
  );
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showInvalidDataModal, setShowInvalidDataModal] = useState(false);

  const [jobPostingToastMessage, setJobPostingToastMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const analysisError = searchParams.get("analysisError");

    if (analysisError === "not_saved") {
      const modalTimer = window.setTimeout(() => {
        setShowInvalidDataModal(true);
        window.history.replaceState(null, "", window.location.pathname);
      }, 0);

      return () => window.clearTimeout(modalTimer);
    }

    const toastMessage =
      searchParams.get("analysisCanceled") === "1"
        ? "공고 분석을 중단했습니다."
        : analysisError === "1"
          ? "업로드에 실패했습니다."
          : analysisError;

    if (!toastMessage) {
      return;
    }

    const openToastTimer = window.setTimeout(() => {
      setJobPostingToastMessage(toastMessage);
      window.history.replaceState(null, "", window.location.pathname);
    }, 0);
    const toastTimer = window.setTimeout(() => {
      setJobPostingToastMessage(null);
    }, 3000);

    return () => {
      window.clearTimeout(openToastTimer);
      window.clearTimeout(toastTimer);
    };
  }, []);

  const handleSubmit = () => {
    saveJobPostingDraft({
      files: attachedFiles,
      value: jobPostingInputValue,
    });

    router.push("/mockApply/job/loading");
  };

  const handleHomeClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const hasInput =
      jobPostingInputValue.trim().length > 0 || attachedFiles.length > 0;

    if (!hasInput) {
      clearJobPostingDraft();
      router.push("/");
      return;
    }

    setShowExitConfirm(true);
  };

  const closeExitConfirm = () => setShowExitConfirm(false);
  const leaveWithoutSaving = () => {
    clearJobPostingDraft();
    router.push("/");
  };

  return (
    <div className="flex h-dvh min-w-[1100px] flex-col overflow-hidden bg-line-neutral-assistive">
      <Header
        type="apply"
        currentStep={2}
        homeAction={{
          label: "홈으로",
          onClick: handleHomeClick,
        }}
        className="min-w-[1100px] max-w-none shrink-0 self-stretch"
      />

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center self-stretch px-2 pb-2">
        <main className="flex h-full min-h-0 flex-col items-center justify-start self-stretch overflow-hidden rounded-card-l bg-fill-quaternary-assistive">
          <div
            className={clsx(
              "flex flex-1 flex-col items-center self-stretch",
              isInputActive
                ? "justify-center gap-0 -translate-y-[4dvh]"
                : "justify-center gap-[6.6dvh] pb-[2dvh]",
            )}
          >
            <section className="flex flex-col items-center gap-[60px]">
              <div className="flex flex-col items-center gap-2">
                <h1 className="text-center text-h28-bold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                  지원하고자하는 기업의 공고를 붙여넣으세요
                </h1>
                <p className="text-center text-b16-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
                  첨부한 내용을 바탕으로 모의 공고가 생성되고 내가 작성한
                  자소서를 채점받을 수 있습니다.
                </p>
              </div>

              <LLMInput
                value={jobPostingInputValue}
                onChange={setJobPostingInputValue}
                onFilesChange={setAttachedFiles}
                onFocus={() => setIsInputActive(true)}
                onSubmit={handleSubmit}
                defaultFiles={initialDraft.files}
              />
            </section>

            {!isInputActive && (
              <section className="flex items-start gap-5">
                {INTRO_STEPS.map((step) => (
                  <JobPostingStepCard key={step.step} step={step} />
                ))}
              </section>
            )}
          </div>
        </main>
      </div>

      {showInvalidDataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
          <ModalNotice
            type="alert"
            title="공고 내용을 불러오지 못했어요"
            description={`공고 내용이 정확히 입력되었는지 확인 후,\n자세하게 다시 작성해 주세요.`}
            onClose={() => setShowInvalidDataModal(false)}
            primaryAction={{
              label: "확인",
              onClick: () => setShowInvalidDataModal(false),
            }}
          />
        </div>
      )}

      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
          <ModalNotice
            type="confirmationModal"
            title="페이지를 나가시겠습니까?"
            description="작성 중인 내용이 저장되지 않습니다."
            onClose={closeExitConfirm}
            secondaryAction={{
              label: "나가기",
              onClick: leaveWithoutSaving,
            }}
            primaryAction={{
              label: "계속 작성",
              onClick: closeExitConfirm,
            }}
          />
        </div>
      )}

      {jobPostingToastMessage && (
        <Toast
          message={jobPostingToastMessage}
          variant="warning"
          onClose={() => setJobPostingToastMessage(null)}
          className="!right-7 !bottom-7 !max-w-none !rounded-card"
        />
      )}
    </div>
  );
}
