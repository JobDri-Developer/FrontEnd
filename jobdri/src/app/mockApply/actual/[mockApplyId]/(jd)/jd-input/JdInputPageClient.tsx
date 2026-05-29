"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/common/header/Header";
import { Method1Card, Method2Card } from "@/components/common/cards";
import { InputFileSummary } from "@/components/common/input";
import { ModalFileUpload, ModalInput } from "@/components/common/modal";
import {
  ingestJobPosting,
  ingestJobPostingImage,
  waitForJobPostingIngest,
  type JobPostingIngestStatus,
} from "@/lib/api/jobPostings";
import {
  createJdReviewSectionsFromJobPosting,
  getJdReviewMetadataStorageKey,
  getJdReviewSavedStorageKey,
  getJdReviewStorageKey,
} from "@/components/mock-application/jdReviewSections";

type JdInputMethod = "link" | "image" | "manual";
type LinkModalStep = "input" | "reading" | "failed";
type ImageModalStep = "upload" | "reading" | "failed";

function isUrlFormat(value: string) {
  const normalizedUrl = normalizeUrl(value);

  if (!normalizedUrl || /\s/.test(value.trim())) {
    return false;
  }

  try {
    const url = new URL(normalizedUrl);

    return (
      ["http:", "https:"].includes(url.protocol) && url.hostname.includes(".")
    );
  } catch {
    return false;
  }
}

function normalizeUrl(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  return /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;
}

export interface JdInputPageClientHandle {
  handleCtaClick: () => void;
}

interface JdInputPageClientProps {
  selectedMethod: JdInputMethod | null;
  onMethodChange: (method: JdInputMethod | null) => void;
}

const JdInputPageClient = forwardRef<
  JdInputPageClientHandle,
  JdInputPageClientProps
