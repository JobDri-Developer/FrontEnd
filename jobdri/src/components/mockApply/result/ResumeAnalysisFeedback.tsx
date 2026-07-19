"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CtaFooter } from "@/components/common/cta";
import Divider from "@/components/common/Divider";
import Icon from "@/components/common/icons/Icon";
import {
  LnbScrollbar,
  lnbHiddenScrollbarClass,
  useLnbScrollMetrics,
} from "@/components/common/lnb/LnbScrollbar";
import { ModalNotice } from "@/components/common/modal";
import TabMenu from "@/components/common/tabs/TabMenu";
import { Toast } from "@/components/common/toast";
import Evaluation from "@/components/mockApply/result/Evaluation";
import ScoreBar from "@/components/mockApply/result/ScoreBar";
import ScoreCircle from "@/components/mockApply/result/ScoreCircle";
import { useReApply } from "@/hooks/useReApply";
import { getMockApplyResumeRecords } from "@/lib/api/mockApplies";

interface ResumeAnalysisFeedbackProps {
  mockApplyId?: number;
  sequence?: number;
  children?: React.ReactNode; // 추가된 부분: AnalysisHeader 등을 받기 위함
}

const scoreItems = [
  { label: "직무 적합성", score: 86, tone: "primary" },
  { label: "정량적 성과", score: 72, tone: "danger" },
  { label: "논리 구조", score: 86, tone: "primary" },
] as const;

const reviewTabs = [
  { id: "strengths", label: "핵심 강점" },
  { id: "weaknesses", label: "핵심 약점" },
];

const strengthEvaluations = [
  {
    content: "직무 연관 경험이 명확하게 드러나요",
    quote:
      '"UX 리서치를 통해 핵심 불편 지점을 발굴하고, 이를 기능 개선으로 연결한 경..."',
  },
  {
    content: "수치 기반 성과 서술이 신뢰감을 줘요",
    quote:
      '"리텐션율 23% 개선, MAU 15% 증가라는 정량적 결과를 이끌어낸 경험이..."',
  },
];

const weaknessEvaluations = [
  {
    content: "멘트 더미텍스트입니다. 최대 한 줄",
    quote:
      "자소서 본문 인용 더미텍스트입니다. 최대 한 줄, 자소서 본문 인용 더미텍스트...",
  },
  {
    content: "멘트 더미텍스트입니다. 최대 한 줄",
    quote:
      "자소서 본문 인용 더미텍스트입니다. 최대 한 줄, 자소서 본문 인용 더미텍스트...",
  },
];

function ScoreSummaryIcon() {
  return (
    <span className="flex h-5 w-5 shrink-0" aria-hidden="true">
      <Icon type="SCORE_20" className="h-5 w-5" />
    </span>
  );
}

function ReviewSummaryIcon() {
  return (
    <span className="flex h-5 w-5 shrink-0" aria-hidden="true">
      <Icon type="REVIEW_20" className="h-5 w-5" />
    </span>
  );
}

function ScoreMetricRow({
  label,
  score,
  tone,
}: {
  label: string;
  score: number;
  tone: "primary" | "danger";
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 self-stretch">
      <span className="w-[92px] shrink-0 text-sub14-med tracking-normal text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
        {label}
      </span>
      <ScoreBar
        score={score}
        tone={tone}
        className="h-2.5 min-w-0 max-w-[400px]"
      />
      <div className="flex w-[72px] shrink-0 items-baseline justify-end gap-0.5">
        <span className="text-label14-semibold tracking-normal text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
          {score}
        </span>
        <span className="text-cap12-med tracking-normal text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
          / 100점
        </span>
      </div>
    </div>
  );
}

