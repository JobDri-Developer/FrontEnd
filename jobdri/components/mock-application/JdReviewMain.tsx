"use client";

import { useState } from "react";
import { ProgressSidebar } from "@/components/common/progress";
import { InputAutoGrow } from "@/components/common/input";

export interface JdReviewSection {
  id: string;
  label: string;
  value: string;
}

export const mockJdSections: JdReviewSection[] = [
  {
    id: "job",
    label: "직무",
    value: "리더십/조직개발 기업교육 컨설턴트 (HRD)",
  },
  {
    id: "main-task",
    label: "주요 업무",
    value:
      "기업 및 공공부문 및 교육 컨설팅\n- 기업 및 공공부문(B2B, B2G) 교육 컨설팅\n- 고객 니즈 기반 맞춤형 교육 솔루션 기획/제안\n- 제안서 작성, 고객사 미팅 비딩, 프레젠테이션\n- 리더십/조직개발/AI 트렌드 기반 콘텐츠 연구",
  },
  {
    id: "qualification",
    label: "자격요건",
    value:
      "2) 교육 운영 및 커뮤니케이션\n- 고객사 요청 프로젝트 일정 품질 관리(PM)\n- 현장 운영·사후 리포트·만족도 관리\n- 고객-강사-참여 및 커뮤니케이션 등\n\n3) 교육 콘텐츠 기획\n- 교육 자료 교안 구성·활동 설계 및 콘텐츠 리패키징(교육 콘텐츠 기획 및 설계)\n- 진단 및 학습도구(리더십 진단, 업무성향 진단 등)를 활용한 교육 프로그램 개발\n- 교수설계·학습경험 설계에 대한 이해와 관심",
  },
  {
    id: "preference",
    label: "우대사항",
    value:
      "- 공공기관(B2G) 교육사업 입찰 및 사업 경험자 우대\n- HRD·리더십 교육 분야에 대한 이해 필수\n- 문제 정의, 기획력, 대안 제시 능력이 뛰어난 사람\n- AI 기반 업무생산성 도구, 파워포인트를 포함한 MS Office 활용 능력",
  },
];

function JdFieldLabel({ label }: { label: string }) {
  return (
    <div className="flex h-[29px] items-center self-stretch py-1 pr-0 pl-0.5">
      <h3 className="min-w-0 truncate text-b16-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
        {label}
      </h3>
    </div>
  );
}

function JdReviewField({
  section,
  onChange,
}: {
  section: JdReviewSection;
  onChange: (value: string) => void;
}) {
  return (
    <section
      id={section.id}
      className="flex scroll-mt-8 flex-col items-center justify-center gap-8 self-stretch rounded-card-l bg-fill-quaternary-default px-7 pt-6 pb-7 shadow-card"
    >
      <div className="flex flex-col items-start gap-2 self-stretch">
        <JdFieldLabel label={section.label} />

        <InputAutoGrow
          value={section.value}
          onChange={onChange}
          maxHeight={168}
          className="w-full min-w-0"
        />
      </div>
    </section>
  );
}

export default function JdReviewMain({
  sections: initialSections = mockJdSections,
}: {
  sections?: JdReviewSection[];
}) {
  const [sections, setSections] = useState(initialSections);
  const sidebarItems = sections.map(({ id, label }) => ({ id, label }));

  const updateSectionValue = (id: string, value: string) => {
    setSections((currentSections) =>
      currentSections.map((section) =>
        section.id === id ? { ...section, value } : section,
      ),
    );
  };

  return (
    <main className="flex items-start gap-6 self-stretch">
      <div className="flex flex-1 flex-col items-start gap-3 self-stretch">
        <div className="flex flex-1 flex-col items-start gap-3 self-stretch">
          {sections.map((section) => (
            <JdReviewField
              key={section.id}
              section={section}
              onChange={(value) => updateSectionValue(section.id, value)}
            />
          ))}
        </div>
      </div>

      <ProgressSidebar
        items={sidebarItems}
        defaultActiveId={sections[0]?.id}
        className="sticky top-6 h-auto shrink-0"
      />
    </main>
  );
}
