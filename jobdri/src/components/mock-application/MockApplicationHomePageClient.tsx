"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/buttons";
import { ResultScore } from "@/components/common/cards";
import { DropDownMenu } from "@/components/common/dropdown";
import { BusinessFooter } from "@/components/common/footer";
import Icon from "@/components/common/icons/Icon";
import { Lnb } from "@/components/common/lnb";
import { ModalNotice } from "@/components/common/modal";
import { Toast } from "@/components/common/toast";
import { fetchMyJobPosting, type SavedJobPosting } from "@/lib/api/jobPostings";
import { fetchSequence } from "@/lib/api/result";
import {
  fetchMyMockApplies,
  getMockApplyResumeRecords,
  type JobPostingApplyType,
  type MockApplyHomeItem,
} from "@/lib/api/mockApplies";
import {
  createJdReviewSectionsFromJobPosting,
  getJdReviewMetadataStorageKey,
  getJdReviewSavedStorageKey,
  getJdReviewStorageKey,
} from "@/components/mock-application/jdReviewSections";
import { useReApply } from "@/hooks/useReApply";

interface ApplicationCardData {
  id: number;
  jobPostingId: number;
  company: string;
  position: string;
  createdAt: string;
  score?: number;
  mockApplyId: number;
  resumePath?: string | null;
  status?: string;
  applyType?: JobPostingApplyType;
}

const EMPTY_APPLICATION_TITLE = "아직 지원 내역이 없어요!";
const EMPTY_APPLICATION_DESCRIPTION =
  "기업과 직무에 맞춰 자소서를 작성하고 점수를 확인하세요";
const HOME_APPLICATIONS_STORAGE_KEY = "jobdri.mockApplyHomeApplications";
const APPLICATION_FETCH_TIMEOUT_MS = 12000;
const RESUME_ROUTE_SEGMENTS = new Set([
  "jd-input",
  "jd-review",
  "questions",
  "write",
  "result",
]);

function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replaceAll(". ", ". ")
    .trim();
}

function isCompletedStatus(status?: string) {
  return status === "COMPLETED";
}

function findLocalResumeStatus(item: MockApplyHomeItem) {
  const localRecord = getMockApplyResumeRecords().find(
    (record) =>
      record.mockApplyId === item.mockApplyId ||
      record.jobPostingId === item.jobPostingId,
  );

  return localRecord?.status;
}

function mapMockApplyToApplication(
  item: MockApplyHomeItem,
  section: "inProgress" | "completed",
): ApplicationCardData {
  const status =
    section === "completed"
      ? "COMPLETED"
      : (findLocalResumeStatus(item) ?? item.status);
  const score =
    isCompletedStatus(status) && typeof item.score === "number"
      ? item.score
      : undefined;

  return {
    id: item.mockApplyId,
    jobPostingId: item.jobPostingId,
    company: item.companyName || "회사명 미입력",
    position: item.detailClassificationName || item.jobTitle || "직무 미분류",
    createdAt: formatCreatedAt(item.createdAt),
    score,
    mockApplyId: item.mockApplyId,
    resumePath: item.resumePath,
    status,
    applyType: item.applyType,
  };
}

function mergeApplications(applications: ApplicationCardData[]) {
  const applicationMap = new Map<number, ApplicationCardData>();

  applications.forEach((application) => {
    const currentApplication = applicationMap.get(application.mockApplyId);

    if (!currentApplication || isCompletedStatus(application.status)) {
      applicationMap.set(application.mockApplyId, application);
    }
  });

  return [...applicationMap.values()];
}

function isApplicationCardData(value: unknown): value is ApplicationCardData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const application = value as Partial<ApplicationCardData>;

  return (
    typeof application.id === "number" &&
    typeof application.jobPostingId === "number" &&
    typeof application.mockApplyId === "number" &&
    typeof application.company === "string" &&
    typeof application.position === "string" &&
    typeof application.createdAt === "string"
  );
}

function readCachedApplications() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(
      window.sessionStorage.getItem(HOME_APPLICATIONS_STORAGE_KEY) ?? "[]",
    );

    return Array.isArray(parsed) ? parsed.filter(isApplicationCardData) : [];
  } catch {
    return [];
  }
}

