"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/header/Header";
import { Footer } from "@/components/common/footer";
import { Method1Card, Method2Card } from "@/components/common/cards";
import { InputFileSummary } from "@/components/common/input";
import { ModalFileUpload, ModalInput } from "@/components/common/modal";

type JdInputMethod = "link" | "image" | "manual";
type LinkModalStep = "input" | "reading" | "failed";
type ImageModalStep = "upload" | "reading" | "failed";
const MANUAL_JD_REVIEW_PATH = "/mock-application/jd-review?mode=manual";

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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [linkModalStep, setLinkModalStep] = useState<LinkModalStep>("input");
  const [imageModalStep, setImageModalStep] = useState<ImageModalStep>("upload");
  const [jdLink, setJdLink] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const hasLinkText = jdLink.trim().length > 0;

  const handleCtaClick = () => {
    if (selectedMethod === "link") {
      setLinkModalStep("input");
      setIsLinkModalOpen(true);
      return;
    }

    if (selectedMethod === "image") {
      setSelectedImageFile(null);
      setImageModalStep("upload");
      setIsImageModalOpen(true);
      return;
    }

    if (selectedMethod === "manual") {
      router.push(MANUAL_JD_REVIEW_PATH);
    }
  };

  const closeLinkModal = () => {
    setIsLinkModalOpen(false);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const resetToUploadStart = () => {
    setIsLinkModalOpen(false);
    setIsImageModalOpen(false);
    setLinkModalStep("input");
    setImageModalStep("upload");
    setSelectedMethod(null);
    setJdLink("");
    setSelectedImageFile(null);
  };

  const returnToUploadedImage = () => {
    setIsLinkModalOpen(false);
    setIsImageModalOpen(true);
    setSelectedMethod("image");
    setImageModalStep("upload");
  };

  const restartImageUpload = () => {
    setIsLinkModalOpen(false);
    setIsImageModalOpen(true);
    setSelectedMethod("image");
    setSelectedImageFile(null);
    setImageModalStep("upload");
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

    if (method === "link") {
      setJdLink("");
      setLinkModalStep("input");
      setIsImageModalOpen(false);
      setIsLinkModalOpen(true);
      return;
    }

    if (method === "image") {
      setSelectedImageFile(null);
      setImageModalStep("upload");
      setIsLinkModalOpen(false);
      setIsImageModalOpen(true);
      return;
    }

    router.push(MANUAL_JD_REVIEW_PATH);
  };

  return (
    <div className="h-dvh overflow-hidden bg-line-neutral-assistive px-6 pt-6">
      <div className="mx-auto flex h-full w-[1280px] flex-col">
        <Header
          currentStep={2}
          leftAction={{
            label: "돌아가기",
            iconType: "HOME_S",
          }}
        />

        <section className="flex min-h-0 flex-1 flex-col items-center gap-8 self-stretch overflow-hidden bg-bg-default px-[82px] pt-8 pb-20">
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

      {isImageModalOpen && (
        imageModalStep === "upload" ? (
          <ModalFileUpload
            selectedFile={selectedImageFile}
            onFileSelect={setSelectedImageFile}
            onSubmit={() => setImageModalStep("reading")}
            onClose={closeImageModal}
          />
        ) : imageModalStep === "reading" ? (
          <ModalInput
            type="actionModal_alert"
            variant="alert"
            value=""
            onChange={() => undefined}
            onSubmit={restartImageUpload}
            onCancel={returnToUploadedImage}
            onClose={returnToUploadedImage}
            title="이미지를 읽고 있습니다"
            description="이미지가 부적절한 경우 제대로 추출되지 않을 수 있습니다"
            submitLabel="다시 입력하기"
            showInputField={false}
            showDescription
            showLoadMotion
          >
            {selectedImageFile && (
              <InputFileSummary fileName={selectedImageFile.name} />
            )}
          </ModalInput>
        ) : (
          <ModalInput
            type="actionModal"
            value=""
            onChange={() => undefined}
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
        )
      )}
    </div>
  );
}
