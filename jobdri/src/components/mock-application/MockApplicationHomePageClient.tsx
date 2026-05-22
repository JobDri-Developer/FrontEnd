"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/buttons";
import { ResultScore } from "@/components/common/cards";
import { DropDownMenu } from "@/components/common/dropdown";
import { BusinessFooter } from "@/components/common/footer";
import Icon from "@/components/common/icons/Icon";
import { Lnb } from "@/components/common/lnb";
import { ModalNotice } from "@/components/common/modal";
import { Toast } from "@/components/common/toast";
import {
  fetchMyJobPostings,
  type SavedJobPosting,
} from "@/lib/api/jobPostings";

interface ApplicationCardData {
  id: number;
  company: string;
  position: string;
  createdAt: string;
  score?: number;
}

const EMPTY_APPLICATION_TITLE = "아직 지원 내역이 없어요!";
const EMPTY_APPLICATION_DESCRIPTION =
  "기업과 직무에 맞춰 자소서를 작성하고 점수를 확인하세요";

function mapJobPostingToApplication({
  jobPostingId,
  companyName,
  detailClassificationName,
}: SavedJobPosting): ApplicationCardData {
  return {
    id: jobPostingId,
    company: companyName || "회사명 미입력",
    position: detailClassificationName || "직무 미분류",
    createdAt: "-",
  };
}

function createRows<T>(items: T[], size: number) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size),
  );
}

function isAuthMissingError(message: string) {
  return message.includes("인증") || message.includes("Unauthorized");
}

function KebabButton({
  label,
  onDeleteClick,
}: {
  label: string;
  onDeleteClick: () => void;
}) {
  const dropdownId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-6 w-6 shrink-0 items-center justify-center"
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? dropdownId : undefined}
        className="flex h-6 w-6 shrink-0 items-center justify-center text-icon-neutral-default"
        onClick={() => setOpen((currentOpen) => !currentOpen)}
      >
        <Icon type="KABAB" className="h-6 w-6" />
      </button>

      {open && (
        <DropDownMenu
          id={dropdownId}
          className="absolute top-[calc(100%+8px)] right-0 z-30"
          items={[
            {
              label: "삭제하기",
              onClick: () => {
                setOpen(false);
                onDeleteClick();
              },
            },
          ]}
        />
      )}
    </div>
  );
}

function ApplicationMeta({
  company,
  position,
  createdAt,
  stacked = false,
}: Pick<ApplicationCardData, "company" | "position" | "createdAt"> & {
  stacked?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
      <div
        className={
          stacked
            ? "flex min-w-0 flex-col items-start justify-center self-stretch"
            : "flex min-w-0 items-center gap-2 self-stretch"
        }
      >
        <span className="min-w-0 max-w-full truncate text-b16-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
          {company}
        </span>
        <span className="min-w-0 max-w-full truncate text-b16-reg text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
          {position}
        </span>
      </div>

      <div className="flex items-center justify-end gap-1.5">
        <span className="text-right text-cap12-med text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
          작성일
        </span>
        <span className="text-right text-cap12-med text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
          {createdAt}
        </span>
      </div>
    </div>
  );
}

function ApplicationStateBadge() {
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-line-neutral-default bg-bg-contents-default">
      <span className="text-cap12-semibold text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
        작성중
      </span>
    </div>
  );
}

function PausedApplicationCard({
  company,
  position,
  createdAt,
  score,
  onDeleteClick,
}: ApplicationCardData & {
  onDeleteClick: () => void;
}) {
  return (
    <article className="relative flex items-center self-stretch rounded-card bg-bg-contents-default px-7 py-6">
      <div className="flex min-w-0 flex-1 items-center gap-5">
        {typeof score === "number" ? (
          <ResultScore size="small" score={score} />
        ) : (
          <ApplicationStateBadge />
        )}
        <ApplicationMeta
          company={company}
          position={position}
          createdAt={createdAt}
        />
      </div>
      <KebabButton
        label={`${company} 모의 지원 메뉴`}
        onDeleteClick={onDeleteClick}
      />
    </article>
  );
}

function ResultApplicationCard({
  company,
  position,
  createdAt,
  score,
  onDeleteClick,
}: ApplicationCardData & {
  onDeleteClick: () => void;
}) {
  return (
    <article className="relative flex flex-1 flex-col items-start justify-center gap-16 rounded-card bg-bg-contents-default px-6 py-5">
      <div className="flex items-start justify-between self-stretch">
        {typeof score === "number" ? (
          <ResultScore size="small" score={score} />
        ) : (
          <ApplicationStateBadge />
        )}
        <KebabButton
          label={`${company} 모의 서류 결과 메뉴`}
          onDeleteClick={onDeleteClick}
        />
      </div>

      <ApplicationMeta
        company={company}
        position={position}
        createdAt={createdAt}
        stacked
      />
    </article>
  );
}

function EmptyApplicationState() {
  return (
    <div className="mt-16 flex flex-col items-center justify-center gap-1 self-stretch">
      <p className="text-center text-t20-semibold text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
        {EMPTY_APPLICATION_TITLE}
      </p>
      <p className="text-center text-b16-reg text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
        {EMPTY_APPLICATION_DESCRIPTION}
      </p>
    </div>
  );
}