function cacheApplications(applications: ApplicationCardData[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    HOME_APPLICATIONS_STORAGE_KEY,
    JSON.stringify(applications),
  );
}

function createRows<T>(items: T[], size: number) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size),
  );
}

function isEmptyApplicationStateError(message: string) {
  return (
    message.includes("인증") ||
    message.includes("Unauthorized") ||
    message.includes("Failed to fetch") ||
    message.includes("NetworkError") ||
    message.includes("Load failed")
  );
}

function normalizeResumePath(
  resumePath: string | null | undefined,
  mockApplyId: number,
) {
  if (!resumePath || resumePath === "string") {
    return "";
  }

  const trimmedResumePath = resumePath.trim();
  const resumeStep = trimmedResumePath.replace(/^\/+/, "");

  if (RESUME_ROUTE_SEGMENTS.has(resumeStep)) {
    return `/apply/virtual/${mockApplyId}/${resumeStep}`;
  }

  let path = trimmedResumePath;

  if (trimmedResumePath.startsWith("http")) {
    try {
      const url = new URL(trimmedResumePath);
      path = `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return "";
    }
  }

  path = path.startsWith("/") ? path : `/${path}`;

  const routeMatch = path.match(
    /^\/apply\/virtual\/[^/]+\/([^/?#]+)([?#].*)?$/,
  );
  const routeSegment = routeMatch?.[1];

  if (!routeSegment || !RESUME_ROUTE_SEGMENTS.has(routeSegment)) {
    return "";
  }

  return `/apply/virtual/${mockApplyId}/${routeSegment}${routeMatch[2] ?? ""}`;
}

function getResumePath({
  mockApplyId,
  jobPostingId,
  resumePath,
  status,
}: Pick<
  ApplicationCardData,
  "mockApplyId" | "jobPostingId" | "resumePath" | "status"
>) {
  const normalizedResumePath = normalizeResumePath(resumePath, mockApplyId);

  if (normalizedResumePath) {
    return normalizedResumePath;
  }

  if (status === "ANSWER_WRITE") {
    return `/apply/virtual/${mockApplyId}/write?jobPostingId=${jobPostingId}`;
  }

  return `/apply/virtual/${mockApplyId}/questions`;
}

function getResultPath({
  jobPostingId,
}: Pick<ApplicationCardData, "jobPostingId">) {
  return `/apply/virtual/${jobPostingId}/result`;
}

function saveJdReviewSessionFromJobPosting(
  jobPosting: SavedJobPosting,
  applyId: number,
) {
  const {
    companyName,
    companySize,
    detailClassificationId,
    detailClassificationName,
    task,
    requirement,
    preferred,
  } = jobPosting;
  const storageApplyId = String(applyId);
  const sections = createJdReviewSectionsFromJobPosting({
    companyName,
    jobTitle: detailClassificationName,
    task,
    requirements: requirement,
    preferredQualifications: preferred,
  });

  window.sessionStorage.setItem(
    getJdReviewStorageKey(storageApplyId),
    JSON.stringify(sections),
  );
  window.sessionStorage.setItem(
    getJdReviewSavedStorageKey(storageApplyId),
    JSON.stringify(jobPosting),
  );
  window.sessionStorage.setItem(
    getJdReviewMetadataStorageKey(storageApplyId),
    JSON.stringify({
      companySize,
      detailClassificationId,
    }),
  );
}

function handleCardKeyDown(
  event: ReactKeyboardEvent<HTMLElement>,
  onResumeClick?: () => void,
) {
  if (!onResumeClick || (event.key !== "Enter" && event.key !== " ")) {
    return;
  }

  event.preventDefault();
  onResumeClick();
}

function KebabButton({
  label,
  onDeleteClick,
  onReApplyClick,
}: {
  label: string;
  onDeleteClick: () => void;
  onReApplyClick?: () => void;
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
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
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
            ...(onReApplyClick
              ? [
                  {
                    label: "재지원하기",
                    onClick: () => {
                      setOpen(false);
                      onReApplyClick();
                    },
                  },
                ]
              : []),
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
  onDeleteClick,
  onResumeClick,
}: ApplicationCardData & {
  onDeleteClick: () => void;
  onResumeClick?: () => void;
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      className="relative flex cursor-pointer items-center self-stretch rounded-card bg-bg-contents-default px-7 py-6"
      onClick={onResumeClick}
      onKeyDown={(event) => handleCardKeyDown(event, onResumeClick)}
    >
      <div className="flex min-w-0 flex-1 items-center gap-5">
        <ResultScore size="small" displayScore="??" />
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
  onResumeClick,
  onReApplyClick,
}: ApplicationCardData & {
  onDeleteClick: () => void;
  onResumeClick?: () => void;
  onReApplyClick?: () => void;
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      className="relative flex flex-1 cursor-pointer flex-col items-start justify-center gap-16 rounded-card bg-bg-contents-default px-6 py-5"
      onClick={onResumeClick}
      onKeyDown={(event) => handleCardKeyDown(event, onResumeClick)}
    >
      <div className="flex items-start justify-between self-stretch">
        <ResultScore size="small" score={score} />
        <KebabButton
          label={`${company} 모의 서류 결과 메뉴`}
          onDeleteClick={onDeleteClick}
          onReApplyClick={onReApplyClick}
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
  const { reApply } = useReApply();
  const [applications, setApplications] = useState<ApplicationCardData[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);

  useEffect(() => {
    const cached = readCachedApplications();
    setApplications(cached);
    setIsLoadingApplications(cached.length === 0);
  }, []);
  const [applicationsErrorMessage, setApplicationsErrorMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const pausedApplications = applications.filter(
    ({ status }) => !isCompletedStatus(status),
  );
  const resultApplications = applications.filter(({ status }) =>
    isCompletedStatus(status),
  );
  const resultRows = createRows(resultApplications, 5);
  const hasApplicationData =
    pausedApplications.length > 0 || resultApplications.length > 0;
  const shouldShowErrorMessage =
    applicationsErrorMessage &&
    !isEmptyApplicationStateError(applicationsErrorMessage);

  const openDeleteConfirm = () => setShowDeleteConfirm(true);
  const closeDeleteConfirm = () => setShowDeleteConfirm(false);
  const closeDeleteToast = () => setShowDeleteToast(false);
  const handleResumeApplication = async (application: ApplicationCardData) => {
    const resumePath = getResumePath(application);

    if (resumePath.includes("/jd-review")) {
      try {
        const latestJobPosting = await fetchMyJobPosting(
          application.jobPostingId,
        );
        saveJdReviewSessionFromJobPosting(
          latestJobPosting,
          application.mockApplyId,
        );
      } catch {}
    }

    router.push(resumePath);
  };
  const handleResultApplication = async (application: ApplicationCardData) => {
    try {
      const { sequence, totalCount } = await fetchSequence(
        application.mockApplyId,
      );
      router.push(
        `/apply/virtual/${application.jobPostingId}/result?sequence=${sequence}&totalCount=${totalCount}`,
      );
    } catch {
      router.push(getResultPath(application));
    }
  };

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, APPLICATION_FETCH_TIMEOUT_MS);

    fetchMyMockApplies({ signal: controller.signal })
      .then(({ inProgress, completed }) => {
        const nextApplications = mergeApplications([
          ...inProgress.map((application) =>
            mapMockApplyToApplication(application, "inProgress"),
          ),
          ...completed.map((application) =>
            mapMockApplyToApplication(application, "completed"),
          ),
        ]);

        if (!isActive) {
          return;
        }

        cacheApplications(nextApplications);
        setApplications(nextApplications);
        setApplicationsErrorMessage("");
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }

        const cachedApplications = readCachedApplications();

        if (cachedApplications.length > 0) {
          setApplications(cachedApplications);
          setApplicationsErrorMessage("");
          return;
        }

        setApplicationsErrorMessage(
          error instanceof Error
            ? error.message
            : "내 지원 데이터를 불러오지 못했습니다.",
        );
      })
      .finally(() => {
        if (!isActive) {
          return;
        }

        window.clearTimeout(timeoutId);
        setIsLoadingApplications(false);
      });

    return () => {
      isActive = false;
      controller.abort();
      window.clearTimeout(timeoutId);
    };
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
                          onResumeClick={() =>
                            handleResumeApplication(application)
                          }
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
                              onResumeClick={() =>
                                handleResultApplication(application)
                              }
                              onReApplyClick={() =>
                                reApply(application.mockApplyId)
                              }
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
