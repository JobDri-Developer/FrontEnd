import React from "react";
import Icon from "../icons/Icon";

export type StepState = "active" | "inactive" | "completed";

export interface StepItem {
  id: number;
  label: string;
}

interface HeaderPanelProps {
  steps: StepItem[];
  currentStepId: number;
}

interface StepProps {
  step: StepItem;
  state: StepState;
}

const Step: React.FC<StepProps> = ({ step, state }) => {
  const isCompleted = state === "completed";
  const isActive = state === "active";

  return (
    <div
      className={`flex items-center space-x-2 p-2 rounded-card-result ${
        isActive ? "bg-fill-quaternary-assistive" : "bg-transparent"
      }`}
    >
      {/* 숫자 또는 체크 아이콘 영역 */}
      <div
        className={`flex items-center justify-center w-5 h-5 rounded-full text-cap12-med ${
          isActive
            ? "bg-fill-tertiary-default text-white"
            : isCompleted
              ? "bg-icon-neutral-assistive text-icon-neutral-weak" // 완료 시 체크 아이콘 배경
              : "bg-icon-neutral-weak text-text-neutral-disabled"
        }`}
      >
        {isCompleted ? <Icon type="CHECK_COMPLETE" /> : step.id}
      </div>

      {/* 텍스트 라벨 영역 */}
      <span
        className={`text-cap12-med ${
          isActive
            ? "text-text-neutral-description"
            : "text-text-neutral-disabled"
        }`}
      >
        {step.label}
      </span>
    </div>
  );
};

export const HeaderPanel: React.FC<HeaderPanelProps> = ({
  steps,
  currentStepId,
}) => {
  return (
    <div className="flex flex-row gap-2">
      {steps.map((step) => {
        let state: StepState = "inactive";
        if (step.id < currentStepId) {
          state = "completed";
        } else if (step.id === currentStepId) {
          state = "active";
        }

        return <Step key={step.id} step={step} state={state} />;
      })}
    </div>
  );
};
