import clsx from "clsx";
import { IconOnlyButton } from "@/components/common/buttons";
import ToastStatusIcon from "./ToastStatusIcon";

export type ToastVariant = "normal" | "check" | "warning" | "dark";

interface ToastProps {
  message?: string;
  variant?: ToastVariant;
  onClose?: () => void;
  className?: string;
}

export default function Toast({
  message = "토스트 기본 더미텍스트.",
  variant = "normal",
  onClose,
  className,
}: ToastProps) {
  const isDark = variant === "dark";
  const hasStatusIcon = variant === "check" || variant === "warning";

  return (
    <div
      role="status"
      className={clsx(
        "flex h-14 items-center justify-between self-stretch rounded-toast-l px-4 py-3 pl-5 shadow-hover fixed bottom-28 right-5 transition-discrete",
        isDark ? "bg-fill-tertiary-default" : "bg-fill-quaternary-default",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-[14px]">
        {hasStatusIcon && <ToastStatusIcon variant={variant} />}

        <span
          className={clsx(
            "truncate text-cap12-semibold [font-feature-settings:'liga'_off,'clig'_off]",
            isDark
              ? "text-text-neutral-white"
              : "text-text-neutral-description",
          )}
        >
          {message}
        </span>
      </div>

      <IconOnlyButton
        aria-label="토스트 닫기"
        tone={isDark ? "dark" : "light"}
        className="shrink-0"
        onClick={onClose}
      />
    </div>
  );
}
