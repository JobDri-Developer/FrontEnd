"use client";

import Icon from "@/components/common/icons/Icon";
import clsx from "clsx";

interface EvaluateProps {
  score: number;
  evaluate: string;
  quote: string;
}

export default function Evaluation({ score, evaluate, quote }: EvaluateProps) {
  const isWarning = score < 60;

  return (
    <div
      className={clsx(
        "flex flex-col items-start border border-line-neutral-assistive gap-3 rounded-card p-5 w-full max-w-[380px]",
      )}
    >
      {/* 둥근 아이콘 배경 박스 */}
      <div
        className={clsx(
          "rounded-chip-s w-[30px] h-[30px] flex items-center justify-center ",
          isWarning
            ? "bg-fill-system-fail-hover text-text-system-fail"
            : "bg-fill-secondary-assistive text-text-system-complete",
        )}
      >
        {isWarning ? (
          <Icon type="WARN" className="" />
        ) : (
          <Icon type="GOOD" className=" text-fill-secondary-default" />
        )}
      </div>

      <div className="flex flex-col gap-6 w-full">
        <h3 className="text-btn16-semibold text-text-neutral-title mb-1">
          {evaluate}
        </h3>
        <p className=" truncate w-full text-cap12-med text-text-neutral-description bg-fill-quaternary-assistive rounded-marker py-1.5 px-2 ">
          {quote}
        </p>
      </div>
    </div>
  );
}
