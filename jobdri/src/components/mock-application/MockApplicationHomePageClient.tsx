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

interface ApplicationCardData {
  company: string;
  position: string;
  createdAt: string;
  score: number;
}

const pausedApplications: ApplicationCardData[] = [
  {
    company: "카카오",
    position: "백엔드 개발자",
    createdAt: "2022. 09. 03",
    score: 77,
  },
  {
    company: "현대자동차",
    position: "백엔드 개발자",
    createdAt: "2022. 09. 03",
    score: 77,
  },
];

const resultApplications: ApplicationCardData[] = [
  {
    company: "카카오",
    position: "백엔드 개발자",
    createdAt: "2022. 09. 03",
    score: 64,
  },
  {
    company: "카카오",
    position: "백엔드 개발자",
    createdAt: "2022. 09. 03",
    score: 71,
  },
  {
    company: "카카오",
    position: "백엔드 개발자",
    createdAt: "2022. 09. 03",
    score: 71,
  },
  {
    company: "카카오",
    position: "백엔드 개발자",
    createdAt: "2022. 09. 03",
    score: 71,
  },
  {
    company: "네이버",
    position: "프론트엔드 개발자",
    createdAt: "2022. 09. 04",
    score: 82,
  },
  {
    company: "토스",
    position: "서버 개발자",
    createdAt: "2022. 09. 05",
    score: 76,
  },
  {
    company: "쿠팡",
    position: "데이터 엔지니어",
    createdAt: "2022. 09. 06",
    score: 69,
  },
  {
    company: "라인",
    position: "백엔드 개발자",
    createdAt: "2022. 09. 07",
    score: 88,
  },
  {
    company: "배달의민족",
    position: "프로덕트 디자이너",
    createdAt: "2022. 09. 08",
    score: 73,
  },
  {
    company: "당근",
    position: "안드로이드 개발자",
    createdAt: "2022. 09. 09",
    score: 79,
  },
];

const resultRows = Array.from(
  { length: Math.ceil(resultApplications.length / 5) },
  (_, index) => resultApplications.slice(index * 5, index * 5 + 5),
);

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
        <ResultScore size="small" score={score} />
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
        <ResultScore size="small" score={score} />
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

export default function MockApplicationHomePageClient() {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteConfirm = () => setShowDeleteConfirm(true);
  const closeDeleteConfirm = () => setShowDeleteConfirm(false);
  const closeDeleteToast = () => setShowDeleteToast(false);

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
          <div className="flex w-full min-w-0 flex-col items-center gap-16 self-stretch">
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

            <section className="flex flex-col items-start gap-6 self-stretch">
              <header className="flex items-center gap-2.5 self-stretch pl-1">
                <h2 className="text-t20-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                  이어서 해볼까요?
                </h2>
              </header>

              <div className="flex flex-col items-center gap-2 self-stretch">
                {pausedApplications.map((application) => (
                  <PausedApplicationCard
                    key={`${application.company}-${application.score}`}
                    {...application}
                    onDeleteClick={openDeleteConfirm}
                  />
                ))}
              </div>
            </section>

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
                    {row.map((application, cardIndex) => (
                      <ResultApplicationCard
                        key={`${application.company}-${rowIndex}-${cardIndex}`}
                        {...application}
                        onDeleteClick={openDeleteConfirm}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </section>
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
