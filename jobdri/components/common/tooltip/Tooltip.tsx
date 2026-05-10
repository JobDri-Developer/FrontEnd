import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";

export type TooltipPlacement =
  | "right_mid"
  | "left_mid"
  | "left_up"
  | "up_mid"
  | "up_left"
  | "up_right"
  | "down_left"
  | "down_mid"
  | "down_right";

interface TooltipProps {
  placement?: TooltipPlacement;
  message?: string;
  lines?: string[];
  className?: string;
}

const arrowStyles: Record<TooltipPlacement, string> = {
  right_mid: "-right-[29px] top-1/2 -translate-y-1/2",
  left_mid: "-left-[29px] top-1/2 -translate-y-1/2",
  left_up: "-left-[29px] top-[11.5px]",
  up_mid: "right-[52px] top-[-11px]",
  up_left: "left-0 top-[-11px]",
  up_right: "right-0 top-[-11px]",
  down_left: "bottom-[-11px] left-0",
  down_mid: "bottom-[-11px] right-[52px]",
  down_right: "bottom-[-11px] right-0",
};

const arrowIconStyles: Partial<Record<TooltipPlacement, string>> = {
  left_mid: "rotate-180",
  left_up: "rotate-180",
  up_mid: "-rotate-90",
  up_left: "-rotate-90",
  up_right: "-rotate-90",
  down_left: "rotate-90",
  down_mid: "rotate-90",
  down_right: "rotate-90",
};

export function Tooltip({
  placement = "up_mid",
  message = "1회 크레딧 무료 증정",
  lines,
  className,
}: TooltipProps) {
  const contentLines = lines ?? [message];

  return (
    <div
      role="tooltip"
      className={clsx(
        "relative inline-flex max-w-[240px] items-center justify-center gap-0.5 rounded-[8px] bg-fill-tertiary-default px-3 py-2 text-text-neutral-white shadow-[0_0_24px_0_var(--color-bg-shadow-default)]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          "absolute flex w-12 flex-col items-center justify-center gap-2.5 text-fill-tertiary-default",
          arrowStyles[placement],
        )}
      >
        <Icon
          type="POLYGON_1"
          className={clsx(
            "h-[14px] w-[11px] shrink-0",
            arrowIconStyles[placement],
          )}
        />
      </span>

      <span className="flex min-w-0 items-center gap-0.5 text-label14-med [font-feature-settings:'liga'_off,'clig'_off]">
        <span className="flex min-w-0 flex-col gap-0.5">
          {contentLines.map((line, index) => (
            <span
              key={`${line}-${index}`}
              className="break-keep [overflow-wrap:anywhere]"
            >
              {line}
            </span>
          ))}
        </span>
        <Icon type="SPARKLE" className="h-4 w-4 shrink-0 text-icon-white" />
      </span>
    </div>
  );
}
