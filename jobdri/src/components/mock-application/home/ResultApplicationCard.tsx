"use client";

import { ChipMain } from "@/components/common/chips";
import { ApplicationKebabButton } from "./ApplicationKebabButton";
import {
  CreatedAt,
  handleApplicationCardKeyDown,
} from "./ApplicationCardShared";
import type { ApplicationCardData } from "./types";

function ScoreText({ score }: Pick<ApplicationCardData, "score">) {
  const displayScore = typeof score === "number" ? score : 45;

  return (
    <div className="flex items-start gap-0.5">
      <span className="text-h24-med text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
        {displayScore}
      </span>
      <span className="text-h24-med text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
        점
      </span>
    </div>
  );
}

function ImprovementChip() {
  return (
    <ChipMain
      label="보완 필요"
      color="secondary"
      selected
      className="cursor-default rounded-chip-s bg-blue-200 px-1.5 py-1 text-cap12-semibold text-text-primary-strong hover:shadow-none"
    />
  );
}

export function ResultApplicationCard({
  company,
  hasCompanyName,
  position,
  createdAt,
  score,
  companyVariant,
  onDeleteClick,
  onRetryClick,
  onResumeClick,
}: ApplicationCardData & {
  companyVariant?: "default" | "none";
  onDeleteClick: () => void;
  onRetryClick?: () => void;
  onResumeClick?: () => void;
}) {
  const showCompany =
    companyVariant !== "none" &&
    (hasCompanyName ?? (company.trim().length > 0 && company !== "회사명 미입력"));
  const menuLabelTarget = showCompany ? company : position;

  return (
    <article
      role="button"
      tabIndex={0}
      className={`relative flex w-[345.333px] flex-none cursor-pointer flex-col items-start justify-center rounded-card border-4 border-transparent bg-bg-contents-default px-6 py-5 hover:border-icon-neutral-white hover:bg-[linear-gradient(0deg,#EFF0FF_0%,var(--color-bg-contents-default)_60%)] active:border-icon-neutral-white active:bg-[linear-gradient(0deg,#E3E5FF_0%,var(--color-fill-quaternary-assistive)_60%)] ${
        showCompany ? "gap-10" : "gap-[72px]"
      }`}
      onClick={onResumeClick}
      onKeyDown={(event) =>
        handleApplicationCardKeyDown(event, onResumeClick)
      }
    >
      <div className="flex items-start gap-3 self-stretch">
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-3">
          <CreatedAt createdAt={createdAt} />
          <div className="flex min-w-0 flex-col items-start justify-center gap-1 self-stretch">
            <span className="max-w-full truncate text-b16-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
              {position}
            </span>
            {showCompany && (
              <div className="flex min-w-0 items-center">
                <span className="max-w-full truncate text-t20-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                  {company}
                </span>
              </div>
            )}
          </div>
        </div>
        <ApplicationKebabButton
          label={`${menuLabelTarget} 모의 서류 결과 메뉴`}
          onDeleteClick={onDeleteClick}
          onRetryClick={onRetryClick}
        />
      </div>

      <div className="flex items-center justify-between self-stretch">
        <ScoreText score={score} />
        <ImprovementChip />
      </div>
    </article>
  );
}
