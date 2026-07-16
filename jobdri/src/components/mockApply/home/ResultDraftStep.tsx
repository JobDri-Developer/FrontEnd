import React, { ReactNode } from "react";
import Icon from "@/components/common/icons/Icon";

const STEP_LABELS: Record<number, ReactNode> = {
  1: "공고 확인",
  2: "자소서 작성",
  3: (
    <p className="flex flex-row">
      채점 중{" "}
      <Icon type="SPARKLE_LOADER" className="ml-1 text-fill-primary-default" />
    </p>
  ),
};

interface ResultDraftStepProps {
  currentStep: number;
  totalSteps?: number;
}

export const ResultDraftStep: React.FC<ResultDraftStepProps> = ({
  currentStep,
  totalSteps = 3,
}) => {
  const stepLabel = STEP_LABELS[currentStep];

  return (
    <div className="flex flex-col gap-1.5 w-[150px]">
      {/* 상태 텍스트 */}
      <span className="text-cap12-semibold text-text-primary-strong">
        {stepLabel}
      </span>

      {/* 프로그레스 바 & 숫자 */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1.25 flex-1 gap-1 rounded-full ${
                index < currentStep
                  ? "bg-fill-primary-default"
                  : "bg-fill-state-disabled"
              }`}
            />
          ))}
        </div>
        <span className="text-[11px] font-medium font-pretendard text-text-neutral-caption text-right w-5">
          {currentStep}/{totalSteps}
        </span>
      </div>
    </div>
  );
};
