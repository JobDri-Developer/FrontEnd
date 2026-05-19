"use client";

import { useRef } from "react";
import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";
import { InputSingleLine } from "@/components/common/input";
import LoadMotion from "@/components/common/LoadMotion";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { Button, ButtonCtaModal } from "../buttons";

type ModalVariant = "action" | "alort";
type ModalType = "actionModal";

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
  error?: string;
}

export default function ModaInput({
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
  error,
}: ModalInputProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const resolvedTitle = title ?? announce ?? "공고 링크를 입력해주세요.";
  const resolvedDescription =
    description ?? "링크 내용이 부적절한 경우 제대로 추출되지 않을 수 있습니다.";
  const resolvedSubmitLabel =
    submitLabel ?? (variant === "action" ? "입력하기" : "다시 입력하기");

  useOutsideClick(modalRef, onClose, Boolean(onClose));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={resolvedTitle}
        data-type={type}
        className={clsx(
          "flex w-[480px] shrink-0 flex-col items-center justify-center gap-0 overflow-hidden rounded-card bg-bg-contents-default shadow-modal",
          className,
        )}
      >
        <div className="flex self-stretch justify-end px-7 pt-6">
          {variant === "action" ? (
            <button
              type="button"
              aria-label="닫기"
              onClick={onClose}
              className="text-icon-neutral-assistive transition-colors hover:text-icon-neutral-default"
            >
              <Icon type="CLOSE_M" className="h-5 w-5" />
            </button>
          ) : (
            <div className="h-5 w-5" />
          )}
        </div>

        <div className="flex flex-col items-center gap-5 self-stretch px-8 pt-3 pb-6">
          {showLoadMotion && <LoadMotion />}

          <div className="flex flex-col items-center gap-2 self-stretch text-center">
            <span className="self-stretch text-b16-semibold tracking-normal text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
              {resolvedTitle}
            </span>
            {showDescription && (
              <span className="self-stretch text-cap12-med tracking-normal text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
                {resolvedDescription}
              </span>
            )}
          </div>

          {showInputField && (
            <InputSingleLine
              autoFocus
              type="url"
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              error={error}
              className="!w-full"
              wrapperClassName="bg-bg-contents-default"
              inputClassName="tracking-normal"
              focusedBorder="border-line-primary-default"
              paddingClass="px-3 py-2"
              radiusClass="rounded-cta-s"
            />
          )}

          {variant === "action" ? (
            <Button
              label={resolvedSubmitLabel}
              size="large"
              styleType="secondary"
              onClick={onSubmit}
              className="h-[46px] w-full"
            />
          ) : (
            <ButtonCtaModal
              stack="stack2_horizontal"
              label={resolvedSubmitLabel}
              cancelLabel="취소하기"
              onSubmit={onSubmit}
              onCancel={onCancel}
              className="w-full !pb-0"
            />
          )}
        </div>
      </div>
    </div>
  );
}
