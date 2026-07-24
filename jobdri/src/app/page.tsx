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
import { formatDate } from "@/utils/date";
import {
  DraftData,
  ApplicationCardData,
} from "@/components/mockApply/home/types";
import { useReApply } from "@/hooks/useReApply";

// const DUMMY_DRAFTS = [
//   {
//     id: "1",
//     companyName: "네이버",
//     position: "UXUI 디자이너",
//     currentStep: 1,
//     updatedAt: "오늘",
//   },
//   {
//     id: "2",
//     companyName: "당근마켓",
//     position: "그로스 프로덕트 디자이너",
//     currentStep: 2,
//     updatedAt: "어제",
//   },
//   {
//     id: "3",
//     companyName: "현대자동차",
//     position: "모델링 디자이너",
//     currentStep: 3,
//     updatedAt: "오늘",
//   },
// ];

// const DUMMY_RESULTS = Array.from({ length: 12 }).map((_, i) => ({
//   id: i, // string("result-0")에서 number(i)로 변경!
//   jobPostingId: i,
//   mockApplyId: i,
//   company: "토스",
//   position: "프로덕트 디자이너(인턴)",
//   createdAt: "YY.MM.DD",
//   score: 85,
//   version: 1,
//   status: "completed",
// }));

export default function Home() {
  const router = useRouter();
  const { reApply } = useReApply();
  const [drafts, setDrafts] = useState<DraftData[]>([]);
  const [results, setResults] = useState<ApplicationCardData[]>([]);

  useEffect(() => {
    const loadMockApplies = async () => {
      try {
        const [data, jobPostings] = await Promise.all([
          fetchMyMockApplies({ redirectOnUnauthorized: false }),
          fetchMyJobPostings({ redirectOnUnauthorized: false }).catch(() => []),
        ]);
        const jobPostingById = new Map(
          jobPostings.map((jobPosting) => [
            jobPosting.jobPostingId,
            jobPosting,
          ]),
        );

        const mappedDrafts = data.inProgress.map((item) => {
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
            updatedAt: formatDate(item.createdAt),
          };
        });
        const linkedJobPostingIds = new Set(
          [...data.inProgress, ...data.completed].map(
            (item) => item.jobPostingId,
          ),
        );
        const savedOnlyDrafts = jobPostings
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
            updatedAt: "-",
          }));

        const mappedResults = data.completed.map((item) => {
          const jobPosting = jobPostingById.get(item.jobPostingId);

          return {
            id: item.mockApplyId,
            jobPostingId: item.jobPostingId,
            mockApplyId: item.mockApplyId,
            company:
              item.companyName || jobPosting?.companyName || "회사명 미입력",
            profileColor: jobPosting?.profileColor ?? "DEFAULT",
            position:
              item.jobTitle ||
              jobPosting?.jobTitle ||
              item.detailClassificationName ||
              jobPosting?.detailClassificationName ||
              "직무 미지정",
            createdAt: formatDate(item.createdAt),
            score: item.score || 0,
            version: item.sequence ?? 1,
            status: "completed",
          };
        });
        setDrafts([...savedOnlyDrafts, ...mappedDrafts]);
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
    <div className="flex min-h-screen w-full bg-[#F5F6F9] overflow-x-hidden ">
      <Lnb className="shrink-0 z-50" />
      <div className="z-10 flex min-w-0 h-screen flex-1 flex-col self-stretch relative mx-auto items-center">
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
                      router.push("/mockApply/job/review");
                    })
                    .catch((error) => {
                      console.error("채용 공고를 불러오지 못했습니다.", error);
                    });
                  return;
                }

                switch (targetDraft.currentStep) {
                  case 1:
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

        {/* 3. 하단 푸터 */}
        <BusinessFooter className="mt-auto items-center bg-[#F5F6F9] [&>div:first-child]:bg-transparent" />
      </div>
    </div>
  );
}
