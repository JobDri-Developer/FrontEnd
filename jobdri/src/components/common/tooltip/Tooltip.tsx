import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";

export type TooltipPlacement =
  | "right_mid"
  | "left_mid"
  | "left_up"
  | "right_up"
  | "up_mid"
  | "up_left"
  | "up_right"
  | "down_left"
  | "down_mid"
  | "down_right";

interface TooltipProps {
  id?: string;
  placement?: TooltipPlacement;
  message?: string;
  lines?: string[];
  showIcon?: boolean;
  className?: string;
}

const containerFlexStyles: Record<TooltipPlacement, string> = {
  up_left: "flex-col items-start",
  up_mid: "flex-col items-center",
  up_right: "flex-col items-end",
  down_left: "flex-col-reverse items-start",
  down_mid: "flex-col-reverse items-center",
  down_right: "flex-col-reverse items-end",
  right_up: "flex-row-reverse items-start",
  left_up: "flex-row items-start",
  left_mid: "flex-row items-center",
  right_mid: "flex-row-reverse items-center",
};

const arrowSpacingStyles: Record<TooltipPlacement, string> = {
  up_left: "ml-[20px] -mb-[2px]",
  up_mid: "-mb-[2px]",
  up_right: "mr-[20px] -mb-[2px]",

  down_left: "ml-[20px] -mt-[2px]",
  down_mid: "-mt-[2px]",
  down_right: "mr-[20px] -mt-[2px]",

  left_up: "mt-[10px] -mr-[1px]",
  left_mid: "-mr-[1px]",

  right_up: "mt-[10px]",
  right_mid: "-ml-[1px]",
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
  id,
  placement = "up_mid",
  message = "1회 크레딧 무료 증정",
  lines,
  showIcon = false,
  className,
}: TooltipProps) {
  const contentLines = lines ?? [message];

  return (
    <div
      id={id}
      role="tooltip"
      className={clsx("inline-flex", containerFlexStyles[placement], className)}
    >
      <div
        aria-hidden="true"
        className={clsx(
          "flex items-center justify-center text-fill-tertiary-default z-10 relative",
          arrowSpacingStyles[placement],
        )}
      >
        <Icon
          type="POLYGON_1"
          className={clsx(
            "h-[14px] w-[11px] shrink-0",
            arrowIconStyles[placement],
          )}
        />
      </div>

      <div className="flex w-full items-center justify-center gap-0.5 rounded-[8px] bg-fill-tertiary-default px-3 py-2 text-text-neutral-white shadow-card relative z-0">
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
          {showIcon && (
            <Icon type="SPARKLE" className="h-4 w-4 shrink-0 text-icon-white" />
          )}
        </span>
      </div>
    </div>
  );
}
