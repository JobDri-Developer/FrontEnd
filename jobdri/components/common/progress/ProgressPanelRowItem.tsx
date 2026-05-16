import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";
import LoadMotion from "@/components/common/LoadMotion";

export type ProgressPanelRowItemStatus = "inProgress" | "complete" | "idle";

interface ProgressPanelRowItemProps {
  status?: ProgressPanelRowItemStatus;
  title?: string;
  description?: string;
  stepNumber?: number;
  showConnector?: boolean;
  className?: string;
}

export default function ProgressPanelRowItem({
  status = "inProgress",
  title = "기본 정보 입력",
  description = "서브 텍스트 서브 텍스트서브 텍스트",
  stepNumber = 1,
  showConnector = true,
  className,
}: ProgressPanelRowItemProps) {
  const isInProgress = status === "inProgress";
  const isComplete = status === "complete";
  const isIdle = status === "idle";

  return (
    <div
      className={clsx(
        "relative flex w-[132px] flex-col items-center gap-2 self-stretch rounded-card-result p-2",
        className,
      )}
    >
      {isInProgress && (
        <div className="absolute top-[-12px] left-[-12px] h-[133px] w-[152px] rounded-card-s bg-fill-quaternary-default" />
      )}

      {showConnector && (
        <span className="absolute top-[18px] right-[-63px] h-px w-[100px] bg-fill-disabled" />
      )}

      <div
        className={clsx(
          "relative z-10 flex items-center justify-center",
          isInProgress
            ? "h-5 w-10 gap-2.5 rounded-icon-round bg-fill-tertiary-default"
            : "h-5 w-5",
        )}
      >
        {isInProgress ? (
          <LoadMotion
            className="items-center gap-1 py-1"
            dotClassName="h-1 w-1"
            activeDotClassName="bg-icon-neutral-white"
            inactiveDotClassName="bg-icon-neutral-white"
            activeMotionClassName="-translate-y-0.5"
          />
        ) : isComplete ? (
          <span className="flex aspect-square h-5 w-5 items-center justify-center gap-2.5 rounded-icon-round bg-fill-secondary-default">
            <Icon
              type="CHECK_M"
              className="h-5 w-5 shrink-0 text-icon-neutral-white"
            />
          </span>
        ) : (
          <span className="flex aspect-square h-5 w-5 items-center justify-center gap-2.5 rounded-icon-round bg-fill-disabled text-[12px] leading-normal font-medium tracking-normal text-text-neutral-disabled">
            {stepNumber}
          </span>
        )}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2.5">
        <span
          className={clsx(
            "text-center text-label14-semibold tracking-normal [font-feature-settings:'liga'_off,'clig'_off]",
            isInProgress && "text-text-neutral-title",
            isComplete && "text-text-neutral-caption",
            isIdle && "text-text-neutral-description",
          )}
        >
          {title}
        </span>
        <span
          className={clsx(
            "w-[132px] max-w-[132px] text-center text-cap12-med tracking-normal [font-feature-settings:'liga'_off,'clig'_off]",
            isInProgress && "text-text-neutral-description",
            isComplete && "text-text-neutral-caption",
            isIdle && "text-text-neutral-description",
          )}
        >
          {description}
        </span>
      </div>
    </div>
  );
}
