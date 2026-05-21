import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";

interface CompleteBadgeProps {
  className?: string;
}

export function CompleteBadge({ className }: CompleteBadgeProps) {
  return (
    <span
      className={clsx(
        "flex aspect-square h-[24px] w-[24px] items-center justify-center p-[2px]",
        className,
      )}
      aria-hidden="true"
    >
      <span className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-fill-secondary-default text-icon-heavy">
        <Icon
          type="CHECK_COMPLETE"
          className="block h-[18px] w-[18px] shrink-0"
        />
      </span>
    </span>
  );
}
