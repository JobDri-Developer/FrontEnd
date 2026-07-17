"use client";

import { useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/header/Header";
import { LLMInput } from "@/components/common/input";
import { ModalNotice } from "@/components/common/modal";
import { INTRO_STEPS } from "@/components/mockApply/home/homeSteps";
import clsx from "clsx";

function JobPostingStepCard({
  step,
}: {
  step: (typeof INTRO_STEPS)[number];
}) {
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
  const [isInputActive, setIsInputActive] = useState(false);
  const [jobPostingInputValue, setJobPostingInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const hasDraftContent =
    jobPostingInputValue.trim().length > 0 || attachedFiles.length > 0;

  const handleHomeClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!hasDraftContent) {
      router.push("/");
      return;
    }

    setShowExitConfirm(true);
  };

  const closeExitConfirm = () => setShowExitConfirm(false);
  const leaveWithoutSaving = () => router.push("/");

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
    </div>
  );
}
