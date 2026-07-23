import { LnbNotificationItem } from "@/components/common/lnb";
import { IconType } from "@/components/common/icons/Icon";

const notificationIconStyles: Record<
  NonNullable<LnbNotificationItem["type"]>,
  {
    iconType: IconType;
    frameClassName: string;
    iconClassName: string;
    readFrameClassName: string;
    readIconClassName: string;
  }
> = {
  normal: {
    iconType: "SPARKLE",
    frameClassName: "bg-fill-primary-assistive",
    iconClassName: "text-icon-primary-strong",
    readFrameClassName: "bg-fill-neutral-assistive",
    readIconClassName: "text-icon-neutral-muted",
  },
  fail: {
    iconType: "WARN_24",
    frameClassName: "bg-fill-system-fail-hover",
    iconClassName: "text-fill-system-fail-strong",
    readFrameClassName: "bg-fill-neutral-assistive",
    readIconClassName: "text-icon-neutral-muted",
  },
  complete: {
    iconType: "CIRCLE_CHECK",
    frameClassName: "bg-fill-secondary-assistive",
    iconClassName: "text-fill-secondary-default",
    readFrameClassName: "bg-fill-neutral-assistive",
    readIconClassName: "text-icon-neutral-muted",
  },
};
