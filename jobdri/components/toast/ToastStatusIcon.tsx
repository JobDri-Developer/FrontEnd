import clsx from "clsx";
import Icon from "@/components/icons/Icon";

export type ToastStatusIconVariant = "check" | "warning";

interface ToastStatusIconProps {
  variant: ToastStatusIconVariant;
}

const statusIconStyles: Record<ToastStatusIconVariant, string> = {
  check: "bg-fill-secondary-assistive text-text-complete",
  warning: "bg-fill-fail-hover text-text-fail",
};

function CheckIcon() {
  return (
    <span className="flex aspect-square h-5 w-5 shrink-0 items-center justify-center p-[1.666px]">
      <span className="flex aspect-square h-[16.667px] w-[16.667px] shrink-0 items-center justify-center rounded-full bg-fill-secondary-default text-icon-neutral-white">
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="shrink-0"
        >
          <path
            d="M3.75 7.5L6.25 10L11.25 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </span>
  );
}

export default function ToastStatusIcon({ variant }: ToastStatusIconProps) {
  return (
    <span
      className={clsx(
        "flex aspect-square h-8 w-8 shrink-0 items-center justify-center gap-2.5 rounded-[10px] p-2.5",
        statusIconStyles[variant],
      )}
      aria-hidden="true"
    >
      {variant === "check" ? (
        <CheckIcon />
      ) : (
        <Icon type="WARN" className="h-6 w-6 shrink-0" />
      )}
    </span>
  );
}
