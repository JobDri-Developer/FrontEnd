"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/common/header/Header";
import { Button } from "@/components/common/buttons";
import { Method1Card, Method2Card } from "@/components/common/cards";
import Icon from "@/components/common/icons/Icon";
import { InputAutoGrow, InputFileSummary } from "@/components/common/input";
import { ModalFileUpload, ModalInput } from "@/components/common/modal";
import useOutsideClick from "@/hooks/useOutsideClick";
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

type JdInputMethod = "text" | "link" | "image" | "manual";
type TextModalStep = "input" | "reading" | "failed";
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

interface TextJobPostingInputModalProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  submitDisabled: boolean;
}

function TextJobPostingInputModal({
  value,
  onChange,
  onSubmit,
  onClose,
  submitDisabled,
}: TextJobPostingInputModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useOutsideClick(modalRef, onClose);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default px-[240px]">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="공고 내용 입력"
        className="flex w-[500px] shrink-0 flex-col items-center justify-center gap-0 rounded-modal bg-bg-contents-default shadow-modal"
      >
        <div className="flex self-stretch items-start justify-end gap-2.5 px-7 pt-6">
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-icon-default p-[3px] text-icon-neutral-assistive transition-colors hover:bg-fill-hover hover:text-icon-neutral-default active:bg-fill-quaternary-assistive"
          >
            <Icon type="CLOSE_M" className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center gap-0 self-stretch px-8">
          <div className="flex flex-col items-center justify-center gap-5 self-stretch pb-6">
            <h2 className="self-stretch text-center text-t20-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
              공고 내용을 입력해주세요.
            </h2>

            <InputAutoGrow
              value={value}
              onChange={onChange}
              placeholder="내용을 입력해주세요."
              maxHeight={240}
              className="!min-w-0 w-full self-stretch [&>div]:!rounded-cta-l [&>div]:!py-4 [&>div]:!pr-4 [&>div]:!pl-5"
            />
          </div>
        </div>

        <div className="flex flex-col items-start gap-2.5 self-stretch px-8 pb-8">
          <Button
            label="입력하기"
            size="large"
            styleType="secondary"
            disabled={submitDisabled}
            onClick={onSubmit}
            className="h-[46px] w-full"
          />
        </div>
      </div>
    </div>
  );
}

const JdInputPageClient = forwardRef<
  JdInputPageClientHandle,
  JdInputPageClientProps
>(function JdInputPageClient({ selectedMethod, onMethodChange }, ref) {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const manualJdReviewPath = `/apply/virtual/${id}/jd-review?mode=manual`;
  const activeRequestIdRef = useRef(0);

  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [textModalStep, setTextModalStep] = useState<TextModalStep>("input");
  const [linkModalStep, setLinkModalStep] = useState<LinkModalStep>("input");
  const [imageModalStep, setImageModalStep] =
    useState<ImageModalStep>("upload");
  const [jdRawText, setJdRawText] = useState("");
  const [jdLink, setJdLink] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [processingErrorMessage, setProcessingErrorMessage] = useState("");
  const hasRawText = jdRawText.trim().length > 0;
  const hasLinkText = jdLink.trim().length > 0;

  const handleCtaClick = () => {
    if (selectedMethod === "text") {
      setTextModalStep("input");
      setIsTextModalOpen(true);
      return;
    }

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

  const closeTextModal = () => {
    setIsTextModalOpen(false);
  };

  const closeLinkModal = () => {
    setIsLinkModalOpen(false);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const resetToUploadStart = () => {
    activeRequestIdRef.current += 1;
    setIsTextModalOpen(false);
    setIsLinkModalOpen(false);
    setIsImageModalOpen(false);
    setTextModalStep("input");
    setLinkModalStep("input");
    setImageModalStep("upload");
    onMethodChange(null);
    setJdRawText("");
    setJdLink("");
    setSelectedImageFile(null);
    setProcessingErrorMessage("");
  };

  const cancelTextReading = () => {
    activeRequestIdRef.current += 1;
    setIsTextModalOpen(false);
    setTextModalStep("input");
    setProcessingErrorMessage("");
  };

  const cancelImageReading = () => {
    activeRequestIdRef.current += 1;
    setIsTextModalOpen(false);
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
    setIsTextModalOpen(false);
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
    rawText,
    sourceUrl,
    image,
  }: {
    rawText?: string;
    sourceUrl?: string;
    image?: File | null;
  }) => {
    const requestId = activeRequestIdRef.current + 1;
    activeRequestIdRef.current = requestId;
    setProcessingErrorMessage("");

    try {
      const accepted = image
        ? await ingestJobPostingImage(image)
        : await ingestJobPosting({ rawText, sourceUrl });
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

      if (rawText) {
        setTextModalStep("failed");
        return;
      }

      if (sourceUrl) {
        setLinkModalStep("failed");
        return;
      }

      setImageModalStep("failed");
    }
  };

  const submitTextInput = () => {
    if (!hasRawText) {
      return;
    }

    setTextModalStep("reading");
    void processJobPosting({ rawText: jdRawText });
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

    if (method === "text") {
      setJdRawText("");
      setTextModalStep("input");
      setIsLinkModalOpen(false);
      setIsImageModalOpen(false);
      setIsTextModalOpen(true);
      setProcessingErrorMessage("");
      return;
    }

    if (method === "link") {
      setJdLink("");
      setLinkModalStep("input");
      setIsTextModalOpen(false);
      setIsImageModalOpen(false);
      setIsLinkModalOpen(true);
      setProcessingErrorMessage("");
      return;
    }

    if (method === "image") {
      setSelectedImageFile(null);
      setImageModalStep("upload");
      setIsTextModalOpen(false);
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
                    label="텍스트 붙여넣기"
                    iconType="TEXT"
                    selected={selectedMethod === "text"}
                    onClick={() =>
                      onMethodChange(selectedMethod === "text" ? null : "text")
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

      {isTextModalOpen && (
        <>
          {textModalStep === "input" ? (
            <TextJobPostingInputModal
              value={jdRawText}
              onChange={setJdRawText}
              onSubmit={submitTextInput}
              onClose={closeTextModal}
              submitDisabled={!hasRawText}
            />
          ) : textModalStep === "reading" ? (
            <ModalInput
              type="actionModal_alert"
              variant="alert"
              value=""
              onChange={() => undefined}
              onSubmit={() => {
                activeRequestIdRef.current += 1;
                setTextModalStep("input");
              }}
              onCancel={cancelTextReading}
              onClose={cancelTextReading}
              title="텍스트를 읽고 있습니다"
              description="텍스트 내용이 부적절한 경우 제대로 추출되지 않을 수 있습니다."
              submitLabel="다시 입력하기"
              showInputField={false}
              showDescription
              showLoadMotion
            />
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
                  label: "텍스트 붙여넣기",
                  iconType: "TEXT",
                  onClick: () => selectMethodFromFailure("text"),
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
                  label: "텍스트 붙여넣기",
                  iconType: "TEXT",
                  onClick: () => selectMethodFromFailure("text"),
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
                label: "텍스트 붙여넣기",
                iconType: "TEXT",
                onClick: () => selectMethodFromFailure("text"),
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
