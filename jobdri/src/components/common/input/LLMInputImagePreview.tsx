"use client";

import clsx from "clsx";
import Image, { type ImageProps } from "next/image";
import { IconButton } from "@/components/common/buttons";
import loadingExampleImage from "@/assets/img_analysis.png";
import { LLMInputImageLoadMotion } from "./LLMInputImageLoadMotion";
import { LLMInputSubmitButton } from "./LLMInputSubmitButton";

export interface LLMInputImagePreviewProps {
  alt?: string;
  className?: string;
  loaded?: boolean;
  onError?: () => void;
  onLoad?: () => void;
  onRemove?: () => void;
  src?: ImageProps["src"];
}

export function LLMInputImagePreview({
  alt = "",
  className,
  loaded = false,
  onError,
  onLoad,
  onRemove,
  src,
}: LLMInputImagePreviewProps) {
  return (
    <div className={clsx("relative h-[120px] w-[120px] shrink-0", className)}>
      <div
        className={clsx(
          "relative flex h-[120px] w-[120px] items-center justify-center overflow-hidden border border-line-neutral-default",
          loaded ? "rounded-toast-l" : "rounded-card-s",
        )}
      >
        {src && (
          <Image
            unoptimized
            src={src}
            alt={alt}
            width={120}
            height={120}
            className={clsx(
              "absolute inset-0 h-[120px] w-[120px] object-cover transition-[filter,opacity,transform]",
              loaded
                ? "opacity-100 blur-0"
                : "scale-105 opacity-100 blur-[6px]",
            )}
            onLoad={onLoad}
            onError={onError}
          />
        )}

        {!loaded && (
          <LLMInputImageLoadMotion
            className="relative z-10"
            activeDotClassName="bg-icon-neutral-heavy"
            inactiveDotClassName="bg-icon-neutral-assistive"
          />
        )}
      </div>

      {loaded && onRemove && (
        <span className="absolute top-2 right-2 z-10 inline-flex">
          <IconButton
            iconType="CLOSE"
            styleType="normal"
            size="xs"
            buttonType="fill"
            aria-label="이미지 삭제"
            className="!rounded-chip-s !bg-bg-contents-assistive !p-0.5 !shadow-card hover:!bg-bg-contents-assistive active:!bg-bg-contents-assistive"
            onClick={onRemove}
          />
        </span>
      )}
    </div>
  );
}

export function LLMInputImageLoadingExample() {
  return (
    <div className="flex w-[732px] max-w-full flex-col items-start gap-3 rounded-card border border-line-neutral-default bg-bg-contents-default p-4 shadow-hover">
      <div className="flex self-stretch items-start gap-3">
        <LLMInputImagePreview
          alt="로딩 예시 이미지"
          loaded={false}
          src={loadingExampleImage}
        />
      </div>

      <div className="flex self-stretch items-start px-1">
        <span className="text-sub14-reg text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
          직무, 주요업무, 자격요건, 우대사항 등의 내용이 포함되어있으면 좋아요.
        </span>
      </div>

      <div className="flex self-stretch items-center justify-between">
        <IconButton
          iconType="ADD"
          styleType="normal"
          size="m"
          buttonType="transparent"
          aria-label="파일 추가"
        />
        <LLMInputSubmitButton disabled />
      </div>
    </div>
  );
}
