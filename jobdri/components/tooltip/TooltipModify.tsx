import clsx from "clsx";
import Icon from "@/components/icons/Icon";

interface TooltipModifyProps {
  title?: string;
  label?: string;
  body?: string;
  actionLabel?: string;
  onApply?: () => void;
  className?: string;
}

export function TooltipModify({
  title = "모호한 표현보다는 구체적으로 기술해주세요.",
  label = "개선 예시",
  body = "친환경차로의 전환기에서 사용자가 겪는 새로운 불편함을 해결하고, 자율주행 환경에서 신뢰할 수 있는 HMI를 설계하고자 현대자동차에 지원했습니다.",
  actionLabel = "적용하기",
  onApply,
  className,
}: TooltipModifyProps) {
  return (
    <div
      role="tooltip"
      className={clsx(
        "relative flex w-full max-w-[480px] flex-col items-start gap-3 rounded-[15px] bg-fill-tertiary-default px-5 py-[18px]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute right-[10px] top-[-12px] flex w-12 flex-col items-center justify-center gap-2.5 text-fill-tertiary-default"
      >
        <Icon type="POLYGON_2" className="h-4 w-6" />
      </span>

      <p className="self-stretch text-[14px] font-medium leading-[150%] tracking-[-0.28px] text-text-neutral-white [font-feature-settings:'liga'_off,'clig'_off]">
        {title}
      </p>

      <div className="h-0 w-full border-t-[0.75px] border-icon-strong" />

      <div className="flex items-center justify-center gap-1.5">
        <span className="h-4 w-4 shrink-0 bg-[#D9D9D9]" />
        <span className="text-cap12-semibold text-text-neutral-disabled [font-feature-settings:'liga'_off,'clig'_off]">
          {label}
        </span>
      </div>

      <div className="flex items-end justify-end gap-4 self-stretch">
        <p className="flex-1 text-[14px] font-normal leading-[150%] tracking-[-0.28px] text-text-neutral-disabled [font-feature-settings:'liga'_off,'clig'_off]">
          {body}
        </p>

        <button
          type="button"
          onClick={onApply}
          className="flex shrink-0 items-center justify-center rounded-[8px] border border-line-neutral-default bg-fill-quaternary-default px-1.5 py-1"
        >
          <span className="flex items-center justify-center gap-2.5 self-stretch px-0.5 text-cap12-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
            {actionLabel}
          </span>
        </button>
      </div>
    </div>
  );
}
