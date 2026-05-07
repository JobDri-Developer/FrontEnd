import type { HTMLAttributes } from "react";
import clsx from "clsx";

interface ApplyCardProps extends HTMLAttributes<HTMLElement> {
  company?: string;
  position?: string;
  createdAt?: string;
  createdAtLabel?: string;
}

export default function ApplyCard({
  company = "카카오",
  position = "백엔드 개발자",
  createdAt = "2022. 09. 03",
  createdAtLabel = "작성일",
  className,
  ...articleProps
}: ApplyCardProps) {
  return (
    <article
      className={clsx(
        "flex w-full items-center rounded-card bg-bg-contents-default px-6 py-5",
        className,
      )}
      {...articleProps}
    >
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
        <div className="flex min-w-0 items-center gap-2 self-stretch">
          <span className="min-w-0 truncate text-b16-bold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
            {company}
          </span>
          <span className="min-w-0 truncate text-b16-reg text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
            {position}
          </span>
        </div>

        <div className="flex items-center justify-end gap-1.5">
          <span className="text-right text-cap12-med text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
            {createdAtLabel}
          </span>
          <span className="text-right text-cap12-med text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
            {createdAt}
          </span>
        </div>
      </div>
    </article>
  );
}
