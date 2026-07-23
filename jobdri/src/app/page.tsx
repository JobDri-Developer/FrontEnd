"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/buttons";
import { BusinessFooter } from "@/components/common/footer";
import Lnb from "@/components/common/lnb/Lnb";
import ResultDraftList from "@/components/mockApply/home/ResultDraftList";
import ResultApplicationList from "@/components/mockApply/home/ResultApplicationList";
import { fetchMyMockApplies } from "@/lib/api/mockApplies";
import { formatDate } from "@/utils/date";
import {
  DraftData,
  ApplicationCardData,
} from "@/components/mockApply/home/types";

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
  const [drafts, setDrafts] = useState<DraftData[]>([]);
  const [results, setResults] = useState<ApplicationCardData[]>([]);

  useEffect(() => {
    const loadMockApplies = async () => {
      try {
        const data = await fetchMyMockApplies();

        const mappedDrafts = data.inProgress.map((item) => ({
          id: String(item.mockApplyId),
          companyName: item.companyName,
          position:
            item.jobTitle || item.detailClassificationName || "직무 미지정",
          currentStep: item.status === "ANSWER_WRITE" ? 2 : 1,
          updatedAt: formatDate(item.createdAt),
        }));

        const mappedResults = data.completed.map((item) => ({
          id: item.mockApplyId,
          jobPostingId: item.jobPostingId,
          mockApplyId: item.mockApplyId,
          company: item.companyName,
          position:
            item.jobTitle || item.detailClassificationName || "직무 미지정",
          createdAt: formatDate(item.createdAt),
          score: item.score || 0,
          version: item.version || 1,
          status: "completed",
        }));
        setDrafts(mappedDrafts);
        setResults(mappedResults);
      } catch (error) {
        console.error("데이터를 불러오는데 실패했습니다.", error);
      }
    };

    loadMockApplies();
  }, []);
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
              onClick={() => router.push("/mockApply/job/create")}
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

                switch (targetDraft.currentStep) {
                  case 1:
                    // 1단계 (공고 확인/질문 선택)에서 멈췄을 때
                    router.push(`/mockApply/question-select/${id}`);
                    break;
                  case 2:
                    // 2단계 (자소서 작성)에서 멈췄을 때
                    router.push(`/mockApply/${id}`);
                    break;
                  case 3:
                    // 3단계 (채점 중)일 때 (보통 대기 화면이나 결과 화면으로)
                    router.push(`/mockApply/grading/${id}`);
                    break;
                  default:
                    router.push(`/mockApply/${id}`);
                }
              }}
              onDelete={(id) => console.log(id)}
            />

            {/* 분석 완료 섹션 */}
            <ResultApplicationList
              applications={results}
              onDelete={(app) => console.log(app.id, "삭제")}
              onRetry={(app) => {
                router.push(`/mockApply/retry/${app.jobPostingId}`);
              }}
              onResume={(app) => {
                // 예시: 결과 상세 페이지로 이동!
                router.push(`/mockApply/${app.mockApplyId}/result`);
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
