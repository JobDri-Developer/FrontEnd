"use client";

import type {
  ChangeEvent,
  DragEvent,
  FocusEvent,
  TextareaHTMLAttributes,
  UIEvent,
} from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import { IconButton } from "@/components/common/buttons";
import Icon from "@/components/common/icons/Icon";
import {
  lnbHiddenScrollbarClass,
  LnbScrollbar,
  useLnbScrollMetrics,
} from "@/components/common/lnb/LnbScrollbar";
import { Toast } from "@/components/common/toast";
import { LLMInputImagePreview } from "./LLMInputImagePreview";
import { LLMInputSubmitButton } from "./LLMInputSubmitButton";

const MIN_TEXTAREA_HEIGHT = 21;
const TEXTAREA_LINE_HEIGHT = 21;
const MAX_TEXTAREA_ROWS = 13;
const MAX_TEXTAREA_HEIGHT = TEXTAREA_LINE_HEIGHT * MAX_TEXTAREA_ROWS;
const DEFAULT_MAX_IMAGES = 2;
const dragUploadBackground =
  "[background:linear-gradient(180deg,rgba(227,229,255,0.5)_-77.91%,rgba(255,255,255,0.5)_174.51%)]";

interface LLMInputImagePreviewState {
  id: string;
  file: File;
  url: string;
  loaded: boolean;
}

