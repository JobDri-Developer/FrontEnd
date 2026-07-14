"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Header from "@/components/common/header/Header";
import { Footer } from "@/components/common/footer";
import { ApplyOptionCard } from "@/components/common/cards";
import { saveSelectedApplyType } from "@/lib/api/mockApplies";

type ApplyType = "real" | "virtual";

const applyTypes: Array<{
  id: ApplyType;
  title: string;
  description: string;
  disabled?: boolean;
}> = [
  {
    id: "real",
    title: "실제 공고 지원",
    description: "실제 공고 내용을 분석해\n맞춤형 피드백을 제공합니다.",
  },
  {
    id: "virtual",
    title: "가상 공고 지원",
    description: "가상 공고 지원은\n아직 준비 중입니다.",
    disabled: true,
  },
];

export default function ApplyTypePageClient() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<ApplyType | null>(null);
  const [hoveredType, setHoveredType] = useState<ApplyType | null>(null);

  const handleSubmit = () => {
    if (selectedType === "real") {
      saveSelectedApplyType("ACTUAL");
      router.push("/apply/virtual/new/jd-input");
      return;
    }

    if (selectedType === "virtual") {
      setSelectedType(null);
    }
  };

  return (
    <div className="h-dvh overflow-hidden bg-line-neutral-assistive px-6 pt-6">
      <div className="mx-auto flex h-full w-[1280px] flex-col">
        <Header
          type="apply"
          currentStep={1}
          leftAction={{
            label: "돌아가기",
            iconType: "HOME_S",
          }}
        />

        <section className="flex min-h-0 flex-1 flex-col items-center justify-start gap-8 self-stretch overflow-hidden bg-bg-default px-[82px] pt-8 pb-20">
          <div className="flex max-w-[1440px] flex-col items-center gap-8 self-stretch">
            <h2 className="text-center text-h24-bold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
              유형을 선택해주세요.
            </h2>

            <div className="flex items-start gap-3 self-stretch">
              {applyTypes.map((applyType) => {
                const isSelected = selectedType === applyType.id;
                const isHovered = hoveredType === applyType.id;
                const isUnavailable = applyType.disabled === true;
                const isDisabled =
                  isUnavailable ||
                  (hoveredType !== null
                    ? !isHovered
                    : selectedType !== null && !isSelected);

                return (
                  <ApplyOptionCard
                    key={applyType.id}
                    title={applyType.title}
                    description={applyType.description}
                    selected={isSelected}
                    disabled={isDisabled}
                    onMouseEnter={() => {
                      if (!isUnavailable) {
                        setHoveredType(applyType.id);
                      }
                    }}
                    onMouseLeave={() => setHoveredType(null)}
                    onClick={() =>
                      !isUnavailable &&
                      setSelectedType((prevSelectedType) =>
                        prevSelectedType === applyType.id
                          ? null
                          : applyType.id,
                      )
                    }
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
            onClick: handleSubmit,
          }}
        />
      </div>
    </div>
  );
}
