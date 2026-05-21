"use client";

import { useRef, type ReactNode } from "react";
import type { IconType } from "@/components/common/icons/Icon";
import clsx from "clsx";
import { Button } from "@/components/common/buttons";
import IconBox from "@/components/common/icons/IconBox";
import { InputMain } from "@/components/common/input";
import LoadMotionModal from "@/components/common/LoadMotionModal";
import useOutsideClick from "@/hooks/useOutsideClick";

type ModalVariant = "action" | "alert" | "alort";
type ModalType = "actionModal" | "actionModal_alert";

interface ModalMethodAction {
  label: string;
  iconType: IconType;
  onClick: () => void;
}

interface ModalInputProps {
  type?: ModalType;
  variant?: ModalVariant;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  className?: string;
  title?: string;
  announce?: string;
  description?: string;
  placeholder?: string;
  submitLabel?: string;
  showInputField?: boolean;
  showDescription?: boolean;
  showLoadMotion?: boolean;
  submitDisabled?: boolean;
  statusIconType?: IconType;
  methodActions?: ModalMethodAction[];
  children?: ReactNode;
  error?: string;
  loading?: boolean;
}

function ModalWarningIcon() {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center"
      aria-hidden="true"
    >
      <span className="relative flex h-[33.333px] w-10 shrink-0 items-center justify-center">
        <svg
          width="40"
          height="33.333"
          viewBox="1.52635 2.34545 20.94725 17.65455"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
        >
          <path
            d="M9.42752 4.28747C10.5927 2.34545 13.4073 2.34545 14.5725 4.28747L21.2739 15.4565C22.4736 17.4561 21.0333 20 18.7014 20H5.29857C2.96669 20 1.52635 17.4561 2.72609 15.4565L9.42752 4.28747Z"
            fill="var(--color-fill-system-fail-strong)"
          />
        </svg>
        <svg
          width="3.333"
          height="15"
          viewBox="0 0 3.333 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-1/2 top-[10.333px] -translate-x-1/2"
        >
          <rect
            width="3.333"
            height="10"
            rx="1.6665"
            fill="var(--color-icon-neutral-white)"
          />
          <rect
            y="11.667"
            width="3.333"
            height="3.333"
            rx="1.6665"
            fill="var(--color-icon-neutral-white)"
          />
        </svg>
      </span>
    </span>
  );
}

export default function ModalInput({
  type = "actionModal",
  variant = "action",
  value,
  onChange,
  onSubmit,
  onCancel,
  onClose,
  className,
  title,
  announce,
  description,
  placeholder = "https://www.com",
  submitLabel,
  showInputField = true,
  showDescription = true,
  showLoadMotion = false,
  submitDisabled = false,
  statusIconType,
  methodActions,
  children,
  error,
  loading = false,
}: ModalInputProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const isAlertModal = variant !== "action" || type === "actionModal_alert";
  const modalTitle = title ?? announce;
  const showLoadingMotion = showLoadMotion || loading;
  const hasMethodActions = Boolean(methodActions?.length);

  useOutsideClick(modalRef, onClose);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
      <div
        ref={modalRef}
        className={clsx(
          "flex w-[480px] shrink-0 flex-col items-center justify-center gap-0 rounded-modal bg-bg-contents-default pt-12 shadow-modal",
          className,
        )}
      >
        <div className="flex flex-col items-center justify-center gap-0 self-stretch px-8">
          <div className="flex flex-col items-center justify-center gap-5 self-stretch pb-6">
            <div className="flex flex-col items-center gap-4 self-stretch">
              {showLoadingMotion && <LoadMotionModal />}
              {!showLoadingMotion && statusIconType === "WARN" && (
                <ModalWarningIcon />
              )}
              {!showLoadingMotion && statusIconType && statusIconType !== "WARN" && (
                <IconBox type={statusIconType} state="secondary" />
              )}

              <div className="flex flex-col items-center gap-2 self-stretch text-center">
                {modalTitle && (
                  <span className="text-t20-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                    {modalTitle}
                  </span>
                )}
                {showDescription && description && (
                  <span className="text-sub14-med text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
                    {description}
                  </span>
                )}
              </div>
            </div>

            {showInputField && (
              <InputMain
                value={value}
                onChange={onChange}
                error={error}
                placeholder={placeholder}
                className="self-stretch"
              />
            )}

            {children}
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 self-stretch px-8 pb-8">
          {hasMethodActions ? (
            methodActions?.map((action) => (
              <Button
                key={action.label}
                label={action.label}
                iconType={action.iconType}
                size="large"
                styleType="quaternary"
                onClick={action.onClick}
                className="h-[46px] w-full"
              />
            ))
          ) : isAlertModal ? (
            <div className="flex items-start gap-3 self-stretch">
              <Button
                label="취소하기"
                size="large"
                styleType="quaternary"
                onClick={onCancel}
                className="h-[46px] flex-1 !text-text-system-fail"
              />
              <Button
                label={submitLabel ?? "다시 입력하기"}
                size="large"
                styleType="quaternary"
                onClick={onSubmit}
                className="h-[46px] flex-1"
              />
            </div>
          ) : (
            <Button
              label={submitLabel ?? "입력하기"}
              size="large"
              styleType="secondary"
              disabled={submitDisabled}
              onClick={onSubmit}
              className="h-[46px] w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
