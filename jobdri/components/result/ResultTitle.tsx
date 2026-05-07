import type { HTMLAttributes } from "react";
import clsx from "clsx";
import Icon, { type IconType } from "@/components/icons/Icon";

type ResultTitleVariant = "bad" | "good";

interface ResultTitleProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ResultTitleVariant;
  title?: string;
  descriptionPrefix?: string;
  weaknessCount?: number;
  descriptionMiddle?: string;
  descriptionHighlight?: string;
  descriptionSuffix?: string;
}

interface ResultTitleVariantConfig {
  iconType: IconType;
  iconClassName: string;
  title: string;
  descriptionPrefix: string;
  weaknessCount: number;
  descriptionMiddle: string;
  descriptionHighlight: string;
  descriptionSuffix: string;
}

const variantConfigs: Record<ResultTitleVariant, ResultTitleVariantConfig> = {
  bad: {
    iconType: "WARN",
    iconClassName: "text-fill-fail-strong",
    title: "보완이 필요해요.",
    descriptionPrefix: "약점",
    weaknessCount: 1,
    descriptionMiddle: "개만 채우면",
    descriptionHighlight: "72-78점",
    descriptionSuffix: "까지 개선할 수 있어요.",
  },
  good: {
    iconType: "GOOD",
    iconClassName: "text-fill-secondary-default",
    title: "훌륭한 자소서예요!",
    descriptionPrefix: "약점",
    weaknessCount: 1,
    descriptionMiddle: "개만 채우면",
    descriptionHighlight: "72-78점",
    descriptionSuffix: "까지 완성도를 높일 수 있어요.",
  },
};

export default function ResultTitle({
  variant = "bad",
  title,
  descriptionPrefix,
  weaknessCount,
  descriptionMiddle,
  descriptionHighlight,
  descriptionSuffix,
  className,
  ...divProps
}: ResultTitleProps) {
  const config = variantConfigs[variant];

  return (
    <div
      className={clsx(
        "flex flex-col items-start justify-center gap-1.5",
        className,
      )}
      {...divProps}
    >
      <div className="flex items-center justify-center gap-2">
        <Icon
          type={config.iconType}
          className={clsx(
            "aspect-square h-6 w-6 shrink-0",
            config.iconClassName,
          )}
        />
        <span className="text-t20-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
          {title ?? config.title}
        </span>
      </div>

      <div className="flex flex-wrap items-start gap-[4px]">
        <span className="text-sub14-reg text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
          {descriptionPrefix ?? config.descriptionPrefix}
        </span>
        <span className="flex items-start">
          <span className="text-label14-semibold text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
            {weaknessCount ?? config.weaknessCount}
          </span>
          <span className="text-sub14-reg text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
            {descriptionMiddle ?? config.descriptionMiddle}
          </span>
        </span>
        <span className="text-label14-semibold text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
          {descriptionHighlight ?? config.descriptionHighlight}
        </span>
        <span className="text-sub14-reg text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
          {descriptionSuffix ?? config.descriptionSuffix}
        </span>
      </div>
    </div>
  );
}
