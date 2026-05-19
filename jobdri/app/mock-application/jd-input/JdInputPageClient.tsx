"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/header/Header";
import { Footer } from "@/components/common/footer";
import { Method1Card, Method2Card } from "@/components/common/cards";
import { ModalInput } from "@/components/common/modal";

type JdInputMethod = "link" | "image" | "manual";

export default function JdInputPageClient() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<JdInputMethod | null>(
    null,
  );
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [jdLink, setJdLink] = useState("");

  const handleCtaClick = () => {
    if (selectedMethod === "link") {
      setIsLinkModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-line-neutral-assistive px-6 py-6">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] w-[1280px] flex-col">
        <Header
          currentStep={2}
          leftAction={{
            label: "돌아가기",
            iconType: "HOME_S",
            onClick: () => router.push("/"),
          }}
        />

        <section className="flex flex-1 flex-col items-center gap-8 self-stretch bg-bg-default px-[82px] pt-8 pb-20">
          <div className="flex w-[1116px] max-w-[1440px] flex-col items-center gap-8">
            <div className="flex w-[1116px] flex-col items-start gap-3">
              <div className="flex items-center justify-between self-stretch px-4">
                <h2 className="w-full text-center text-h24-bold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                  공고 내용 입력 방식으로 선택해 주세요
                </h2>
              </div>
            </div>

            <div className="flex w-[1116px] flex-col items-center gap-3">
              <div className="flex w-[1116px] items-center justify-center gap-3">
                <Method1Card
                  label="링크 붙여넣기"
                  iconType="LINK"
                  selected={selectedMethod === "link"}
                  onClick={() =>
                    setSelectedMethod((prevSelectedMethod) =>
                      prevSelectedMethod === "link" ? null : "link",
                    )
                  }
                />
                <Method1Card
                  label="이미지 업로드하기"
                  iconType="UPLOAD"
                  selected={selectedMethod === "image"}
                  onClick={() =>
                    setSelectedMethod((prevSelectedMethod) =>
                      prevSelectedMethod === "image" ? null : "image",
                    )
                  }
                />
              </div>

              <Method2Card
                label="직접 작성하기"
                selected={selectedMethod === "manual"}
                onClick={() =>
                  setSelectedMethod((prevSelectedMethod) =>
                    prevSelectedMethod === "manual" ? null : "manual",
                  )
                }
              />
            </div>
          </div>
        </section>

        <Footer
          backAction={{ onClick: () => router.push("/apply-type") }}
          ctaAction={{
            label: "선택하기",
            disabled: selectedMethod === null,
            onClick: handleCtaClick,
          }}
        />
      </div>

      {isLinkModalOpen && (
        <ModalInput
          type="actionModal"
          value={jdLink}
          onChange={setJdLink}
          onSubmit={() => undefined}
          onClose={() => setIsLinkModalOpen(false)}
          title="공고 링크를 입력해주세요."
          description="링크 내용이 부적절한 경우 제대로 추출되지 않을 수 있습니다."
          placeholder="https://www.com"
          showInputField
          showDescription
          showLoadMotion={false}
        />
      )}
    </div>
  );
}
