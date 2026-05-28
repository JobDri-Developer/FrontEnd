import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import type { ApplicationCardData } from "./types";

export function handleApplicationCardKeyDown(
  event: ReactKeyboardEvent<HTMLElement>,
  onResumeClick?: () => void,
) {
  if (!onResumeClick || (event.key !== "Enter" && event.key !== " ")) {
    return;
  }

  event.preventDefault();
  onResumeClick();
}

export function CreatedAt({
  createdAt,
}: Pick<ApplicationCardData, "createdAt">) {
  return (
    <div className="flex items-center justify-end gap-3">
      <span className="text-right text-cap12-med text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
        작성일
      </span>
      <span className="text-right text-cap12-med text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
        {createdAt}
      </span>
    </div>
  );
}
