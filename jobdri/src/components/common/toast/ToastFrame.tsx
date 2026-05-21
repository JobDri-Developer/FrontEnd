import clsx from "clsx";
import { IconOnlyButton } from "@/components/common/buttons";
import ToastStatusIcon from "./ToastStatusIcon";

interface ToastFrameProps {
  message?: string;
  onClose?: () => void;
  className?: string;
}

export default function ToastFrame({
  message = "작성하신 문항이 추가되었습니다.",
  onClose,
  className,
}: ToastFrameProps) {
  return (
    <div
      className={clsx(
        "flex h-[156px] w-[380px] items-start justify-start",
        className,
      )}
    >
      <div className="inline-flex flex-col items-start gap-2.5">
        <div
          role="status"
          className="flex w-[360px] items-center justify-between rounded-toast-l bg-fill-quaternary-default py-3 pr-4 pl-[14px] shadow-hover"
        >
          <div className="flex min-w-0 items-center gap-[14px]">
            <ToastStatusIcon variant="check" />
            <span className="truncate text-cap12-semibold text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
              {message}
            </span>
          </div>

          <IconOnlyButton
            aria-label="토스트 닫기"
            className="shrink-0"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}
