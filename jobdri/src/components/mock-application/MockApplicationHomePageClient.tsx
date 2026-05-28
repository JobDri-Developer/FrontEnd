"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextButton } from "@/components/common/buttons";
import { BusinessFooter } from "@/components/common/footer";
import { Lnb } from "@/components/common/lnb";
import { ModalNotice } from "@/components/common/modal";
import { Toast } from "@/components/common/toast";
import { fetchMyJobPosting } from "@/lib/api/jobPostings";
import { fetchMyMockApplies } from "@/lib/api/mockApplies";
import {
  EmptyApplicationState,
  MockApplicationHomeIntro,
  PausedApplicationCard,
  ResultApplicationCard,
  type ApplicationCardData,
} from "@/components/mock-application/home";
import {
  APPLICATION_FETCH_TIMEOUT_MS,
  EMPTY_APPLICATION_DESCRIPTION,
  EMPTY_APPLICATION_TITLE,
  cacheApplications,
  createRows,
  getLatestApplication,
  getResumePath,
  getResultPath,
  isCompletedStatus,
  isEmptyApplicationStateError,
  mapMockApplyToApplication,
  mergeApplications,
  readCachedApplications,
  saveJdReviewSessionFromJobPosting,
} from "@/components/mock-application/home/applicationHomeUtils";

export default function MockApplicationHomePageClient() {
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationCardData[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [applicationsErrorMessage, setApplicationsErrorMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const pausedApplications = applications.filter(
    ({ status }) => !isCompletedStatus(status),
  );
  const resultApplications = applications.filter(
    ({ status }) => isCompletedStatus(status),
  );
  const latestPausedApplication = getLatestApplication(pausedApplications);
  const resultRows = createRows(resultApplications, 3);
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
  const handleResultApplication = (application: ApplicationCardData) => {
    router.push(getResultPath(application));
  };

  useEffect(() => {
    let isActive = true;
    let didReceiveRemoteApplications = false;
    const controller = new AbortController();
    const cachedApplications = readCachedApplications();
    const cacheSyncId =
      cachedApplications.length > 0
        ? window.setTimeout(() => {
            if (!isActive || didReceiveRemoteApplications) {
              return;
            }

            setApplications(cachedApplications);
            setIsLoadingApplications(false);
          }, 0)
        : null;
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

        didReceiveRemoteApplications = true;
        cacheApplications(nextApplications);
        setApplications(nextApplications);
        setApplicationsErrorMessage("");
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }

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
      if (cacheSyncId !== null) {
        window.clearTimeout(cacheSyncId);
      }
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
    <div className="flex min-h-screen w-full bg-[linear-gradient(206deg,#F7F8FE_33.45%,#EEF1FF_83.74%)]">
      <div className="sticky top-0 h-screen w-60 shrink-0">
        <Lnb initialActiveItem="apply" className="bg-white/75" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col self-stretch">
        <main className="content-frame-lnb">
          <div className="container-lnb flex flex-col items-center gap-16">
            <section className="flex flex-col items-center gap-10 self-stretch">
              <div className="flex items-start justify-between gap-6 self-stretch">
                <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
                  <h1 className="text-h24-bold text-[#2F2F37] [font-feature-settings:'liga'_off,'clig'_off]">
                    모의 서류 지원
                  </h1>
                  <p className="self-stretch text-sub14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
                    지원 전에 내 자소서의 합격 가능성을 먼저 확인하세요. AI가
                    합격자 데이터와 비교해 점수와 개선점을 알려드립니다.
                  </p>
                </div>

                <Button
                  label="새로운 지원하기"
                  styleType="primary"
                  size="large"
                  iconType="ADD"
                  className="shrink-0"
                  onClick={() => router.push("/apply/apply-type")}
                />
              </div>

              <MockApplicationHomeIntro />
            </section>

            {isLoadingApplications ? (
              <p className="flex h-[140px] items-center justify-center self-stretch rounded-card bg-bg-contents-default text-b16-semibold text-text-neutral-caption">
                내 지원 데이터를 불러오는 중입니다.
              </p>
            ) : shouldShowErrorMessage ? (
              <p className="flex h-[140px] items-center justify-center self-stretch rounded-card bg-bg-contents-default text-center text-b16-semibold text-text-neutral-caption">
                {applicationsErrorMessage}
              </p>
            ) : hasApplicationData ? (
              <>
                {pausedApplications.length > 0 && (
                  <section className="flex flex-col items-start gap-6 self-stretch">
                    <header className="flex items-center justify-between self-stretch pl-1">
                      <h2 className="text-t20-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                        이어서 해볼까요?
                      </h2>
                      <TextButton
                        label={
                          <span className="inline-flex items-center">
                            <span>임시저장&nbsp;</span>
                            <span className="text-blue-500">
                              {pausedApplications.length}개
                            </span>
                          </span>
                        }
                        size="large"
                        styleType="primary"
                        aria-label={`임시저장 ${pausedApplications.length}개 보기`}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                      />
                    </header>

                    <div className="flex flex-col items-center gap-3 self-stretch">
                      {latestPausedApplication && (
                        <PausedApplicationCard
                          key={latestPausedApplication.id}
                          {...latestPausedApplication}
                          onDeleteClick={openDeleteConfirm}
                          onResumeClick={() =>
                            handleResumeApplication(latestPausedApplication)
                          }
                        />
                      )}
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

                    <div className="flex flex-col items-start gap-4 self-stretch">
                      {resultRows.map((row, rowIndex) => (
                        <div
                          key={rowIndex}
                          className="flex items-start gap-3 self-stretch"
                        >
                          {row.map((application) => (
                            <ResultApplicationCard
                              key={application.id}
                              {...application}
                              onDeleteClick={openDeleteConfirm}
                              onResumeClick={() =>
                                handleResultApplication(application)
                              }
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            ) : (
              <EmptyApplicationState
                title={EMPTY_APPLICATION_TITLE}
                description={EMPTY_APPLICATION_DESCRIPTION}
              />
            )}
          </div>
        </main>

        <BusinessFooter className="items-center bg-white/60 [&>div:first-child]:bg-transparent" />
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
