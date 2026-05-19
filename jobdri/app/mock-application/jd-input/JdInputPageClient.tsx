"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/header/Header";
import { Footer } from "@/components/common/footer";
import { Method1Card, Method2Card } from "@/components/common/cards";
import { ModalInput } from "@/components/common/modal";

type JdInputMethod = "link" | "image" | "manual";
type LinkModalStep = "input" | "reading" | "failed";

function isUrlFormat(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue || /\s/.test(trimmedValue)) {
    return false;
  }

  const valueWithProtocol = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  try {
    const url = new URL(valueWithProtocol);

    return (
      ["http:", "https:"].includes(url.protocol) && url.hostname.includes(".")
    );
  } catch {
    return false;
  }
}

export default function JdInputPageClient() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<JdInputMethod | null>(
    null,
  );
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkModalStep, setLinkModalStep] = useState<LinkModalStep>("input");
  const [jdLink, setJdLink] = useState("");
  const hasLinkText = jdLink.trim().length > 0;

  const handleCtaClick = () => {
    if (selectedMethod === "link") {
      setLinkModalStep("input");
      setIsLinkModalOpen(true);
    }
  };

  const closeLinkModal = () => {
    setIsLinkModalOpen(false);
  };

  const resetToUploadStart = () => {
    setIsLinkModalOpen(false);
    setLinkModalStep("input");
    setSelectedMethod(null);
    setJdLink("");
  };

  const submitLinkInput = () => {
    if (!hasLinkText) {
      return;
    }

    if (!isUrlFormat(jdLink)) {
      setLinkModalStep("failed");
      return;
    }

    setLinkModalStep("reading");
  };

  const selectMethodFromFailure = (method: JdInputMethod) => {
    setSelectedMethod(method);
    setLinkModalStep(method === "link" ? "input" : "failed");

    if (method === "link") {
      setJdLink("");
      return;
    }

    setIsLinkModalOpen(false);
    setJdLink("");
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
        <>
          {linkModalStep === "input" ? (
            <ModalInput
              type="actionModal"
              value={jdLink}
              onChange={setJdLink}
              onSubmit={submitLinkInput}
              onClose={closeLinkModal}
              title="공고 링크를 입력해주세요."
              description="링크 내용이 부적절한 경우 제대로 추출되지 않을 수 있습니다."
              placeholder="https://www.com"
              showInputField
              showDescription
              showLoadMotion={false}
              submitDisabled={!hasLinkText}
            />
          ) : linkModalStep === "reading" ? (
            <ModalInput
              type="actionModal_alert"
              variant="alert"
              value={jdLink}
              onChange={setJdLink}
              onSubmit={() => setLinkModalStep("input")}
              onCancel={resetToUploadStart}
              onClose={resetToUploadStart}
              title="링크를 읽고 있습니다"
              description="링크 내용이 부적절한 경우 제대로 추출되지 않을 수 있습니다."
              placeholder="https://www.com"
              showInputField
              showDescription
              showLoadMotion
            />
          ) : (
            <ModalInput
              type="actionModal"
              value={jdLink}
              onChange={setJdLink}
              onSubmit={() => undefined}
              onClose={resetToUploadStart}
              title="공고 입력에 실패했습니다"
              description="다른 방법으로 공고 내용을 입력해주세요"
              showInputField={false}
              showDescription
              showLoadMotion={false}
              statusIconType="WARN"
              methodActions={[
                {
                  label: "직접 입력하기",
                  iconType: "EDIT",
                  onClick: () => selectMethodFromFailure("manual"),
                },
                {
                  label: "링크 붙여넣기",
                  iconType: "LINK",
                  onClick: () => selectMethodFromFailure("link"),
                },
                {
                  label: "이미지 업로드",
                  iconType: "UPLOAD_M",
                  onClick: () => selectMethodFromFailure("image"),
                },
              ]}
            />
          )}
        </>
      )}
    </div>
  );
}
