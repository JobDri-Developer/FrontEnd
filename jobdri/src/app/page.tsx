"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/common/buttons";
import { BusinessFooter } from "@/components/common/footer";
import { Lnb } from "@/components/common/lnb";
import ResultDraftList from "@/components/mockApply/home/ResultDraftList";
import ResultApplicationList from "@/components/mockApply/home/ResultApplicationList";

const DUMMY_DRAFTS = [
  {
    id: "1",
    companyName: "네이버",
    position: "UXUI 디자이너",
    currentStep: 1,
    updatedAt: "오늘",
  },
  {
    id: "2",
    companyName: "당근마켓",
    position: "그로스 프로덕트 디자이너",
    currentStep: 2,
    updatedAt: "어제",
  },
  {
    id: "3",
    companyName: "현대자동차",
    position: "모델링 디자이너",
    currentStep: 3,
    updatedAt: "오늘",
  },
];

const DUMMY_RESULTS = Array.from({ length: 12 }).map((_, i) => ({
  id: i, // string("result-0")에서 number(i)로 변경!
  jobPostingId: i,
  mockApplyId: i,
  company: "토스",
  position: "프로덕트 디자이너(인턴)",
  createdAt: "YY.MM.DD",
  score: 85,
  version: 1,
  status: "completed",
}));

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen w-full bg-[#F5F6F9] overflow-x-hidden ">
      <Lnb className="shrink-0" />
      <div className="flex min-w-0 h-screen flex-1 flex-col self-stretch relative mx-auto items-center">
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
              onClick={() => router.push("/mockApply/apply-type")}
            />
          </div>

          <div className="flex flex-col gap-16">
            {/* 이어서 작성하기 섹션 */}
            <ResultDraftList
              drafts={DUMMY_DRAFTS}
              onItemClick={(id) => console.log(id)}
              onDelete={(id) => console.log(id)}
            />

            {/* 분석 완료 섹션 */}
            <ResultApplicationList
              applications={DUMMY_RESULTS}
              onDelete={(app) => console.log(app.id, "삭제")}
              onRetry={(app) => console.log(app.id, "다시하기")}
              onResume={(app) => console.log(app.id, "결과보기")}
            />
          </div>
        </main>

        {/* 3. 하단 푸터 */}
        <BusinessFooter className="mt-auto items-center bg-[#F5F6F9] [&>div:first-child]:bg-transparent" />
      </div>
    </div>
  );
}
