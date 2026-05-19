"use client";

import { useRef } from "react";
import clsx from "clsx";
import Icon, { type IconType } from "@/components/common/icons/Icon";
import { InputSingleLine } from "@/components/common/input";
import LoadMotionModal from "@/components/common/LoadMotionModal";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { Button, ButtonCtaModal } from "../buttons";

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
  error?: string;
}

function WarningIconLarge() {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center text-fill-system-fail-strong">
      <svg
        width="40"
        height="33.333"
        viewBox="0 0 40 33.333"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-[33.333px] w-10 shrink-0"
      >
        <path
          d="M15.7125 3.81278C17.6545 0.57608 22.3455 0.57608 24.2875 3.81278L35.4565 22.4278C37.4561 25.7605 35.0561 30.0003 31.169 30.0003H8.831C4.94388 30.0003 2.54392 25.7605 4.54348 22.4278L15.7125 3.81278Z"
          fill="currentColor"
        />
        <path
          d="M18.3335 10.833C18.3335 9.91256 19.0797 9.1665 20.0002 9.1665C20.9207 9.1665 21.6668 9.91256 21.6668 10.833V18.333C21.6668 19.2535 20.9207 19.9995 20.0002 19.9995C19.0797 19.9995 18.3335 19.2535 18.3335 18.333V10.833Z"
          fill="white"
        />
        <path
          d="M18.3335 22.4995C18.3335 21.579 19.0797 20.833 20.0002 20.833C20.9207 20.833 21.6668 21.579 21.6668 22.4995C21.6668 23.42 20.9207 24.166 20.0002 24.166C19.0797 24.166 18.3335 23.42 18.3335 22.4995Z"
          fill="white"
        />
      </svg>
    </span>
  );
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
  submitDisabled = false,
  statusIconType,
  methodActions,
  error,
}: ModalInputProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const isAlertModal =
    type === "actionModal_alert" || variant === "alert" || variant === "alort";
  const resolvedTitle = title ?? announce ?? "공고 링크를 입력해주세요.";
  const resolvedDescription =
    description ?? "링크 내용이 부적절한 경우 제대로 추출되지 않을 수 있습니다.";
  const resolvedSubmitLabel =
    submitLabel ?? (isAlertModal ? "다시 입력하기" : "입력하기");

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
          isAlertModal && "pt-12",
          className,
        )}
      >
        {!isAlertModal && (
          <div className="flex self-stretch justify-end px-7 pt-6">
            <button
              type="button"
              aria-label="닫기"
              onClick={onClose}
              className="text-icon-neutral-assistive transition-colors hover:text-icon-neutral-default"
            >
              <Icon type="CLOSE_M" className="h-5 w-5" />
            </button>
          </div>
        )}

        <div
          className={clsx(
            "flex flex-col items-center gap-5 self-stretch px-8 pb-6",
            isAlertModal ? "pt-0" : "pt-3",
          )}
        >
          {statusIconType ? (
            statusIconType === "WARN" ? (
              <WarningIconLarge />
            ) : (
              <Icon
                type={statusIconType}
                className="h-10 w-10 shrink-0 text-text-system-fail"
              />
            )
          ) : (
            showLoadMotion && <LoadMotionModal />
          )}

          <div className="flex flex-col items-center gap-2 self-stretch text-center">
            <span
              className="self-stretch text-t20-semibold tracking-normal text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]"
            >
              {resolvedTitle}
            </span>
            {showDescription && (
              <span
                className="self-stretch text-sub14-med tracking-normal text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]"
              >
                {resolvedDescription}
              </span>
            )}
          </div>

          {showInputField && (
            <InputSingleLine
              autoFocus={!isAlertModal}
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

          {methodActions ? (
            <div className="flex flex-col items-start gap-2.5 self-stretch">
              {methodActions.map((action) => (
                <Button
                  key={action.label}
                  label={action.label}
                  iconType={action.iconType}
                  size="large"
                  styleType="quaternary"
                  onClick={action.onClick}
                  className="h-[46px] w-full"
                />
              ))}
            </div>
          ) : !isAlertModal ? (
            <Button
              label={resolvedSubmitLabel}
              size="large"
              styleType="secondary"
              onClick={onSubmit}
              disabled={submitDisabled}
              className="h-[46px] w-full"
            />
          ) : (
            <ButtonCtaModal
              stack="stack2_horizontal"
              label={resolvedSubmitLabel}
              cancelLabel="취소하기"
              onSubmit={onSubmit}
              onCancel={onCancel}
              submitStyleType="quaternary"
              cancelStyleType="quaternary"
              submitClassName="!text-text-neutral-description"
              cancelClassName="!text-text-system-fail"
              className="w-full !pb-0"
            />
          )}
        </div>
      </div>
    </div>
  );
}
