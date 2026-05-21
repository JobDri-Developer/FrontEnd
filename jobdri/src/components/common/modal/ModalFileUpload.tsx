"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/common/buttons";
import Icon from "@/components/common/icons/Icon";
import {
  InputFile,
  type FileState,
  type InputFileHandle,
} from "@/components/common/input";
import useOutsideClick from "@/hooks/useOutsideClick";

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
  const inputFileRef = useRef<InputFileHandle>(null);
  const [fileState, setFileState] = useState<FileState>(
    selectedFile ? "uploaded" : "default",
  );
  const isUploading = fileState === "uploading";
  const isUploaded = Boolean(selectedFile) && fileState === "uploaded";

  useOutsideClick(modalRef, onClose);

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
              <InputFile
                ref={inputFileRef}
                accept=".jpeg,.jpg,.png,image/jpeg,image/png"
                iconType="UPLOAD_M"
                selectedFileName={selectedFile?.name}
                onFileSelect={onFileSelect}
                onFileReject={() => onFileSelect(null)}
                onStateChange={setFileState}
                className="w-full"
              />
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
                onClick={() => inputFileRef.current?.openFileDialog()}
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
