"use client";

import { useState, useRef } from "react";
import clsx from "clsx";
import IconBox from "@/components/common/icons/IconBox";
import Button from "@/components/common/buttons/Button";

type FileState = "default" | "dragover" | "uploading" | "uploaded";

interface InputFileProps {
  onFileSelect?: (file: File) => void;
  className?: string;
}

export function InputFile({ onFileSelect, className }: InputFileProps) {
  const [fileState, setFileState] = useState<FileState>("default");
  const [fileName, setFileName] = useState("");
  const [isHover, setIsHover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setFileState("uploading");
    onFileSelect?.(file);
    setTimeout(() => setFileState("uploaded"), 1500);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setFileState("dragover");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setFileState("default");
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

  if (fileState === "uploaded") {
    return (
      <div
        className={clsx(
          "flex items-center gap-3 px-4 py-3 bg-fill-quaternary-default border text-sub14-med border-line-neutral-default rounded-card",
          className,
        )}
      >
        <IconBox
          type="LINK"
          size="mid"
          state="secondary"
          background="default"
        />
        <span className="text-sub14-med text-text-neutral-description flex-1 min-w-0 truncate">
          {fileName}
        </span>
      </div>
    );
  }

  const isDragover = fileState === "dragover";
  const isUploading = fileState === "uploading";
  const isActive = !isUploading && (isDragover || isHover);

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-3 p-8 bg-fill-quaternary-default rounded-card border transition-colors cursor-pointer",
        isActive
          ? " border-line-primary-default"
          : " border-line-neutral-default",
        className,
      )}
      onMouseEnter={() => !isUploading && setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <IconBox
        type="LINK"
        size="mid"
        state={isActive ? "primary" : "secondary"}
        background="default"
      />

      <span
        className={clsx(
          "text-sub14-med",
          isActive
            ? "text-text-primary-default"
            : isUploading
              ? "text-text-neutral-disabled"
              : "text-text-neutral-description",
        )}
      >
        {isUploading ? "파일 업로드 중..." : "파일을 여기에 끌어다 놓세요"}
      </span>

      {!isUploading && (
        <>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleInputChange}
          />
          <Button
            label="컴퓨터에서 선택하기"
            styleType="tertiary"
            size="xsmall"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          />
        </>
      )}
    </div>
  );
}
