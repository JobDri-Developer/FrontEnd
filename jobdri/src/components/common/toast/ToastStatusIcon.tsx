import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";

export type ToastStatusIconVariant = "check" | "warning";

interface ToastStatusIconProps {
  variant: ToastStatusIconVariant;
  position?: "top" | "bottom";
}

const statusIconStyles: Record<ToastStatusIconVariant, string> = {
  check: "bg-fill-secondary-assistive text-text-system-complete",
  warning: "bg-fill-system-fail-hover text-text-system-fail",
};

export default function ToastStatusIcon({
  variant,
  position = "top",
}: ToastStatusIconProps) {
  const isTop = position === "top";
  return (
    <span
      className={clsx(
        "flex shrink-0 items-center justify-center",
        isTop ? "h-6 w-6" : "h-8 w-8 rounded-[10px]",
        isTop ? "" : statusIconStyles[variant],
      )}
      aria-hidden="true"
    >
      {variant === "check" ? (
        <div
          className={clsx(
            "h-5 w-5 ",
            isTop ? "bg-fill-secondary-default rounded-full" : "",
          )}
        >
          <Icon
            type={isTop ? "CHECK" : "CHECK_R"}
            className={clsx(
              isTop ? "w-8 h-8" : "w-8 h-8 shrink-0",
              " shrink-0 text-text-neutral-white ",
            )}
          />
        </div>
      ) : (
        <Icon
          type="WARN_24"
          className="h-6 w-6 shrink-0 text-text-system-fail"
        />
      )}
    </span>
  );
}
