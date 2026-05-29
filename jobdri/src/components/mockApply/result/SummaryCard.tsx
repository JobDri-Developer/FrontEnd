"use client";

import Image, { type StaticImageData } from "next/image";
import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";

interface SummaryCardProps {
  title: string;
  score: number;
  maxScore?: number;
  img?: StaticImageData;
}

export default function SummaryCard({
  title,
  score,
  maxScore = 100,
  img,
}: SummaryCardProps) {
  const isWarning = score < 60;

  return (
    <div className="flex flex-col gap-3 rounded-chip-m bg-fill-quaternary-default p-4 border border-line-neutral-default">
      <div className="flex w-full rounded-chip-m bg-fill-quaternary-assistive overflow-hidden">
        {img && (
          <Image
            src={img}
            alt={title}
            width={img.width / 2}
            height={img.height / 2}
            className="w-full h-auto"
          />
        )}
      </div>
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-b16-semibold text-text-neutral-title">
            {title}
          </span>
          <div className="flex items-baseline gap-1">
            <span
              className={clsx(
                "text-b16-semibold",
                isWarning ? "text-text-system-fail" : "text-text-neutral-title",
              )}
            >
              {score}점
            </span>
            <span className="text-label14-med text-text-neutral-caption">
              / {maxScore}점
            </span>
          </div>
        </div>
        {isWarning && (
          <div className="flex  p-2 w-10 h-10 items-center justify-center rounded-card-s bg-fill-system-fail-hover">
            <Icon type="WARN" className="text-fill-system-fail-strong" />
          </div>
        )}
      </div>
    </div>
  );
}
