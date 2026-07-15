"use client";

import { ApplicationKebabButton } from "./ApplicationKebabButton";
import {
  CreatedAt,
  handleApplicationCardKeyDown,
} from "./ApplicationCardShared";
import type { ApplicationCardData } from "./types";
import Avatar from "./Avatar";
import Icon from "@/components/common/icons/Icon";

function ScoreText({ score }: Pick<ApplicationCardData, "score">) {
  const displayScore = typeof score === "number" ? score : 0;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-start gap-0.5">
        <span className="text-h24-med text-text-neutral-title ">
          {displayScore}
        </span>
        <span className="text-h24-med text-text-neutral-title ">점</span>
      </div>
      <Icon type="CHEVRON_R" className="h-5 w-5 fill-icon-neutral-default" />
    </div>
  );
}

export function ResultApplicationCard({
  company,
  position,
  createdAt,
  score,
  version = 1,
  onDeleteClick,
  onRetryClick,
  onResumeClick,
}: ApplicationCardData & {
  companyVariant?: "default" | "none";
  onDeleteClick: () => void;
  onRetryClick?: () => void;
  onResumeClick?: () => void;
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      className="relative flex w-[293px] p-5 flex-col cursor-pointer items-start justify-between rounded-card bg-fill-quaternary-default min-h-[160px]  hover:shadow-card active:bg-fill-quaternary-default-hover"
      onClick={onResumeClick}
      onKeyDown={(event) => handleApplicationCardKeyDown(event, onResumeClick)}
    >
      <div className="flex flex-col self-stretch w-full">
        <div className="flex items-center justify-between self-stretch mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <>
              <Avatar name={company} type="company" size="small" />
              <span className="max-w-full truncate text-b16-semibold text-text-neutral-title ">
                {company}
              </span>
            </>
          </div>
          <ApplicationKebabButton
            label={`모의 서류 결과 메뉴`}
            onDeleteClick={onDeleteClick}
            onRetryClick={onRetryClick}
          />
        </div>

        {/* 2. 중단: 직무 이름 */}
        <div className="flex min-w-0 flex-row items-start self-stretch gap-0.5">
          <span className="max-w-full truncate text-sub14-med text-text-neutral-description ">
            {position}
          </span>
          <span className="text-text-neutral-caption text-sub14-med">
            v.{version}
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between self-stretch mt-6">
        <p className=" text-cap12-med  text-text-neutral-caption">
          {createdAt}
        </p>
        <div className="flex flex-row justify-center items-end gap-0.5">
          <p className="text-h24-bold"> {score}</p>
          <p className="text-label14-semibold">점</p>
          <Icon type="CHEVRON_R" className="text-icon-neutral-default" />
        </div>
      </div>
    </article>
  );
}