function ScoreSummaryCard() {
  return (
    <article
      className="flex [flex:1_0_0] flex-col items-start gap-3 rounded-card-l bg-bg-contents-default px-6 pt-4 pb-7"
      style={{ minWidth: "min(580px, calc(100% - 372px))" }}
    >
      <div className="flex h-9 items-center gap-2 self-stretch pl-1">
        <ScoreSummaryIcon />
        <span className="flex-1 text-label14-semibold tracking-normal text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
          총점
        </span>
      </div>

      <Divider className="bg-line-neutral-default" />

      <div className="flex flex-col justify-end gap-4 self-stretch">
        <div className="flex items-center gap-12 self-stretch px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <ScoreCircle score={86} size="medium" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
            {scoreItems.map((item) => (
              <ScoreMetricRow
                key={item.label}
                label={item.label}
                score={item.score}
                tone={item.tone}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 self-stretch rounded-card-result bg-fill-quaternary-assistive px-5 py-4">
          <div className="flex items-center gap-1 self-stretch">
            <Icon
              type="SPARKLE"
              className="h-6 w-6 shrink-0 text-icon-primary-default"
            />
            <h2 className="text-b16-semibold tracking-normal text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
              강점이 잘 드러나고 있어요
            </h2>
          </div>

          <div className="flex flex-col items-start self-stretch">
            <p className="self-stretch text-justify text-sub14-reg tracking-normal text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
              직무 적합성과 정량적 성과는 강하지만, 회사·직무에 대한 구체적
              이해와 본인만의 차별점이 더 드러나면 통과 가능성이 한 단계
              올라가요. 지원 동기와 입사 후 기여 방향을 좀 더 구체적으로
              서술하면 설득력이 높아집니다.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function ReviewSummaryCard() {
  const [activeTabId, setActiveTabId] = useState(reviewTabs[0].id);
  const isStrengthTab = activeTabId === "strengths";
  const evaluations = isStrengthTab ? strengthEvaluations : weaknessEvaluations;

  return (
    <aside
      className="flex min-w-[360px] max-w-[480px] [flex:1_0_0] flex-col items-start justify-between self-stretch rounded-card-l bg-bg-contents-default px-6 pt-4 pb-7"
      aria-label="총평"
    >
      <div className="flex h-9 items-center gap-2 self-stretch pl-1">
        <ReviewSummaryIcon />
        <span className="flex-1 text-label14-semibold tracking-normal text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
          총평
        </span>
        <TabMenu
          tabs={reviewTabs}
          style="STRONG"
          size="S"
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
        />
      </div>

      <div className="flex flex-col items-start gap-5 self-stretch pb-1">
        {evaluations.map((evaluation, index) => (
          <Evaluation
            key={`${activeTabId}-${index}`}
            rating={isStrengthTab ? "good" : "bad"}
            content={evaluation.content}
            quote={evaluation.quote}
          />
        ))}
      </div>
    </aside>
  );
}

export default function ResumeAnalysisFeedback({
  mockApplyId,
  sequence,
  children, // 부모로부터 전달받은 컴포넌트
}: ResumeAnalysisFeedbackProps) {
  const { scrollAreaRef, scrollbarMetrics, updateScrollbarMetrics } =
    useLnbScrollMetrics<HTMLElement>(true, "resume-analysis-feedback");

  return (
    <>
      <div className="relative flex min-h-0 flex-1 items-stretch self-stretch overflow-visible">
        <main
          ref={scrollAreaRef}
          onScroll={updateScrollbarMetrics}
          className={`flex min-h-0 flex-1 items-start justify-center self-stretch overflow-y-auto overflow-x-hidden px-2 pb-0 ${lnbHiddenScrollbarClass}`}
        >
          <div className="flex w-full items-start justify-center self-stretch px-2 pb-0">
            <div className="flex flex-1 flex-col items-center p-0">
              {/* 기존 AnalysisHeader가 있던 위치에 children을 렌더링 */}
              {children}

              <section className="flex items-center justify-center gap-3 self-stretch rounded-card-l bg-fill-quaternary-assistive px-16 pt-8 pb-[120px]">
                <div className="mx-auto flex w-full max-w-[1320px] items-center gap-3 self-stretch">
                  <ScoreSummaryCard />
                  <ReviewSummaryCard />
                </div>
              </section>
            </div>
          </div>
        </main>

        <LnbScrollbar
          metrics={scrollbarMetrics}
          size="l"
          className="inset-y-0 right-0 z-20 items-end"
        />
      </div>
    </>
  );
}
