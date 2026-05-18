"use client";

import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { Button } from "@/components/common/buttons";
import type { IconType } from "@/components/common/icons/Icon";

interface HeaderActionProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> {
  iconType?: IconType;
  label: string;
}

interface ProgressStep {
  label: string;
}

interface HeaderProps {
  title?: string;
  leftAction?: HeaderActionProps;
  rightAction?: HeaderActionProps;
  currentStep?: number;
  steps?: ProgressStep[];
}

const defaultSteps: ProgressStep[] = [
  { label: "유형 선택" },
  { label: "공고 생성" },
  { label: "공고 확인" },
  { label: "문항 선택" },
  { label: "자소서 입력" },
  { label: "결과 확인" },
];

function HeaderAction({
  iconType,
  label,
  className = "",
  ...buttonProps
}: HeaderActionProps) {
  return (
    <Button
      label={label}
      styleType="quaternary"
      size="small"
      iconType={iconType}
      className={className}
      {...buttonProps}
    />
  );
}

export default function Header({
  title = "모의 서류 지원",
  leftAction = { label: "돌아가기", iconType: "HOME_S" },
  rightAction = { label: "저장하기" },
  currentStep = 1,
  steps = defaultSteps,
}: HeaderProps) {
  return (
    <header className="flex w-[1280px] items-start justify-between bg-[#F4F4F6] px-[82px] pt-10 pb-4">
      <div className="flex max-w-[1440px] flex-1 items-start gap-5">
        <div className="flex min-w-0 flex-1 items-start gap-5">
          <div className="flex shrink-0 self-stretch items-start justify-center gap-2.5 py-2 pr-2 pl-0">
            <h1 className="text-center text-label14-semibold tracking-normal text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
              {title}
            </h1>
          </div>

          <div className="flex self-stretch items-start gap-2.5 py-2.5">
            <span className="h-4 w-[0.75px] bg-line-primary-assistive" />
          </div>

          <ol className="flex min-w-0 flex-1 flex-nowrap content-center items-center gap-2">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isCurrent = stepNumber === currentStep;

              return (
                <li
                  key={`${stepNumber}-${step.label}`}
                  className="flex shrink-0 items-center gap-2 rounded-marker p-2"
                >
                  <span
                    className={clsx(
                      "flex aspect-square h-5 w-5 items-center justify-center gap-2.5 rounded-icon-round text-cap12-med [font-feature-settings:'liga'_off,'clig'_off]",
                      "tracking-normal",
                      isCurrent
                        ? "bg-fill-quaternary-default text-text-neutral-description shadow-cta-primary"
                        : "bg-fill-disabled text-text-neutral-disabled",
                    )}
                  >
                    {stepNumber}
                  </span>
                  <span
                    className={clsx(
                      "flex items-center justify-center gap-2.5 text-cap12-med [font-feature-settings:'liga'_off,'clig'_off]",
                      "tracking-normal",
                      isCurrent
                        ? "text-text-neutral-description"
                        : "text-text-neutral-disabled",
                    )}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-4">
          <HeaderAction
            {...leftAction}
            className={clsx("tracking-normal", leftAction.className)}
          />
          <HeaderAction
            {...rightAction}
            className={clsx("tracking-normal", rightAction.className)}
          />
        </div>
      </div>
    </header>
  );
}
