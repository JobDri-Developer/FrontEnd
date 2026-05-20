"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import clsx from "clsx";
import IconBox from "@/components/common/icons/IconBox";
import type { IconType } from "@/components/common/icons/Icon";
import Button from "@/components/common/buttons/Button";
import ProgressPanelLoadMotion from "@/components/common/progress/ProgressPanelLoadMotion";

export type FileState = "default" | "dragover" | "uploading" | "uploaded";

export interface InputFileHandle {
  openFileDialog: () => void;
  reset: () => void;
}

const DEFAULT_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const DEFAULT_ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];
const DEFAULT_ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png"];

interface InputFileProps {
  onFileSelect?: (file: File) => void;
  onFileReject?: (message: string) => void;
  onStateChange?: (state: FileState) => void;
  className?: string;
  accept?: string;
  iconType?: IconType;
  uploadedIconType?: IconType;
  selectedFileName?: string | null;
  maxSizeBytes?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  label?: string;
  buttonLabel?: string;
}

interface InputFileSummaryProps {
  fileName: string;
  iconType?: IconType;
  className?: string;
}

export function InputFileSummary({
  fileName,
  iconType = "FILE",
  className,
}: InputFileSummaryProps) {
  return (
    <div
      className={clsx(
        "flex items-center gap-[19px] self-stretch rounded-card-s border border-line-neutral-default bg-fill-quaternary-default px-4 py-3",
        className,
      )}
    >
      <IconBox
        type={iconType}
        size="mid"
        state="secondary"
        background="default"
        className="h-10 w-10 shrink-0 rounded-icon-default p-2"
        iconClassName="h-6 w-6 text-icon-neutral-default"
      />
      <div className="flex min-w-0 flex-1 items-center">
        <span className="min-w-0 truncate text-sub14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
          {fileName}
        </span>
      </div>
    </div>
  );
}

export const InputFile = forwardRef<InputFileHandle, InputFileProps>(
  function InputFile(
    {
      onFileSelect,
      onFileReject,
      onStateChange,
      className,
      accept,
      iconType = "UPLOAD_M",
      uploadedIconType = "FILE",
      selectedFileName,
      maxSizeBytes = DEFAULT_MAX_FILE_SIZE_BYTES,
      allowedMimeTypes = DEFAULT_ALLOWED_MIME_TYPES,
      allowedExtensions = DEFAULT_ALLOWED_EXTENSIONS,
      label = "파일을 여기에 끌어다 놓으세요",
      buttonLabel = "컴퓨터에서 선택하기",
    },
    ref,
  ) {
  const initialFileName = selectedFileName ?? "";
  const [fileState, setFileState] = useState<FileState>(
    initialFileName ? "uploaded" : "default",
  );
  const [fileName, setFileName] = useState(initialFileName);
  const [errorMessage, setErrorMessage] = useState("");
  const [isHover, setIsHover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateFileState = (state: FileState) => {
    setFileState(state);
    onStateChange?.(state);
  };

  const openFileDialog = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  useImperativeHandle(ref, () => ({
    openFileDialog,
    reset: () => {
      setFileName("");
      setErrorMessage("");
      updateFileState("default");
    },
  }));

  const isAllowedFileType = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    const hasAllowedMimeType = allowedMimeTypes.includes(file.type);
    const hasAllowedExtension = allowedExtensions.includes(extension);

    return hasAllowedMimeType || hasAllowedExtension;
  };

  const rejectFile = (message: string) => {
    setFileName("");
    setErrorMessage(message);
    updateFileState("default");
    onFileReject?.(message);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFile = (file: File) => {
    if (!isAllowedFileType(file)) {
      rejectFile("JPG, PNG 파일만 업로드할 수 있습니다.");
      return;
    }

    if (file.size > maxSizeBytes) {
      rejectFile("5MB 이하 파일만 업로드할 수 있습니다.");
      return;
    }

    setErrorMessage("");
    setFileName(file.name);
    updateFileState("uploading");
    onFileSelect?.(file);
    setTimeout(() => updateFileState("uploaded"), 1500);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    updateFileState("dragover");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    updateFileState("default");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const hiddenInput = (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      className="hidden"
      onChange={handleInputChange}
    />
  );

  if (fileState === "uploaded") {
    return (
      <>
        {hiddenInput}
        <InputFileSummary
          fileName={fileName}
          iconType={uploadedIconType}
          className={className}
        />
      </>
    );
  }

  const isDragover = fileState === "dragover";
  const isUploading = fileState === "uploading";
  const isActive = !isUploading && (isDragover || isHover);

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-3 self-stretch rounded-card border bg-bg-contents-assistive py-12 transition-colors cursor-pointer",
        isActive
          ? " border-line-primary-default"
          : " border-line-neutral-default",
        className,
      )}
      onClick={() => !isUploading && openFileDialog()}
      onMouseEnter={() => !isUploading && setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isUploading ? (
        <div className="flex h-[110px] flex-col items-center justify-center gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center gap-2.5 rounded-icon bg-icon-neutral-weak p-2">
            <ProgressPanelLoadMotion
              activeDotClassName="text-icon-neutral-heavy"
              inactiveDotClassName="text-icon-neutral-assistive"
            />
          </div>
          <span className="text-sub14-med text-text-neutral-caption">
            파일 업로드 중...
          </span>
        </div>
      ) : (
        <>
          <IconBox
            type={iconType}
            size="mid"
            state={isActive ? "primary" : "secondary"}
            background="default"
            className="h-12 w-12"
            iconClassName="h-6 w-6"
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
            {errorMessage || label}
          </span>
        </>
      )}

      {!isUploading && (
        <>
          {hiddenInput}
          <Button
            label={buttonLabel}
            styleType="tertiary"
            size="xsmall"
            onClick={(e) => {
              e.stopPropagation();
              openFileDialog();
            }}
          />
        </>
      )}
    </div>
  );
  },
);
