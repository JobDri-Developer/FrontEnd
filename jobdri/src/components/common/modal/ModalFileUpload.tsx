"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/common/buttons";
import Icon from "@/components/common/icons/Icon";
import useOutsideClick from "@/hooks/useOutsideClick";

type FileState = "default" | "dragover" | "uploading" | "uploaded";

interface ModalFileUploadProps {
  selectedFile?: File | null;
  onFileSelect: (file: File | null) => void;
  onSubmit: () => void;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function ModalFileUpload({
  selectedFile,
  onFileSelect,
  onSubmit,
  onClose,
  title = "이미지 파일을 업로드해주세요",
  description = "5MB 이하jpeg, jpg, png 파일만 가능합니다",
}: ModalFileUploadProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [fileState, setFileState] = useState<FileState>(
    selectedFile ? "uploaded" : "default",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isHover, setIsHover] = useState(false);
  const isUploading = fileState === "uploading";
  const isUploaded = Boolean(selectedFile) && fileState === "uploaded";
  const isActive = fileState === "dragover" || isHover;

  useOutsideClick(modalRef, onClose);

  const openFileDialog = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
      inputFileRef.current.click();
    }
  };

  const handleFile = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    const isAllowed =
      ["image/jpeg", "image/png"].includes(file.type) ||
      ["jpg", "jpeg", "png"].includes(extension);

    if (!isAllowed) {
      setErrorMessage("JPG, PNG 파일만 업로드할 수 있습니다.");
      onFileSelect(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("5MB 이하 파일만 업로드할 수 있습니다.");
      onFileSelect(null);
      return;
    }

    setErrorMessage("");
    setFileState("uploading");
    onFileSelect(file);
    setTimeout(() => setFileState("uploaded"), 300);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-lightbox-default">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex w-[500px] shrink-0 flex-col items-center justify-center gap-0 overflow-hidden rounded-card bg-bg-contents-default shadow-modal"
      >
        <div className="flex self-stretch items-start justify-end gap-2.5 px-7 pt-6">
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex h-[30px] w-[30px] items-center justify-center p-[3px] text-icon-neutral-assistive transition-colors hover:text-icon-neutral-default"
          >
            <Icon type="CLOSE_M" className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center gap-0 self-stretch px-8">
          <div className="flex flex-col items-center justify-center gap-5 self-stretch pb-6">
            <div className="flex flex-col items-start gap-2 self-stretch text-center">
              <h2 className="self-stretch text-t20-semibold tracking-normal text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                {title}
              </h2>
              <p className="self-stretch text-sub14-med tracking-normal text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
                {description}
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 self-stretch">
              <input
                ref={inputFileRef}
                type="file"
                accept=".jpeg,.jpg,.png,image/jpeg,image/png"
                className="hidden"
                onChange={handleInputChange}
              />
              <button
                type="button"
                className={clsx(
                  "flex w-full flex-col items-center justify-center gap-3 self-stretch rounded-card border bg-bg-contents-assistive py-12 transition-colors",
                  isActive
                    ? "border-line-primary-default"
                    : "border-line-neutral-default",
                )}
                onClick={openFileDialog}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                onDragOver={(event) => {
                  event.preventDefault();
                  setFileState("dragover");
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setFileState(selectedFile ? "uploaded" : "default");
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const file = event.dataTransfer.files[0];
                  if (file) handleFile(file);
                }}
              >
                <Icon
                  type={selectedFile ? "FILE" : "UPLOAD_M"}
                  className="h-10 w-10 text-icon-neutral-default"
                />
                <span
                  className={clsx(
                    "text-sub14-med",
                    errorMessage
                      ? "text-text-system-fail"
                      : isActive
                        ? "text-text-primary-default"
                        : "text-text-neutral-caption",
                  )}
                >
                  {errorMessage ||
                    selectedFile?.name ||
                    "파일을 여기에 끌어다 놓으세요"}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2.5 self-stretch px-8 pb-8">
          {isUploaded ? (
            <div className="flex items-start gap-3 self-stretch">
              <Button
                label="파일 다시 선택"
                size="large"
                styleType="quaternary"
                onClick={openFileDialog}
                className="h-[46px] flex-1"
              />
              <Button
                label="입력하기"
                size="large"
                styleType="secondary"
                onClick={onSubmit}
                className="h-[46px] flex-1"
              />
            </div>
          ) : (
            <Button
              label="입력하기"
              size="large"
              styleType="secondary"
              disabled={!selectedFile || isUploading}
              onClick={onSubmit}
              className="h-[46px] w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