>(function JdInputPageClient({ selectedMethod, onMethodChange }, ref) {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const manualJdReviewPath = `/apply/virtual/${id}/jd-review?mode=manual`;
  const activeRequestIdRef = useRef(0);

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [linkModalStep, setLinkModalStep] = useState<LinkModalStep>("input");
  const [imageModalStep, setImageModalStep] =
    useState<ImageModalStep>("upload");
  const [jdLink, setJdLink] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [processingErrorMessage, setProcessingErrorMessage] = useState("");
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
      router.push(manualJdReviewPath);
    }
  };

  useImperativeHandle(ref, () => ({ handleCtaClick }));

  const closeLinkModal = () => {
    setIsLinkModalOpen(false);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const resetToUploadStart = () => {
    activeRequestIdRef.current += 1;
    setIsLinkModalOpen(false);
    setIsImageModalOpen(false);
    setLinkModalStep("input");
    setImageModalStep("upload");
    onMethodChange(null);
    setJdLink("");
    setSelectedImageFile(null);
    setProcessingErrorMessage("");
  };

  const cancelImageReading = () => {
    activeRequestIdRef.current += 1;
    setIsLinkModalOpen(false);
    setIsImageModalOpen(false);
    setImageModalStep("upload");
    setProcessingErrorMessage("");

    if (document.fullscreenElement) {
      void document.exitFullscreen();
    }
  };

  const restartImageUpload = () => {
    activeRequestIdRef.current += 1;
    setIsLinkModalOpen(false);
    setIsImageModalOpen(true);
    onMethodChange("image");
    setSelectedImageFile(null);
    setImageModalStep("upload");
    setProcessingErrorMessage("");
  };

  const moveToJdReviewWithResult = (status: JobPostingIngestStatus) => {
    const result = status.result;
    const jobPosting = result?.generated ?? result?.extracted;

    if (!jobPosting) {
      throw new Error("추출된 공고 정보를 확인할 수 없습니다.");
    }

    const detailClassificationId =
      result?.saved?.detailClassificationId ??
      result?.classification?.detailClassificationId ??
      result?.candidates?.[0]?.detailClassificationId ??
      0;

    window.sessionStorage.setItem(
      getJdReviewStorageKey(id),
      JSON.stringify(createJdReviewSectionsFromJobPosting(jobPosting)),
    );
    window.sessionStorage.setItem(
      getJdReviewMetadataStorageKey(id),
      JSON.stringify({
        companySize: result?.saved?.companySize ?? "STARTUP",
        detailClassificationId,
      }),
    );

    if (result?.saved) {
      window.sessionStorage.setItem(
        getJdReviewSavedStorageKey(id),
        JSON.stringify(result.saved),
      );
    } else {
      window.sessionStorage.removeItem(getJdReviewSavedStorageKey(id));
    }

    router.push(`/apply/virtual/${id}/jd-review`);
  };

  const processJobPosting = async ({
    sourceUrl,
    image,
  }: {
    sourceUrl?: string;
    image?: File | null;
  }) => {
    const requestId = activeRequestIdRef.current + 1;
    activeRequestIdRef.current = requestId;
    setProcessingErrorMessage("");

    try {
      const accepted = image
        ? await ingestJobPostingImage(image)
        : await ingestJobPosting({ sourceUrl });
      const status = await waitForJobPostingIngest(accepted.taskId);

      if (activeRequestIdRef.current !== requestId) {
        return;
      }

      moveToJdReviewWithResult(status);
    } catch (error) {
      if (activeRequestIdRef.current !== requestId) {
        return;
      }

      setProcessingErrorMessage(
        error instanceof Error
          ? error.message
          : "공고 입력에 실패했습니다.",
      );

      if (sourceUrl) {
        setLinkModalStep("failed");
        return;
      }

      setImageModalStep("failed");
    }
  };

  const submitLinkInput = () => {
    if (!hasLinkText) {
      return;
    }

    if (!isUrlFormat(jdLink)) {
      setProcessingErrorMessage("올바른 공고 링크를 입력해주세요.");
      setLinkModalStep("failed");
      return;
    }

    setLinkModalStep("reading");
    void processJobPosting({ sourceUrl: normalizeUrl(jdLink) });
  };

  const submitImageInput = () => {
    if (!selectedImageFile) {
      return;
    }

    setImageModalStep("reading");
    void processJobPosting({ image: selectedImageFile });
  };

  const selectMethodFromFailure = (method: JdInputMethod) => {
    onMethodChange(method);

    if (method === "link") {
      setJdLink("");
      setLinkModalStep("input");
      setIsImageModalOpen(false);
      setIsLinkModalOpen(true);
      setProcessingErrorMessage("");
      return;
    }

    if (method === "image") {
      setSelectedImageFile(null);
      setImageModalStep("upload");
      setIsLinkModalOpen(false);
      setIsImageModalOpen(true);
      setProcessingErrorMessage("");
      return;
    }

    router.push(manualJdReviewPath);
  };

  return (
    <>
      <div className="flex-1 bg-line-neutral-assistive px-6 py-6">
        <div className="mx-auto flex w-[1280px] flex-col">
          <Header currentStep={2} />

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
                      onMethodChange(selectedMethod === "link" ? null : "link")
                    }
                  />
                  <Method1Card
                    label="이미지 업로드하기"
                    iconType="UPLOAD"
                    selected={selectedMethod === "image"}
                    onClick={() =>
                      onMethodChange(
                        selectedMethod === "image" ? null : "image",
                      )
                    }
                  />
                </div>

                <Method2Card
                  label="직접 작성하기"
                  selected={selectedMethod === "manual"}
                  onClick={() =>
                    onMethodChange(
                      selectedMethod === "manual" ? null : "manual",
                    )
                  }
                />
              </div>
            </div>
          </section>
        </div>
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
              onSubmit={() => {
                activeRequestIdRef.current += 1;
                setLinkModalStep("input");
              }}
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
              description={
                processingErrorMessage || "다른 방법으로 공고 내용을 입력해주세요"
              }
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

      {isImageModalOpen &&
        (imageModalStep === "upload" ? (
          <ModalFileUpload
            selectedFile={selectedImageFile}
            onFileSelect={setSelectedImageFile}
            onSubmit={submitImageInput}
            onClose={closeImageModal}
          />
        ) : imageModalStep === "reading" ? (
          <ModalInput
            type="actionModal_alert"
            variant="alert"
            value=""
            onChange={() => undefined}
            onSubmit={restartImageUpload}
            onCancel={cancelImageReading}
            onClose={cancelImageReading}
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
            description={
              processingErrorMessage || "다른 방법으로 공고 내용을 입력해주세요"
            }
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
        ))}
    </>
  );
});

export default JdInputPageClient;