export default function MockApplicationHomePageClient() {
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationCardData[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [applicationsErrorMessage, setApplicationsErrorMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const pausedApplications = applications.filter(
    ({ score }) => typeof score !== "number",
  );
  const resultApplications = applications.filter(
    ({ score }) => typeof score === "number",
  );
  const resultRows = createRows(resultApplications, 5);
  const hasApplicationData =
    pausedApplications.length > 0 || resultApplications.length > 0;
  const shouldShowErrorMessage =
    applicationsErrorMessage && !isAuthMissingError(applicationsErrorMessage);

  const openDeleteConfirm = () => setShowDeleteConfirm(true);
  const closeDeleteConfirm = () => setShowDeleteConfirm(false);
  const closeDeleteToast = () => setShowDeleteToast(false);

  useEffect(() => {
    fetchMyJobPostings()
      .then((jobPostings) => {
        setApplications(jobPostings.map(mapJobPostingToApplication));
        setApplicationsErrorMessage("");
      })
      .catch((error) => {
        setApplications([]);
        setApplicationsErrorMessage(
          error instanceof Error
            ? error.message
            : "내 지원 데이터를 불러오지 못했습니다.",
        );
      })
      .finally(() => setIsLoadingApplications(false));
  }, []);

  useEffect(() => {
    if (!showDeleteToast) return;

    const toastTimer = window.setTimeout(() => {
      setShowDeleteToast(false);
    }, 3000);

    return () => {
      window.clearTimeout(toastTimer);
    };
  }, [showDeleteToast]);

  const deleteApplicationRecord = async (): Promise<boolean> => {
    // TODO: API 연결 후 실제 지원 기록 삭제 요청을 여기에 붙입니다.
    // const response = await fetch("/api/mock-application/records/{id}", {
    //   method: "DELETE",
    // });
    // return response.ok;
    return true;
  };

  const handleConfirmDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      const deleted = await deleteApplicationRecord();

      if (deleted) {
        closeDeleteConfirm();
        setShowDeleteToast(true);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-default">
      <div className="sticky top-0 h-screen shrink-0">
        <Lnb initialActiveItem="apply" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-center self-stretch">
        <main className="flex min-w-0 flex-1 flex-col items-start gap-8 self-stretch px-10 pt-11 pb-[94px]">
          <div className="flex w-full min-w-0 flex-col items-center self-stretch">
            <section className="flex flex-col items-start gap-7 self-stretch">
              <div className="flex flex-col items-start gap-7 self-stretch md:flex-row md:justify-between">
                <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
                  <h1 className="text-h24-bold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                    모의 서류 지원
                  </h1>
                  <p className="self-stretch text-sub14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
                    지원 전에 내 자소서와 함께 가능성을 먼저 확인하세요. AI가
                    합격자 데이터와 비교해 점수와 개선점을 알려드립니다.
                  </p>
                </div>

                <Button
                  label="모의 지원하기"
                  styleType="secondary"
                  size="large"
                  iconType="ADD"
                  onClick={() => router.push("/apply/apply-type")}
                />
              </div>

              <div className="h-[0.75px] self-stretch bg-line-neutral-strong" />
            </section>

            {isLoadingApplications ? (
              <p className="mt-16 flex h-[140px] items-center justify-center self-stretch rounded-card bg-bg-contents-default text-b16-semibold text-text-neutral-caption">
                내 지원 데이터를 불러오는 중입니다.
              </p>
            ) : shouldShowErrorMessage ? (
              <p className="mt-16 flex h-[140px] items-center justify-center self-stretch rounded-card bg-bg-contents-default text-center text-b16-semibold text-text-neutral-caption">
                {applicationsErrorMessage}
              </p>
            ) : hasApplicationData ? (
              <div className="mt-16 flex w-full flex-col items-center gap-16 self-stretch">
                {pausedApplications.length > 0 && (
                  <section className="flex flex-col items-start gap-6 self-stretch">
                    <header className="flex items-center gap-2.5 self-stretch pl-1">
                      <h2 className="text-t20-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                        이어서 해볼까요?
                      </h2>
                    </header>

                    <div className="flex flex-col items-center gap-2 self-stretch">
                      {pausedApplications.map((application) => (
                        <PausedApplicationCard
                          key={application.id}
                          {...application}
                          onDeleteClick={openDeleteConfirm}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {resultApplications.length > 0 && (
                  <section className="flex flex-col items-start gap-6 self-stretch">
                    <header className="flex items-center gap-2 self-stretch">
                      <h2 className="text-t20-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                        모의 서류 결과
                      </h2>
                      <span className="text-b16-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
                        {resultApplications.length}개
                      </span>
                    </header>

                    <div className="flex flex-col items-start gap-3 self-stretch">
                      {resultRows.map((row, rowIndex) => (
                        <div
                          key={rowIndex}
                          className="flex flex-col items-start gap-3 self-stretch md:flex-row"
                        >
                          {row.map((application) => (
                            <ResultApplicationCard
                              key={application.id}
                              {...application}
                              onDeleteClick={openDeleteConfirm}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <EmptyApplicationState />
            )}
          </div>
        </main>

        <BusinessFooter />
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
          <ModalNotice
            type="confirmationModal"
            title="지원 기록을 삭제할까요?"
            description="삭제된 기록은 복구할 수 없습니다."
            onClose={closeDeleteConfirm}
            secondaryAction={{
              label: "닫기",
              onClick: closeDeleteConfirm,
            }}
            primaryAction={{
              label: "삭제하기",
              onClick: handleConfirmDelete,
              disabled: isDeleting,
            }}
          />
        </div>
      )}

      {showDeleteToast && (
        <div className="fixed right-0 bottom-0 z-40 flex h-[156px] w-[380px] items-center justify-end pointer-events-none">
          <div className="inline-flex h-40 w-[400px] shrink-0 flex-col items-start justify-start gap-2.5">
            <Toast
              message="지원 기록이 삭제되었습니다."
              onClose={closeDeleteToast}
              className="w-[360px] pointer-events-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
