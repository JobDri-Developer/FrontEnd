import clsx from "clsx";
import { IconOnlyButton } from "@/components/common/buttons";
import ToastStatusIcon from "./ToastStatusIcon";

export type ToastVariant = "normal" | "check" | "warning" | "dark";

interface ToastProps {
  message?: string;
  variant?: ToastVariant;
  onClose?: () => void;
  className?: string;
  position?: "top" | "bottom";
}

export default function Toast({
  message = "토스트 기본 더미텍스트.",
  variant = "normal",
  onClose,
  className,
  position = "bottom",
}: ToastProps) {
  const isDark = variant === "dark";
  const hasStatusIcon = variant === "check" || variant === "warning";
  const isTop = position === "top";

  return (
    <div
      role="status"
      className={clsx(
        "flex  items-center justify-between shadow-default fixed transition-discrete",

        isTop
          ? "top-10 left-1/2 -translate-x-1/2 rounded-card px-4 py-3 gap-3 w-fit"
          : "bottom-28 right-5 rounded-card px-4 py-3 pl-5 self-stretch max-w-[400px]",

        isDark ? "bg-fill-tertiary-default" : "bg-fill-quaternary-default",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-[14px]">
        {/* 아이콘 영역 */}
        {hasStatusIcon && (
          <ToastStatusIcon
            variant={variant}
            position={isTop ? "top" : "bottom"}
          />
        )}

        {/* 텍스트 영역 */}
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

      {/* 3. Bottom 일 때만 우측 닫기(X) 버튼을 보여줍니다 */}
      {!isTop && (
        <IconOnlyButton
          aria-label="토스트 닫기"
          tone={isDark ? "dark" : "light"}
          className="shrink-0 ml-3"
          onClick={onClose}
        />
      )}
    </div>
  );
}
