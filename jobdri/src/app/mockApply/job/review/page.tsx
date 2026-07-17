"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/header/Header";
import SideHeaderContainer from "@/components/common/header/SideHeaderContainer";
import {
  LnbScrollbar,
  lnbHiddenScrollbarClass,
  useLnbScrollMetrics,
} from "@/components/common/lnb/LnbScrollbar";
import { CtaFooter } from "@/components/common/cta";
import { JDInput } from "@/components/common/input";
import Avatar from "@/components/mockApply/home/Avatar";

const wizardSteps = [
  { label: "공고 확인" },
  { label: "자소서 입력" },
  { label: "첨삭 결과" },
];

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex min-w-[600px] max-w-[1000px] self-stretch flex-col items-start gap-6 rounded-card bg-bg-contents-default px-5 pt-6 pb-7">
      <div className="flex items-center justify-center gap-2.5 px-1">
        <h2 className="text-[18px] leading-[26px] font-semibold tracking-[-0.36px] text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
          {title}
        </h2>
      </div>

      <div className="flex self-stretch flex-col items-start gap-1">
        {children}
      </div>
    </section>
  );
}

function JobProfileRow() {
  return (
    <div className="flex w-full items-start gap-8 px-2 py-5">
      <div className="flex w-[200px] shrink-0 flex-col items-start justify-center gap-1">
        <div className="flex items-center gap-1.5 self-stretch">
          <span className="text-b16-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
            공고 프로필
          </span>
          <svg
            aria-hidden="true"
            className="h-[5px] w-[5px] shrink-0"
            viewBox="0 0 5 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="2.5"
              cy="2.5"
              r="2"
              fill="var(--color-fill-system-fail-strong)"
              stroke="#FF4242"
            />
          </svg>
        </div>

        <span className="text-cap12-med text-text-neutral-disabled [font-feature-settings:'liga'_off,'clig'_off]">
          이 공고의 프로필 색상을 선택해 주세요.
        </span>
      </div>

      <div className="flex flex-1 items-start py-0.5">
        <Avatar
          name="토"
          type="company"
          size="large"
          isEditable
          className="!h-11 !w-11"
        />
      </div>
    </div>
  );
}

export default function JobPostingReviewPage() {
  const router = useRouter();
  const { scrollAreaRef, scrollbarMetrics, updateScrollbarMetrics } =
    useLnbScrollMetrics(true, "job-posting-review", { trackPadding: 28 });

  return (
    <div className="h-dvh overflow-hidden bg-line-neutral-assistive">
      <div className="flex h-dvh w-dvw flex-col bg-bg-white">
        <Header
          companyName="토스"
          jobTitle="프로덕트 디자이너"
          applicationLabel="첫 번째 지원"
          currentStep={1}
          steps={wizardSteps}
          lastSavedAt="17:00"
          className="shrink-0"
        />

        <div className="relative flex min-h-0 w-full flex-1 items-stretch overflow-visible px-2 pb-0">
          <div
            ref={scrollAreaRef}
            onScroll={updateScrollbarMetrics}
            className={`flex min-h-0 w-full flex-1 items-start justify-center overflow-y-auto overflow-x-hidden ${lnbHiddenScrollbarClass}`}
          >
            <div className="flex min-h-0 flex-1 items-start justify-center self-stretch rounded-card-l bg-fill-quaternary-assistive">
              <main className="flex flex-1 items-start justify-between">
                <SideHeaderContainer
                  leading={1}
                  title="공고 내용을 확인해주세요."
                  subtitle="입력해 준 내용을 바탕으로 AI가 자동으로 추출한 정보예요. 고치고 싶은 부분이 있다면 수정 버튼을 눌러 원하는 내용을 입력해주세요."
                  element={<></>}
                  className="shrink-0 self-stretch"
                />

                <div className="flex [flex:1_0_0] flex-col items-start gap-3 pt-16 pr-[72px] pl-20">
                  <SectionCard title="공고 정보 편집">
                    <JobProfileRow />
                    <JDInput
                      label="공고명"
                      description="이 공고의 이름이에요."
                      type="company"
                      className="!w-full"
                    />
                    <JDInput
                      label="회사명"
                      description="채용 공고를 올린 회사예요."
                      type="company"
                      className="!w-full"
                    />
                  </SectionCard>

                  <SectionCard title="직무 정보">
                    <JDInput type="role" className="!w-full" />
                    <JDInput
                      type="task"
                      description="이 직무에서 담당할 업무예요."
                      className="!w-full"
                    />
                  </SectionCard>

                  <SectionCard title="채용 기준">
                    <JDInput type="qualification" className="!w-full" />
                    <JDInput type="prefer" className="!w-full" />
                  </SectionCard>

                  <div aria-hidden="true" className="h-[108px] shrink-0" />
                </div>
              </main>
            </div>
          </div>
          <LnbScrollbar
            metrics={scrollbarMetrics}
            size="l"
            className="!top-[10px] !right-1 !bottom-[10px] z-10"
          />
        </div>

        <CtaFooter
          type="wizard"
          className="!w-full shrink-0"
          backAction={{
            label: "이전으로",
            onClick: () => router.push("/mockApply/job/create"),
          }}
          nextAction={{
            label: "다음으로",
            disabled: true,
          }}
        />
      </div>
    </div>
  );
}
