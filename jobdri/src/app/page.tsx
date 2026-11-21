"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/common/buttons";
import { BusinessFooter } from "@/components/common/footer";
import Lnb from "@/components/common/lnb/Lnb";
import ResultDraftList from "@/components/home/ResultDraftList";
import ResultApplicationList from "@/components/home/ResultApplicationList";
import {
  deleteMockApply,
  saveSelectedApplyType,
  type MockApplyHomeItem,
} from "@/lib/api/mockApplies";
import { deleteJobPosting } from "@/lib/api/jobPostings";
import {
  jobPostingDetailQueryOptions,
  myJobPostingsQueryOptions,
  myMockAppliesQueryOptions,
  queryKeys,
  type MyJobPostings,
  type MyMockApplies,
} from "@/lib/queries";
import {
  clearJobPostingDraft,
  saveJobPostingAnalysis,
} from "@/app/mockApply/job/jobPostingDraftStore";
import { formatRelativeDate } from "@/utils/date";
import type { DraftData, ApplicationCardData } from "@/components/home/types";
import { useReApply } from "@/hooks/useReApply";
import { mapMockApplyToApplication } from "@/components/home/applicationHomeUtils";
import {
  DRAFT_STATUS_BY_STEP,
  DRAFT_TOTAL_STEPS,
} from "@/components/home/homeSteps";
import { resolveBadgeType, track } from "@/lib/analytics";
import { ToastVariant } from "@/components/common/toast/Toast";
import Toast from "@/components/common/toast/Toast";
import ModalNotice from "@/components/common/modal/ModalNotice";
import { ModalOverlay } from "@/components/common/modal/ModalOverlay";

// 🌟 필요한 API 함수들 import
import { subscribeAnalysisTaskStream } from "@/lib/api/result";

function buildHomeLists(
  mockApplies: MyMockApplies,
  jobPostings: MyJobPostings,
): { drafts: DraftData[]; results: ApplicationCardData[] } {
  const inProgressList = mockApplies.inProgress;
  const completedList = mockApplies.completed.content;

  const jobPostingById = new Map(
    jobPostings.map((jobPosting) => [jobPosting.jobPostingId, jobPosting]),
  );

  // 작성 중인 모의지원(Drafts) 매핑
  const mappedDrafts: DraftData[] = inProgressList.map((item) => {
    const jobPosting = jobPostingById.get(item.jobPostingId);

    let currentStep = 1;
    if (item.taskId) {
      currentStep = 3; // 채점 중
    } else if (item.status === "ANSWER_WRITE") {
      currentStep = 2; // 작성 중
    }

    return {
      id: String(item.mockApplyId),
      jobPostingId: item.jobPostingId,
      mockApplyId: item.mockApplyId,
      companyName:
        item.companyName || jobPosting?.companyName || "회사명 미입력",
      profileColor: jobPosting?.profileColor ?? "DEFAULT",
      position:
        item.jobTitle ||
        jobPosting?.jobTitle ||
        item.detailClassificationName ||
        jobPosting?.detailClassificationName ||
        "직무 미지정",
      currentStep,
      taskId: item.taskId,
      updatedAt: item.createdAt ? formatRelativeDate(item.createdAt) : "-",
      createdAtTime: item.createdAt ? new Date(item.createdAt).getTime() : 0,
    };
  });

  const linkedJobPostingIds = new Set(
    [...inProgressList, ...completedList].map((item) => item.jobPostingId),
  );

  // 순수 채용 공고(Drafts) 매핑
  const savedOnlyDrafts: DraftData[] = jobPostings
    .filter((jobPosting) => !linkedJobPostingIds.has(jobPosting.jobPostingId))
    .map((jobPosting) => ({
      id: `job-posting-${jobPosting.jobPostingId}`,
      jobPostingId: jobPosting.jobPostingId,
      companyName: jobPosting.companyName || "회사명 미입력",
      profileColor: jobPosting.profileColor,
      position:
        jobPosting.jobTitle ||
        jobPosting.detailClassificationName ||
        "직무 미지정",
      currentStep: 1,
      taskId: jobPosting.taskId,
      updatedAt: jobPosting.createdAt
        ? formatRelativeDate(jobPosting.createdAt)
        : "-",
      createdAtTime: jobPosting.createdAt
        ? new Date(jobPosting.createdAt).getTime()
        : 0,
    }));

  const results = completedList.map((item) => {
    const jobPosting = jobPostingById.get(item.jobPostingId);
    return mapMockApplyToApplication(
      {
        ...item,
        profileColor: jobPosting?.profileColor ?? "DEFAULT",
        jobTitle: item.jobTitle || jobPosting?.jobTitle || "",
        detailClassificationName:
          item.detailClassificationName ||
          jobPosting?.detailClassificationName ||
          "",
      },
      "completed",
    );
  });

  const drafts = [...savedOnlyDrafts, ...mappedDrafts].sort((a, b) => {
    const aIsAnalyzing = a.currentStep === 3;
    const bIsAnalyzing = b.currentStep === 3;

    if (aIsAnalyzing && !bIsAnalyzing) return -1;
    if (!aIsAnalyzing && bIsAnalyzing) return 1;

    const timeDifference = (b.createdAtTime ?? 0) - (a.createdAtTime ?? 0);
    if (timeDifference !== 0) return timeDifference;
    return (
      (b.mockApplyId ?? b.jobPostingId) - (a.mockApplyId ?? a.jobPostingId)
    );
  });

  return { drafts, results };
}

