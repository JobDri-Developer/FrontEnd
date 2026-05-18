"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Header from "@/components/common/header/Header";
import { Footer } from "@/components/common/footer";
import { ApplyOptionCard } from "@/components/common/cards";

type ApplyType = "real" | "virtual";

const applyTypes: Array<{
  id: ApplyType;
  title: string;
  description: string;
}> = [
  {
    id: "real",
    title: "실제 공고 지원",
    description: "실제 공고 내용을 분석해\n맞춤형 피드백을 제공합니다.",
  },
  {
    id: "virtual",
    title: "가상 공고 지원",
    description: "과거 공고를 기반으로\n모의 서류 평가를 제공합니다.",
  },
];

export default function ApplyTypePageClient() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<ApplyType | null>(null);
  const [hoveredType, setHoveredType] = useState<ApplyType | null>(null);

  return (
    <div className="min-h-screen bg-line-neutral-assistive px-6 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-[1280px] flex-col">
        <Header
          currentStep={1}
          leftAction={{
            label: "돌아가기",
            iconType: "HOME_S",
            onClick: () => router.push("/"),
          }}
        />

        <section className="flex flex-1 flex-col items-center justify-center gap-8 self-stretch bg-bg-default px-[82px] pt-8 pb-20">
          <div className="flex max-w-[1440px] flex-col items-center gap-8 self-stretch">
            <h2 className="text-center text-h24-bold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
              유형을 선택해주세요.
            </h2>

            <div className="flex items-start gap-3 self-stretch">
              {applyTypes.map((applyType) => {
                const isSelected = selectedType === applyType.id;
                const isHovered = hoveredType === applyType.id;
                const isDisabled =
                  hoveredType !== null
                    ? !isHovered
                    : selectedType !== null && !isSelected;

                return (
                  <ApplyOptionCard
                    key={applyType.id}
                    title={applyType.title}
                    description={applyType.description}
                    selected={isSelected}
                    disabled={isDisabled}
                    onMouseEnter={() => setHoveredType(applyType.id)}
                    onMouseLeave={() => setHoveredType(null)}
                    onClick={() => setSelectedType(applyType.id)}
                    className={clsx(
                      "!w-auto flex-1",
                      isHovered && "bg-fill-quaternary-default shadow-hover",
                    )}
                  />
                );
              })}
            </div>
          </div>
        </section>

        <Footer
          hideBackAction
          ctaAction={{
            label: "선택하기",
            disabled: selectedType === null,
          }}
        />
      </div>
    </div>
  );
}
