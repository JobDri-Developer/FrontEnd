import Icon from "@/components/common/icons/Icon";
import {
  completedStepCountByStatus,
  PROGRESS_STEPS,
} from "./homeSteps";
import type { ApplicationCardData } from "./types";

function getCompletedStepCount(status?: string) {
  return status ? (completedStepCountByStatus[status] ?? 3) : 3;
}

function CompleteStepIcon() {
  return (
    <span
      className="flex h-6 w-6 shrink-0 items-center justify-center p-0.5"
      aria-hidden="true"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-fill-secondary-default text-icon-neutral-white">
        <Icon type="CHECK_COMPLETE" className="h-[18px] w-[18px]" />
      </span>
    </span>
  );
}

function PendingStepIcon({ stepNumber }: { stepNumber: number }) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fill-disabled text-cap12-med text-text-neutral-disabled [font-feature-settings:'liga'_off,'clig'_off]">
      {stepNumber}
    </span>
  );
}

export function ApplicationProgressSteps({
  status,
}: Pick<ApplicationCardData, "status">) {
  const completedStepCount = getCompletedStepCount(status);

  return (
    <ol className="flex w-[578px] shrink-0 flex-nowrap items-center justify-between overflow-visible">
      {PROGRESS_STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber <= completedStepCount;

        return (
          <li
            key={label}
            className="flex shrink-0 items-center gap-2 rounded-marker p-2"
          >
            {isComplete ? (
              <CompleteStepIcon />
            ) : (
              <PendingStepIcon stepNumber={stepNumber} />
            )}
            <span
              className={`whitespace-nowrap text-cap12-med [font-feature-settings:'liga'_off,'clig'_off] ${
                isComplete
                  ? "text-text-neutral-description"
                  : "text-text-neutral-disabled"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
