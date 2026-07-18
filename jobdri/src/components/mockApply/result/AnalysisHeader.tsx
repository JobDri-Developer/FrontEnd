"use client";

import TabMenu from "@/components/common/tabs/TabMenu";

const analysisTabs = [
  { id: "ai-feedback", label: "AI 피드백" },
  { id: "score-detail", label: "채점 상세" },
];

export default function AnalysisHeader() {
  return (
    <section className="flex flex-col items-center gap-2 self-stretch rounded-card-l bg-fill-quaternary-assistive px-16 pt-10 pb-0">
      <div className="flex w-full max-w-[1320px] flex-col items-start gap-2 self-stretch">
        <div className="flex flex-col items-start self-stretch px-1">
          <h1 className="text-h24-bold tracking-normal text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
            자기소개서 분석 결과
          </h1>
        </div>

        <div className="flex flex-col items-start self-stretch px-1">
          <TabMenu tabs={analysisTabs} style="NORMAL" size="M" />
        </div>
      </div>
    </section>
  );
}
