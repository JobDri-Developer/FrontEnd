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
  showStatusIcon?: boolean;
}

export default function Toast({
  message = "토스트 기본 더미텍스트.",
  variant = "normal",
  onClose,
  className,
  position = "bottom",
  showStatusIcon = true,
}: ToastProps) {
  const isDark = variant === "dark";
  const hasStatusIcon =
    showStatusIcon && (variant === "check" || variant === "warning");
  const isTop = position === "top";

  return (
    <div
      role="status"
      className={clsx(
        "fixed z-50 flex items-center shadow-card transition-discrete",

        isTop
          ? "top-10 left-1/2 w-fit -translate-x-1/2 justify-center gap-3 rounded-card bg-fill-quaternary-default py-3 pr-4 pl-3"
          : "right-5 bottom-28 max-w-[400px] justify-between self-stretch rounded-card px-4 py-3 pl-5",

        isDark ? "bg-fill-tertiary-default" : "bg-fill-quaternary-default",
        className,
      )}
    >
      <div className={clsx("flex min-w-0 items-center", isTop ? "gap-3" : "gap-[14px]")}>
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
            "truncate [font-feature-settings:'liga'_off,'clig'_off]",
            isTop ? "text-label14-semibold" : "text-cap12-semibold",
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
