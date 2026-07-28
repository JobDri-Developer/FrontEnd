"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/buttons";
import { BusinessFooter } from "@/components/common/footer";
import Lnb from "@/components/common/lnb/Lnb";
import ResultDraftList from "@/components/mockApply/home/ResultDraftList";
import ResultApplicationList from "@/components/mockApply/home/ResultApplicationList";
import {
  deleteMockApply,
  fetchMyMockApplies,
  saveSelectedApplyType,
} from "@/lib/api/mockApplies";
import {
  deleteJobPosting,
  fetchMyJobPosting,
  fetchMyJobPostings,
} from "@/lib/api/jobPostings";
import { saveJobPostingAnalysis } from "@/app/mockApply/job/jobPostingDraftStore";
import { formatRelativeDate } from "@/utils/date";
import type {
  DraftData,
  ApplicationCardData,
} from "@/components/mockApply/home/types";
import { useReApply } from "@/hooks/useReApply";
import { mapMockApplyToApplication } from "@/components/mockApply/home/applicationHomeUtils";
import { Tooltip } from "@/components/common/tooltip";

export default function Home() {
  const router = useRouter();
  const { reApply, isSaving: isRetrying } = useReApply();
  const [drafts, setDrafts] = useState<DraftData[]>([]);
  const [results, setResults] = useState<ApplicationCardData[]>([]);

  useEffect(() => {
    const loadMockApplies = async () => {
      try {
        const [data, fetchedJobPostings] = await Promise.all([
          fetchMyMockApplies({ redirectOnUnauthorized: false }),
          fetchMyJobPostings({ redirectOnUnauthorized: false }).catch(() => []),
        ]);

        const jobPostings = Array.isArray(fetchedJobPostings)
          ? fetchedJobPostings
          : [];

        const inProgressList = data?.inProgress || [];
        const completedList = data?.completed?.content || [];

        const jobPostingById = new Map(
          jobPostings.map((jobPosting) => [
            jobPosting.jobPostingId,
            jobPosting,
          ]),
        );

        // 🌟 작성 중인 모의지원(Drafts) 매핑
        const mappedDrafts: DraftData[] = inProgressList.map((item) => {
          const jobPosting = jobPostingById.get(item.jobPostingId);

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
            currentStep: item.status === "ANSWER_WRITE" ? 2 : 1,
            updatedAt: item.createdAt
              ? formatRelativeDate(item.createdAt)
              : "-",
            createdAtTime: item.createdAt
              ? new Date(item.createdAt).getTime()
              : 0,
          };
        });

        const linkedJobPostingIds = new Set(
          [...inProgressList, ...completedList].map(
            (item) => item.jobPostingId,
          ),
        );

        // 🌟 순수 채용 공고(Drafts) 매핑
        const savedOnlyDrafts: DraftData[] = jobPostings
          .filter(
            (jobPosting) => !linkedJobPostingIds.has(jobPosting.jobPostingId),
          )
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
            updatedAt: jobPosting.createdAt
              ? formatRelativeDate(jobPosting.createdAt)
              : "-",
            createdAtTime: jobPosting.createdAt
              ? new Date(jobPosting.createdAt).getTime()
              : 0,
          }));

        const mappedResults = completedList.map((item) => {
          const jobPosting = jobPostingById.get(item.jobPostingId);

          const cardData = mapMockApplyToApplication(
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

          return cardData;
        });

        const sortedDrafts = [...savedOnlyDrafts, ...mappedDrafts].sort(
          (a, b) => {
            const timeDifference =
              (b.createdAtTime ?? 0) - (a.createdAtTime ?? 0);

            if (timeDifference !== 0) {
              return timeDifference;
            }

            return (
              (b.mockApplyId ?? b.jobPostingId) -
              (a.mockApplyId ?? a.jobPostingId)
            );
          },
        );

        setDrafts(sortedDrafts);
        setResults(mappedResults);
      } catch (error) {
        console.error("데이터를 불러오는데 실패했습니다.", error);
      }
    };

    loadMockApplies();
  }, []);

  const deletePosting = async (jobPostingId: number) => {
    try {
      await deleteJobPosting(jobPostingId);
      setDrafts((current) =>
        current.filter((draft) => draft.jobPostingId !== jobPostingId),
      );
      setResults((current) =>
        current.filter((result) => result.jobPostingId !== jobPostingId),
      );
    } catch (error) {
      console.error("채용 공고를 삭제하지 못했습니다.", error);
    }
  };

  const deleteApplication = async (mockApplyId: number) => {
    try {
      await deleteMockApply(mockApplyId);
      setDrafts((current) =>
        current.filter((draft) => draft.mockApplyId !== mockApplyId),
      );
      setResults((current) =>
        current.filter((result) => result.mockApplyId !== mockApplyId),
      );
    } catch (error) {
      console.error("모의 서류 지원을 삭제하지 못했습니다.", error);
    }
  };
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-[#F5F6F9]">
      <Lnb className="z-50 shrink-0" />
      <div className="relative z-10 mx-auto flex h-full min-h-0 min-w-0 flex-1 flex-col items-center overflow-x-hidden overflow-y-auto">
        <main className="flex-1 w-full max-w-[1320px] min-w-[912px] px-18 pt-12 pb-60">
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

                if (!targetDraft.mockApplyId) {
                  void fetchMyJobPosting(targetDraft.jobPostingId)
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

                if (typeof targetDraft.mockApplyId === "number") {
                  void deleteApplication(targetDraft.mockApplyId);
                } else {
                  void deletePosting(targetDraft.jobPostingId);
                }
              }}
            />

            {/* 분석 완료 섹션 */}
            <ResultApplicationList
              applications={results}
              isRetrying={isRetrying}
              onDelete={(app) => void deleteApplication(app.mockApplyId)}
              onRetry={(app) => void reApply(app.mockApplyId)}
              onResume={(app) => {
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
    </div>
  );
}
