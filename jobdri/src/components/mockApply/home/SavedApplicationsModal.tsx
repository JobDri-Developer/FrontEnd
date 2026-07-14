"use client";

import { useEffect } from "react";
import { scrollbarClass } from "@/components/common/input/inputStyles";
import Icon from "@/components/common/icons/Icon";
import { ApplicationKebabButton } from "./ApplicationKebabButton";
import {
  CreatedAt,
  handleApplicationCardKeyDown,
} from "./ApplicationCardShared";
import type { ApplicationCardData } from "./types";

function SavedApplicationModalCard({
  application,
  onDeleteClick,
  onResumeClick,
}: {
  application: ApplicationCardData;
  onDeleteClick: () => void;
  onResumeClick: () => void;
}) {
  const showCompany =
    application.hasCompanyName ??
    (application.company.trim().length > 0 &&
      application.company !== "회사명 미입력");

  return (
    <article
      role="button"
      tabIndex={0}
      className="flex cursor-pointer flex-col items-end self-stretch rounded-card bg-bg-contents-assistive px-7 py-6"
      onClick={onResumeClick}
      onKeyDown={(event) =>
        handleApplicationCardKeyDown(event, onResumeClick)
      }
    >
      <div className="flex flex-col items-start gap-3 self-stretch">
        <div className="flex items-start gap-5 self-stretch">
          <div className="flex min-w-0 flex-1 items-start gap-2">
            <div className="flex min-w-0 items-center gap-2">
              {showCompany && (
                <span className="line-clamp-1 max-w-[220px] text-b16-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                  {application.company}
                </span>
              )}
              <span className="line-clamp-1 max-w-[260px] text-b16-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
                {application.position}
              </span>
            </div>
          </div>

          <ApplicationKebabButton
            label={`${showCompany ? application.company : application.position} 임시저장 메뉴`}
            onDeleteClick={onDeleteClick}
            showRetry={false}
          />
        </div>

        <CreatedAt createdAt={application.createdAt} />
      </div>
    </article>
  );
}

export function SavedApplicationsModal({
  applications,
  onClose,
  onDeleteApplication,
  onResumeApplication,
}: {
  applications: ApplicationCardData[];
  onClose: () => void;
  onDeleteApplication: (application: ApplicationCardData) => void;
  onResumeApplication: (application: ApplicationCardData) => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-bg-lightbox-default px-[240px]"
      role="presentation"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="saved-applications-modal-title"
        className="flex h-[640px] w-[680px] shrink-0 flex-col items-center gap-0 rounded-card bg-bg-contents-default p-8 shadow-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex w-[616px] flex-1 flex-col items-start gap-10 overflow-hidden">
          <header className="flex items-start justify-between self-stretch pl-1">
            <h2
              id="saved-applications-modal-title"
              className="text-t20-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]"
            >
              임시저장 목록
            </h2>
            <button
              type="button"
              aria-label="임시저장 목록 닫기"
              className="flex h-[30px] w-[30px] items-center justify-center rounded-icon-default p-[3px] text-icon-neutral-default hover:bg-fill-hover"
              onClick={onClose}
            >
              <Icon type="CLOSE_M" className="h-6 w-6" />
            </button>
          </header>

          <div className="flex min-h-0 flex-1 items-start justify-start self-stretch">
            <div
              className={`flex h-full min-h-0 flex-1 flex-col items-start gap-2 overflow-y-auto pr-3 ${scrollbarClass}`}
            >
              {applications.map((application) => (
                <SavedApplicationModalCard
                  key={application.id}
                  application={application}
                  onDeleteClick={() => onDeleteApplication(application)}
                  onResumeClick={() => onResumeApplication(application)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
