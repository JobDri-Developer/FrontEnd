"use client";

import type { ButtonHTMLAttributes, SVGProps } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Button } from "../buttons";
import type { IconType } from "../icons/Icon";

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
  type?: "apply";
  title?: string;
  companyName?: string;
  jobTitle?: string;
  applicationLabel?: string;
  version?: number;
  lastSavedAt?: string;
  lastSavedLabel?: string;
  homeAction?: HeaderActionProps;
  leftAction?: HeaderActionProps;
  rightAction?: HeaderActionProps;
  currentStep?: number;
  progressStep?: number;
  steps?: ProgressStep[];
  className?: string;
}

const defaultSteps: ProgressStep[] = [
  { label: "JD 확인" },
  { label: "자소서 입력" },
  { label: "첨삭 결과" },
];

const MOCK_APPLICATION_HOME_PATH = "/mockApply";

function HeaderLogo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 91 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M61.2981 0H90.509L59.3646 25.3409C55.4372 28.5364 50.5286 30.2811 45.4654 30.2811H24.082L61.2981 0Z"
        fill="url(#header-logo-primary)"
      />
      <path
        d="M0 14.6568L25.3056 14.6567C33.7964 22.6384 39.708 30.2812 46.1623 30.2812L24.5489 30.2812C18.6243 30.2812 12.9495 27.894 8.80643 23.6589L0 14.6568Z"
        fill="url(#header-logo-assistive)"
      />
      <defs>
        <linearGradient
          id="header-logo-primary"
          x1="73.3357"
          y1="-0.288452"
          x2="37.3305"
          y2="30.282"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.50304" stopColor="#6C6AFF" />
          <stop offset="1" stopColor="#5451FF" />
        </linearGradient>
        <linearGradient
          id="header-logo-assistive"
          x1="10.8371"
          y1="14.6567"
          x2="26.1223"
          y2="30.2816"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DCDCFF" />
          <stop offset="1" stopColor="#BCBBFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function clampStep(step: number, stepCount: number) {
  return Math.min(Math.max(step, 1), stepCount);
}

function resolveProgressStep({
  currentStep,
  progressStep,
  stepCount,
}: {
  currentStep: number;
  progressStep?: number;
  stepCount: number;
}) {
  if (progressStep !== undefined) {
    return clampStep(progressStep, stepCount);
  }

  if (stepCount === 3) {
    if (currentStep >= 6) {
      return 3;
    }

    if (currentStep >= 4) {
      return 2;
    }

    return 1;
  }

  return clampStep(currentStep, stepCount);
}

function resolveApplicationLabel({
  applicationLabel,
  version,
}: {
  applicationLabel?: string;
  version?: number;
}) {
  if (applicationLabel) {
    return applicationLabel;
  }

  if (version !== undefined) {
    return `v.${version}`;
  }

  return "첫 번째 지원";
}

export default function Header({
  type,
  title,
  companyName = "토스",
  jobTitle = "프로덕트 디자이너",
  applicationLabel,
  version,
  lastSavedAt = "17:00",
  lastSavedLabel = "마지막 저장",
  homeAction = { label: "홈으로" },
  currentStep = 1,
  progressStep,
  steps = defaultSteps,
  className,
}: HeaderProps) {
  const router = useRouter();
  const isApplyHeader = type === "apply";
  const displayedJobTitle = title ?? jobTitle;
  const displayedApplyTitle = title ?? "새 모의서류 지원";
  const displayedApplicationLabel = resolveApplicationLabel({
    applicationLabel,
    version,
  });
  const activeStep = resolveProgressStep({
    currentStep,
    progressStep,
    stepCount: steps.length,
  });
  const { onClick: homeActionOnClick, className: homeActionClassName } =
    homeAction;

  const handleHomeActionClick: ButtonHTMLAttributes<HTMLButtonElement>["onClick"] =
    (event) => {
      homeActionOnClick?.(event);

      if (!event.defaultPrevented) {
        router.push(MOCK_APPLICATION_HOME_PATH);
      }
    };

  const homeActionButton = (
    <Button
      {...homeAction}
      label={homeAction.label}
      styleType="tertiary"
      size="small"
      onClick={handleHomeActionClick}
      className={clsx(
        "!h-9 !w-[76px] !px-2 !py-1.5 tracking-normal",
        homeActionClassName,
      )}
    />
  );

  if (isApplyHeader) {
    return (
      <header
        className={clsx(
          "flex min-w-[1100px] items-center justify-between bg-fill-quaternary-default px-6 py-3",
          className,
        )}
      >
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex flex-col items-start gap-2.5 py-[5px]">
            <span className="flex h-[30px] w-[45px] items-center justify-center overflow-hidden pt-[11.154px] pr-[6.634px] pb-[8.75px] pl-[8.174px]">
              <HeaderLogo
                aria-hidden="true"
                focusable="false"
                className="block h-[10.096px] w-[30.192px] shrink-0"
              />
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <span className="min-w-0 truncate text-label14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
              {displayedApplyTitle}
            </span>
            <span className="shrink-0 text-label14-semibold text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
              {displayedApplicationLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end">{homeActionButton}</div>
      </header>
    );
  }

  return (
    <header
      className={clsx(
        "flex w-full min-w-[1100px] items-center justify-between bg-fill-quaternary-default px-6 py-3",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex flex-col items-start gap-2.5 py-[5px]">
          <span className="flex h-[30px] w-[45px] items-center justify-center overflow-hidden pt-[11.154px] pr-[6.634px] pb-[8.75px] pl-[8.174px]">
            <HeaderLogo
              aria-hidden="true"
              focusable="false"
              className="block h-[10.096px] w-[30.192px] shrink-0"
            />
          </span>
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-10 max-w-[160px] items-center gap-1 px-2 py-2">
            <div className="flex min-w-0 items-center gap-1">
              <span className="max-h-[21px] shrink-0 text-label14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
                {companyName}
              </span>
              <span className="max-h-[21px] shrink-0 text-label14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
                |
              </span>
              <span className="max-h-[21px] min-w-0 truncate text-label14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
                {displayedJobTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 self-stretch p-2">
            <span className="text-center text-label14-semibold text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
              {displayedApplicationLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center gap-2 px-10">
        <ol className="flex items-center gap-2">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === activeStep;

            return (
              <li
                key={`${stepNumber}-${step.label}`}
                className="flex items-center gap-2 rounded-[8px] bg-fill-quaternary-assistive p-2"
              >
                <span
                  className={clsx(
                    "flex aspect-square h-5 w-5 items-center justify-center gap-2.5 rounded-full text-cap12-med [font-feature-settings:'liga'_off,'clig'_off]",
                    isActive
                      ? "bg-fill-tertiary-default text-text-neutral-white"
                      : "bg-icon-neutral-weak text-text-neutral-disabled",
                  )}
                >
                  {stepNumber}
                </span>

                <span
                  className={clsx(
                    "flex items-center justify-center gap-2.5 text-cap12-med [font-feature-settings:'liga'_off,'clig'_off]",
                    isActive
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

      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="flex h-6 items-center justify-center gap-2.5">
          <span className="text-[14px] font-semibold leading-[140%] tracking-[-0.28px] text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
            {lastSavedLabel}
          </span>
          <time className="text-[14px] font-semibold leading-[140%] tracking-[-0.28px] text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
            {lastSavedAt}
          </time>
        </div>

        {homeActionButton}
      </div>
    </header>
  );
}