function createImagePreviewState(
  file: File,
  index: number,
): LLMInputImagePreviewState {
  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${Date.now()}-${index}`,
    file,
    url: URL.createObjectURL(file),
    loaded: false,
  };
}

export interface LLMInputProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className" | "defaultValue" | "onChange" | "onSubmit" | "value"
> {
  value?: string;
  defaultValue?: string;
  defaultFiles?: File[];
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onFilesChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxImages?: number;
  submitDisabled?: boolean;
  showImageIcon?: boolean;
  showScroll?: boolean;
  className?: string;
  textareaClassName?: string;
}

export function LLMInput({
  placeholder = "직무, 주요업무, 자격요건, 우대사항 등의 내용이 포함되어있으면 좋아요.",
  value: externalValue,
  defaultValue = "",
  defaultFiles = [],
  onChange,
  onSubmit,
  onFilesChange,
  accept = "image/*",
  multiple = true,
  maxImages = DEFAULT_MAX_IMAGES,
  submitDisabled,
  showImageIcon = true,
  showScroll = true,
  disabled = false,
  className,
  textareaClassName,
  onFocus,
  onBlur,
  onScroll,
  style,
  ...textareaProps
}: LLMInputProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagePreviewsRef = useRef<LLMInputImagePreviewState[]>([]);
  const previewCleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const imageLimitToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<
    LLMInputImagePreviewState[]
  >(() => defaultFiles.map(createImagePreviewState));
  const [isDragActive, setIsDragActive] = useState(false);
  const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);
  const [uploadModeMinHeight, setUploadModeMinHeight] = useState<
    number | undefined
  >();
  const [showImageLimitToast, setShowImageLimitToast] = useState(false);
  const isControlled = externalValue !== undefined;
  const value = externalValue ?? internalValue;
  const hasValue = value.trim().length > 0;
  const hasContent = hasValue || imagePreviews.length > 0;
  const hasReachedMaxImages = imagePreviews.length >= maxImages;
  const canAddImages = !disabled && !hasReachedMaxImages;
  const isDragUploadMode = canAddImages && isDragActive;
  const isUploadMode = isDragUploadMode || (canAddImages && isFilePickerOpen);
  const resolvedSubmitDisabled =
    disabled || submitDisabled === true || !hasContent;
  const {
    scrollAreaRef: textareaRef,
    scrollbarMetrics,
    updateScrollbarMetrics,
  } = useLnbScrollMetrics<HTMLTextAreaElement>(showScroll && !disabled, value);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = `${MIN_TEXTAREA_HEIGHT}px`;

    const nextHeight = Math.min(
      Math.max(textarea.scrollHeight, MIN_TEXTAREA_HEIGHT),
      MAX_TEXTAREA_HEIGHT,
    );

    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > MAX_TEXTAREA_HEIGHT ? "auto" : "hidden";
    updateScrollbarMetrics();
  }, [textareaRef, updateScrollbarMetrics, value]);

  useEffect(() => {
    imagePreviewsRef.current = imagePreviews;
  }, [imagePreviews]);

  useEffect(() => {
    if (previewCleanupTimerRef.current) {
      clearTimeout(previewCleanupTimerRef.current);
      previewCleanupTimerRef.current = null;
    }

    return () => {
      const previewUrls = imagePreviewsRef.current.map(
        (imagePreview) => imagePreview.url,
      );

      previewCleanupTimerRef.current = setTimeout(() => {
        previewUrls.forEach((previewUrl) => {
          URL.revokeObjectURL(previewUrl);
        });
      }, 0);

      if (imageLimitToastTimerRef.current) {
        clearTimeout(imageLimitToastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isFilePickerOpen) {
      return;
    }

    const handleWindowFocus = () => {
      setIsFilePickerOpen(false);
    };

    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [isFilePickerOpen]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = event.target.value;

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  const handleFocus = (event: FocusEvent<HTMLTextAreaElement>) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
    setFocused(false);
    onBlur?.(event);
  };

  const handleScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    updateScrollbarMetrics();
    onScroll?.(event);
  };

  const captureUploadModeHeight = () => {
    const currentHeight = rootRef.current?.getBoundingClientRect().height ?? 0;
    setUploadModeMinHeight(Math.max(Math.ceil(currentHeight), 198));
  };

  const openImageLimitToast = () => {
    setShowImageLimitToast(true);

    if (imageLimitToastTimerRef.current) {
      clearTimeout(imageLimitToastTimerRef.current);
    }

    imageLimitToastTimerRef.current = setTimeout(() => {
      setShowImageLimitToast(false);
    }, 3000);
  };

  const handleFileButtonClick = () => {
    if (disabled) {
      return;
    }

    if (hasReachedMaxImages) {
      openImageLimitToast();
      return;
    }

    captureUploadModeHeight();
    setIsFilePickerOpen(true);
    fileInputRef.current?.click();
  };

  const addImageFiles = (incomingFiles: File[]) => {
    const imageFiles = incomingFiles.filter((file) =>
      file.type.startsWith("image/"),
    );

    // 중복 방지 로직
    const uniqueFiles = imageFiles.filter(
      (newFile) =>
        !imagePreviews.some(
          (preview) =>
            preview.file.name === newFile.name &&
            preview.file.size === newFile.size,
        ),
    );

    const remainingImageCount = Math.max(maxImages - imagePreviews.length, 0);
    const files = uniqueFiles.slice(0, remainingImageCount);
    if (files.length === 0) {
      if (incomingFiles.length > 0 && hasReachedMaxImages) {
        openImageLimitToast();
      }
      return;
    }

    if (uniqueFiles.length > files.length) {
      openImageLimitToast();
    }

    const nextImagePreviews = [
      ...imagePreviews,
      ...files.map(createImagePreviewState),
    ];

    setImagePreviews(nextImagePreviews);
    onFilesChange?.(nextImagePreviews.map((imagePreview) => imagePreview.file));
  };

  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    addImageFiles(Array.from(event.target.files ?? []));
    setIsFilePickerOpen(false);
    event.target.value = "";
  };

  const hasDraggingFiles = (event: DragEvent<HTMLDivElement>) =>
    Array.from(event.dataTransfer.types).includes("Files");

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    if (!hasDraggingFiles(event)) {
      return;
    }

    event.preventDefault();

    if (canAddImages) {
      captureUploadModeHeight();
      setIsDragActive(true);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!hasDraggingFiles(event)) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";

    if (canAddImages) {
      if (!isDragUploadMode) {
        captureUploadModeHeight();
      }
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;

    if (
      nextTarget instanceof Node &&
      event.currentTarget.contains(nextTarget)
    ) {
      return;
    }

    setIsDragActive(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    if (!hasDraggingFiles(event)) {
      return;
    }

    event.preventDefault();
    setIsDragActive(false);

    if (!canAddImages) {
      if (hasReachedMaxImages) {
        openImageLimitToast();
      }
      return;
    }

    addImageFiles(Array.from(event.dataTransfer.files));
  };

  const handleImageLoad = (id: string) => {
    setImagePreviews((currentImagePreviews) =>
      currentImagePreviews.map((imagePreview) =>
        imagePreview.id === id
          ? { ...imagePreview, loaded: true }
          : imagePreview,
      ),
    );
  };

  const handleRemoveImage = (id: string) => {
    const removedImagePreview = imagePreviews.find(
      (imagePreview) => imagePreview.id === id,
    );
    const nextImagePreviews = imagePreviews.filter(
      (imagePreview) => imagePreview.id !== id,
    );

    if (removedImagePreview) {
      URL.revokeObjectURL(removedImagePreview.url);
    }

    setImagePreviews(nextImagePreviews);
    onFilesChange?.(nextImagePreviews.map((imagePreview) => imagePreview.file));
  };

  const handleSubmit = () => {
    if (resolvedSubmitDisabled) {
      return;
    }

    onSubmit?.(value);
  };

  return (
    <div
      ref={rootRef}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={isUploadMode ? { minHeight: uploadModeMinHeight } : undefined}
      className={clsx(
        "relative flex w-[732px] max-w-full flex-col rounded-card border p-4 shadow-hover transition-colors",
        isUploadMode
          ? clsx(
              "min-h-[198px] items-start gap-3 overflow-hidden border-line-primary-default",
              isDragUploadMode
                ? clsx("backdrop-blur-[2px]", dragUploadBackground)
                : "bg-fill-quaternary-default",
            )
          : "items-start gap-3 border-line-neutral-default bg-bg-contents-default",
        focused && !disabled && !isUploadMode && "border-line-primary-default",
        disabled && "bg-fill-quaternary-assistive",
        className,
      )}
    >
      {imagePreviews.length > 0 && (
        <div className="flex self-stretch items-start gap-3">
          {imagePreviews.map((imagePreview) => (
            <LLMInputImagePreview
              key={imagePreview.id}
              alt={imagePreview.file.name}
              loaded={imagePreview.loaded}
              src={imagePreview.url}
              onError={() => handleImageLoad(imagePreview.id)}
              onLoad={() => handleImageLoad(imagePreview.id)}
              onRemove={() => handleRemoveImage(imagePreview.id)}
            />
          ))}
        </div>
      )}

      {isUploadMode && imagePreviews.length === 0 && (
        <div className="min-h-0 flex-1" aria-hidden="true" />
      )}

      <div className="flex self-stretch items-start px-1">
        <div className="relative flex flex-1 items-start">
          {!value && placeholder && (
            <span className="pointer-events-none absolute inset-x-0 top-0 max-h-[273px] overflow-hidden text-sub14-reg text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
              {placeholder}
            </span>
          )}

          <textarea
            ref={textareaRef}
            className={clsx(
              "min-h-[21px] max-h-[273px] flex-1 resize-none overflow-y-auto bg-transparent text-sub14-reg text-text-neutral-description outline-none caret-line-primary-strong [font-feature-settings:'liga'_off,'clig'_off]",
              "placeholder:text-transparent",
              lnbHiddenScrollbarClass,
              disabled && "text-text-neutral-caption",
              textareaClassName,
            )}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onScroll={handleScroll}
            disabled={disabled}
            rows={1}
            style={{
              ...style,
              height: MIN_TEXTAREA_HEIGHT,
              maxHeight: MAX_TEXTAREA_HEIGHT,
            }}
            {...textareaProps}
          />

          {showScroll && (
            <LnbScrollbar metrics={scrollbarMetrics} className="right-[-8px]" />
          )}
        </div>
      </div>

      <div className="flex self-stretch items-center justify-between">
        <div className="flex items-center">
          {showImageIcon && (
            <>
              <IconButton
                iconType="ADD"
                styleType="normal"
                size="m"
                buttonType="transparent"
                aria-label="파일 추가"
                disabled={disabled}
                onClick={handleFileButtonClick}
              />
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={accept}
                multiple={multiple}
                disabled={disabled || imagePreviews.length >= maxImages}
                onChange={handleFilesChange}
              />
            </>
          )}
        </div>

        <LLMInputSubmitButton
          disabled={resolvedSubmitDisabled}
          onClick={handleSubmit}
        />
      </div>

      {isUploadMode && (
        <div
          className={clsx(
            "pointer-events-none absolute inset-0 z-20 flex min-h-[198px] w-full flex-col items-center justify-center pb-3 backdrop-blur-[2px]",
            isDragUploadMode ? dragUploadBackground : "bg-white/50",
          )}
        >
          <div className="flex w-[188px] flex-col items-center gap-5">
            <span className="flex items-center gap-2.5 rounded-icon-default bg-fill-primary-assistive p-2">
              <Icon
                type="UPLOAD_M"
                className="h-6 w-6 text-icon-primary-default [&_path]:stroke-current"
              />
            </span>
            <span className="self-stretch text-center text-b16-reg text-text-primary-default [font-feature-settings:'liga'_off,'clig'_off]">
              파일을 여기에 끌어다 놓으세요
            </span>
          </div>
        </div>
      )}
      {showImageLimitToast && (
        <Toast
          message={`이미지는 최대 ${maxImages}장까지 업로드 할 수 있어요`}
          variant="warning"
          position="top"
          className="!top-[64px]"
        />
      )}
    </div>
  );
}
