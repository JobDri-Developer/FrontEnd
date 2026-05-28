"use client";

import { ApplicationKebabButton } from "./ApplicationKebabButton";
import {
  CreatedAt,
  handleApplicationCardKeyDown,
} from "./ApplicationCardShared";
import { ApplicationProgressSteps } from "./ApplicationProgressSteps";
import type { ApplicationCardData } from "./types";

export function PausedApplicationCard({
  company,
  position,
  createdAt,
  status,
  onDeleteClick,
  onRetryClick,
  onResumeClick,
}: ApplicationCardData & {
  onDeleteClick: () => void;
  onRetryClick?: () => void;
  onResumeClick?: () => void;
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      className="relative flex cursor-pointer flex-col items-end self-stretch rounded-card bg-bg-contents-default px-7 py-6"
      onClick={onResumeClick}
      onKeyDown={(event) =>
        handleApplicationCardKeyDown(event, onResumeClick)
      }
    >
      <div className="flex flex-col items-start gap-7 self-stretch">
        <div className="flex items-start justify-between self-stretch">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
            <div className="flex min-w-0 flex-col items-start gap-0.5">
              <span className="max-w-full truncate text-t20-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                {company}
              </span>
              <span className="max-w-full truncate text-[20px] font-normal leading-[160%] tracking-[-0.4px] text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
                {position}
              </span>
            </div>
          </div>
          <ApplicationKebabButton
            label={`${company} 모의 지원 메뉴`}
            onDeleteClick={onDeleteClick}
            onRetryClick={onRetryClick}
          />
        </div>

        <div className="flex items-center justify-between gap-4 self-stretch">
          <CreatedAt createdAt={createdAt} />
          <ApplicationProgressSteps status={status} />
        </div>
      </div>
    </article>
  );
}