const EMPTY_DRAFTS: DraftData[] = [];
const EMPTY_RESULTS: ApplicationCardData[] = [];

export default function Home() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { reApply, isSaving: isRetrying } = useReApply();
  const mockAppliesQuery = useQuery(myMockAppliesQueryOptions());
  const jobPostingsQuery = useQuery(myJobPostingsQueryOptions());
  const [draftToDelete, setDraftToDelete] = useState<DraftData | null>(null);
  const [applicationToDelete, setApplicationToDelete] =
    useState<ApplicationCardData | null>(null);
  const [isDeletingDraft, setIsDeletingDraft] = useState(false);
  const [isDeletingApplication, setIsDeletingApplication] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    variant: ToastVariant;
  }>({
    show: false,
    message: "",
    variant: "normal",
  });

  const hasTrackedHomeView = useRef(false);

  const showToast = (message: string, variant: ToastVariant) => {
    setToast({ show: true, message, variant });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // 공고 목록 조회가 실패해도 모의지원 목록만으로 화면을 그린다.
  const homeLists = useMemo(() => {
    if (!mockAppliesQuery.data || jobPostingsQuery.isPending) return null;
    return buildHomeLists(mockAppliesQuery.data, jobPostingsQuery.data ?? []);
  }, [
    mockAppliesQuery.data,
    jobPostingsQuery.data,
    jobPostingsQuery.isPending,
  ]);

  const drafts = homeLists?.drafts ?? EMPTY_DRAFTS;
  const results = homeLists?.results ?? EMPTY_RESULTS;

  useEffect(() => {
    if (!homeLists || hasTrackedHomeView.current) return;
    hasTrackedHomeView.current = true;
    track("home_page_viewed", {
      paused_count: homeLists.drafts.length,
      completed_count: homeLists.results.length,
    });
  }, [homeLists]);

  useEffect(() => {
    if (mockAppliesQuery.error) {
      console.error(
        "데이터를 불러오는데 실패했습니다.",
        mockAppliesQuery.error,
      );
    }
  }, [mockAppliesQuery.error]);

  const refreshHomeLists = useCallback(
    () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.myMockApplies }),
        queryClient.invalidateQueries({ queryKey: queryKeys.myJobPostings }),
      ]),
    [queryClient],
  );

  // 삭제한 항목을 캐시에서 바로 빼서 화면에 즉시 반영한 뒤, 서버 값으로 다시 맞춘다.
  const removeFromHomeCache = ({
    mockApplyId,
    jobPostingId,
  }: {
    mockApplyId?: number;
    jobPostingId?: number;
  }) => {
    const shouldKeep = (item: MockApplyHomeItem) =>
      item.mockApplyId !== mockApplyId && item.jobPostingId !== jobPostingId;

    queryClient.setQueryData<MyMockApplies>(
      queryKeys.myMockApplies,
      (current) =>
        current && {
          inProgress: current.inProgress.filter(shouldKeep),
          completed: {
            ...current.completed,
            content: current.completed.content.filter(shouldKeep),
          },
        },
    );

    if (jobPostingId !== undefined) {
      queryClient.setQueryData<MyJobPostings>(
        queryKeys.myJobPostings,
        (current) =>
          current?.filter(
            (jobPosting) => jobPosting.jobPostingId !== jobPostingId,
          ),
      );
    }

    // 삭제 도중에 시작된 조회가 지운 항목을 되살리지 않도록 다시 요청한다.
    void refreshHomeLists();
  };

  // // 🌟 1. 자소서 분석(채점 중) 개별 구독
  // useEffect(() => {
  //   const analyzingDrafts = drafts.filter(
  //     (draft) => draft.currentStep === 3 && draft.taskId && draft.mockApplyId,
  //   );

  //   if (analyzingDrafts.length === 0) return;

  //   const abortControllers: AbortController[] = [];

  //   analyzingDrafts.forEach((draft) => {
  //     const controller = new AbortController();
  //     abortControllers.push(controller);

  //     void subscribeAnalysisTaskStream(draft.mockApplyId!, draft.taskId!, {
  //       signal: controller.signal,
  //       onEvent: (event) => {
  //         try {
  //           const data = JSON.parse(event.data);
  //           if (data.status === "SUCCEEDED") {
  //             showToast("자소서 분석이 완료되었습니다!", "check");
  //             loadMockApplies();
  //             controller.abort();
  //           } else if (data.status === "FAILED") {
  //             showToast("자소서 분석에 실패했습니다.", "warning");
  //             loadMockApplies();
  //             controller.abort();
  //           }
  //         } catch (e) {}
  //       },
  //     });
  //   });

  //   return () => {
  //     abortControllers.forEach((controller) => controller.abort());
  //   };
  // }, [drafts, loadMockApplies]);

  useEffect(() => {
    const analyzingJobPostings = drafts.filter(
      (draft) => draft.currentStep === 1 && draft.taskId && !draft.mockApplyId,
    );

    if (analyzingJobPostings.length === 0) return;

    const abortControllers: AbortController[] = [];

    analyzingJobPostings.forEach((draft) => {
      const controller = new AbortController();
      abortControllers.push(controller);

      void subscribeAnalysisTaskStream(draft.jobPostingId, draft.taskId!, {
        signal: controller.signal,
        onEvent: (event) => {
          try {
            const data = JSON.parse(event.data);
            const status = data.result?.status || data.status;

            // console.log(`✨ [Task ID: ${draft.taskId}] 상태 감지:`, status);

            if (status === "SUCCEEDED" || status === "FAILED") {
              void refreshHomeLists();
              controller.abort();
            }
          } catch {}
        },
      }).catch((error) => {
        if (error.name === "AbortError" || error.message?.includes("aborted"))
          return;
      });
    });

    return () => {
      abortControllers.forEach((controller) => controller.abort());
    };
  }, [drafts, refreshHomeLists]);

  const confirmDraftDelete = async () => {
    if (!draftToDelete || isDeletingDraft) return;

    const targetDraft = draftToDelete;
    setIsDeletingDraft(true);

    track("apply_delete_confirmed", {
      mock_apply_id: targetDraft.mockApplyId,
      company: targetDraft.companyName,
      section: "paused",
    });

    try {
      const hasOtherLinkedApplication =
        drafts.some(
          (draft) =>
            draft.id !== targetDraft.id &&
            draft.jobPostingId === targetDraft.jobPostingId &&
            typeof draft.mockApplyId === "number",
        ) ||
        results.some(
          (result) => result.jobPostingId === targetDraft.jobPostingId,
        );

      if (typeof targetDraft.mockApplyId === "number") {
        await deleteMockApply(targetDraft.mockApplyId);
      }

      // 채용 공고 삭제는 연결된 모든 모의지원을 cascade 삭제할 수 있다.
      // 다른 초안/결과가 없는 마지막 항목일 때만 공고까지 정리한다.
      const shouldDeleteJobPosting =
        typeof targetDraft.mockApplyId !== "number" ||
        !hasOtherLinkedApplication;

      if (shouldDeleteJobPosting) {
        await deleteJobPosting(targetDraft.jobPostingId);
      }

      removeFromHomeCache({
        mockApplyId: targetDraft.mockApplyId,
        jobPostingId: shouldDeleteJobPosting
          ? targetDraft.jobPostingId
          : undefined,
      });
      setDraftToDelete(null);
      showToast("작성 중인 모의지원이 삭제되었어요.", "check");
    } catch (error) {
      console.warn("작성 중인 모의지원을 삭제하지 못했습니다.", error);
      setDraftToDelete(null);
      await refreshHomeLists();
      showToast("삭제에 실패했어요. 잠시 후 다시 시도해주세요.", "warning");
    } finally {
      setIsDeletingDraft(false);
    }
  };

  const confirmApplicationDelete = async () => {
    if (!applicationToDelete || isDeletingApplication) return;

    const targetApplication = applicationToDelete;
    setIsDeletingApplication(true);

    track("apply_delete_confirmed", {
      mock_apply_id: targetApplication.mockApplyId,
      company: targetApplication.company,
      section: "completed",
    });

    try {
      const hasOtherLinkedApplication =
        drafts.some(
          (draft) =>
            draft.jobPostingId === targetApplication.jobPostingId &&
            typeof draft.mockApplyId === "number",
        ) ||
        results.some(
          (result) =>
            result.mockApplyId !== targetApplication.mockApplyId &&
            result.jobPostingId === targetApplication.jobPostingId,
        );

      await deleteMockApply(targetApplication.mockApplyId);

      if (!hasOtherLinkedApplication) {
        await deleteJobPosting(targetApplication.jobPostingId);
      }

      removeFromHomeCache({
        mockApplyId: targetApplication.mockApplyId,
        jobPostingId: hasOtherLinkedApplication
          ? undefined
          : targetApplication.jobPostingId,
      });
      setApplicationToDelete(null);
      showToast("모의지원 결과가 삭제되었어요.", "check");
    } catch (error) {
      console.warn("모의지원 결과를 삭제하지 못했습니다.", error);
      setApplicationToDelete(null);
      await refreshHomeLists();
      showToast("삭제에 실패했어요. 잠시 후 다시 시도해주세요.", "warning");
    } finally {
      setIsDeletingApplication(false);
    }
  };

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#F5F6F9]">
      <Lnb className="z-50 shrink-0" />
      <div className="relative z-10 mx-auto flex h-full min-h-0 min-w-0 flex-1 flex-col items-start overflow-x-hidden overflow-y-auto">
        <main className="mx-auto flex-1 w-full max-w-[1320px] min-w-[912px] px-18 pt-12 pb-60">
          <div className="flex items-start justify-between mb-16">
            <div className="flex flex-col gap-2">
              <h1 className="text-[28px] font-bold text-gray-900">
                내 모의지원
              </h1>
              <p className="text-b16-med text-gray-500">
                실제 지원 전에 서류를 점검하고, 통과 가능성을 끌어올려 보세요.
              </p>
            </div>
            <Button
              label="새 모의지원 시작"
              styleType="primary"
              size="large"
              iconType="SPARKLE"
              onClick={() => {
                track("new_apply_clicked");
                clearJobPostingDraft();
                saveSelectedApplyType("MOCK");
                router.push("/mockApply/job/create");
              }}
            />
          </div>

          <div className="flex flex-col gap-16">
            {/* 이어서 작성하기 섹션 */}
            <ResultDraftList
              drafts={drafts}
              onItemClick={(id) => {
                const targetDraft = drafts.find(
                  (draft) => draft.id === String(id),
                );

                if (!targetDraft) return;

                track("paused_apply_resumed", {
                  mock_apply_id: targetDraft.mockApplyId,
                  company: targetDraft.companyName,
                  position: targetDraft.position,
                  status:
                    DRAFT_STATUS_BY_STEP[targetDraft.currentStep] ??
                    "알 수 없음",
                  progress: `${targetDraft.currentStep}/${DRAFT_TOTAL_STEPS}`,
                });

                if (!targetDraft.mockApplyId) {
                  // 검토 페이지와 같은 쿼리로 받아, 이동한 뒤 다시 요청하지 않게 한다.
                  void queryClient
                    .fetchQuery(
                      jobPostingDetailQueryOptions(targetDraft.jobPostingId),
                    )
                    .then((saved) => {
                      saveJobPostingAnalysis({
                        savedToDatabase: true,
                        message: "저장된 채용 공고를 불러왔습니다.",
                        extracted: null,
                        candidates: [],
                        classification: null,
                        generated: null,
                        saved,
                      });
                      router.push(
                        `/mockApply/job/${targetDraft.jobPostingId}/review`,
                      );
                    })
                    .catch((error) => {
                      console.error("채용 공고를 불러오지 못했습니다.", error);
                    });
                  return;
                }

                switch (targetDraft.currentStep) {
                  case 1:
                    router.push(
                      `/mockApply/job/${targetDraft.jobPostingId}/review`,
                    );
                    break;
                  case 2:
                    router.push(
                      `/mockApply/${targetDraft.mockApplyId}?jobPostingId=${targetDraft.jobPostingId}`,
                    );
                    break;
                  case 3:
                    router.push(
                      `/mockApply/${targetDraft.mockApplyId}/result/resume-analysis-loading`,
                    );
                    break;
                  default:
                    router.push(`/mockApply/${id}`);
                }
              }}
              onDelete={(id) => {
                const targetDraft = drafts.find((draft) => draft.id === id);
                if (!targetDraft) return;
                setDraftToDelete(targetDraft);
              }}
            />

            {/* 분석 완료 섹션 */}
            <ResultApplicationList
              applications={results}
              isRetrying={isRetrying}
              onDelete={setApplicationToDelete}
              onRetry={(app) => {
                track("apply_retry_clicked", {
                  mock_apply_id: app.mockApplyId,
                  company: app.company,
                  score: app.score,
                });
                void reApply(app.mockApplyId);
              }}
              onResume={(app) => {
                track("result_apply_viewed", {
                  mock_apply_id: app.mockApplyId,
                  company: app.company,
                  position: app.position,
                  score: app.score,
                  badge_type: resolveBadgeType(app.score),
                  analysis_date: app.createdAt,
                });
                router.push(
                  `/mockApply/${app.mockApplyId}/result?jobPostingId=${app.jobPostingId}`,
                );
              }}
            />
          </div>
        </main>
        {/* 하단 푸터 */}
        <BusinessFooter className="mt-auto items-center bg-[#F5F6F9] [&>div:first-child]:bg-transparent" />
      </div>
      {toast.show && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          position="top"
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}
      {draftToDelete && (
        <ModalOverlay
          onClose={() => {
            if (!isDeletingDraft) setDraftToDelete(null);
          }}
        >
          <ModalNotice
            type="confirmation"
            title="작성 중인 모의지원을 삭제할까요?"
            description="지금까지 작성한 내용이 모두 삭제돼요."
            onClose={() => {
              if (!isDeletingDraft) setDraftToDelete(null);
            }}
            secondaryAction={{
              label: "취소",
              onClick: () => setDraftToDelete(null),
              disabled: isDeletingDraft,
            }}
            primaryAction={{
              label: "삭제하기",
              onClick: () => void confirmDraftDelete(),
              disabled: isDeletingDraft,
            }}
          />
        </ModalOverlay>
      )}
      {applicationToDelete && (
        <ModalOverlay
          onClose={() => {
            if (!isDeletingApplication) setApplicationToDelete(null);
          }}
        >
          <ModalNotice
            type="confirmation"
            title="모의지원 결과를 삭제할까요?"
            description="삭제한 분석 결과는 다시 확인할 수 없어요."
            onClose={() => {
              if (!isDeletingApplication) setApplicationToDelete(null);
            }}
            secondaryAction={{
              label: "취소",
              onClick: () => setApplicationToDelete(null),
              disabled: isDeletingApplication,
            }}
            primaryAction={{
              label: "삭제하기",
              onClick: () => void confirmApplicationDelete(),
              disabled: isDeletingApplication,
            }}
          />
        </ModalOverlay>
      )}
    </div>
  );
}
