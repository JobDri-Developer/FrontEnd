"use client";

import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";
import { InputMain, InputModalQuestion } from "@/components/common/input";
import LoadMotion from "@/components/common/LoadMotion";
import ButtonCta from "@/components/common/buttons/ButtonCta";
import { ButtonCtaModal } from "../buttons";

type ModalVariant = "action" | "alort";

interface ModalInputProps {
  variant?: ModalVariant;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  className?: string;
  announce?: string;
  description?: string;
  error?: string;
  placeholder?: string;
  loading?: boolean;
}

export default function ModaInput({
  variant = "action",
  value,
  onChange,
  onSubmit,
  onCancel,
  onClose,
  className,
  announce,
  description,
  error,
  placeholder,
  loading = true,
}: ModalInputProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-bg-lightbox-default z-50">
      <div
        className={clsx(
          "flex flex-col bg-fill-quaternary-default rounded-card w-120 overflow-hidden",
          className,
        )}
      >
        {/* 헤더: X 버튼 */}
        <div className="flex justify-end px-7 pt-6">
          {variant === "action" ? (
            <button
              type="button"
              onClick={onClose}
              className="text-icon-neutral-assistive hover:text-icon-neutral-default transition-colors"
            >
              <Icon type="CLOSE_M" className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-5 h-5" />
          )}
        </div>

        {/* 바디 */}
        <div className="flex flex-col items-center gap-5 px-8 pb-6 pt-3">
          {loading && <LoadMotion />}
          {/* 텍스트 */}
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-t20-semibold text-text-neutral-title">
              {announce}
            </span>
            <span className="text-sub14-med text-text-neutral-caption">
              {description}
            </span>
          </div>

          {/* 인풋 */}
          <InputMain value={value} onChange={onChange} error={error} />

          {/* 버튼 */}
          {variant === "action" ? (
            <ButtonCta
              label="입력하기"
              onClick={onSubmit}
              className="w-full px-0 pb-0 pt-0"
              variant={value ? "empty_dark" : "gradient_white"}
            />
          ) : (
            <ButtonCtaModal
              stack="stack2_horizontal"
              label="다시 입력하기"
              cancelLabel="취소하기"
              onSubmit={onSubmit}
              onCancel={onCancel}
              className="w-full !px-0 !pb-0"
            />
          )}
        </div>
      </div>
    </div>
  );
}
