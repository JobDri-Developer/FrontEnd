import clsx from "clsx";
import type { HTMLAttributes } from "react";

import { ChipMain } from "@/components/chips";

type CreditRowVariant = "white" | "assistive";

interface CreditRowProps extends HTMLAttributes<HTMLElement> {
  variant?: CreditRowVariant;
  dateTime?: string;
  typeLabel?: string;
  content?: string;
  amount?: string;
  balance?: string;
}

const variantStyles: Record<CreditRowVariant, string> = {
  white: "bg-bg-contents-default",
  assistive: "bg-bg-contents-assistive",
};

const columnStyles = {
  dateTime: "w-[240px]",
  type: "w-[120px]",
  content: "w-[320px]",
  amount: "flex-1",
  balance: "w-[101px] justify-end",
};

function TextCell({ children }: { children: string }) {
  return (
    <span className="line-clamp-1 min-w-0 overflow-hidden text-ellipsis text-sub14-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
      {children}
    </span>
  );
}

export default function CreditRow({
  variant = "white",
  dateTime = "2026.04.02 오후 10:02",
  typeLabel = "데이터분석",
  content = "자소서 분석 사용",
  amount = "-1",
  balance = "32회",
  className,
  ...props
}: CreditRowProps) {
  return (
    <article
      className={clsx(
        "flex w-[960px] flex-col items-start gap-2.5 px-6",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      <div className="flex items-center self-stretch px-2 py-4">
        <div className={clsx("flex min-w-0 items-center gap-2.5", columnStyles.dateTime)}>
          <TextCell>{dateTime}</TextCell>
        </div>

        <div className={clsx("flex min-w-0 items-center gap-2.5", columnStyles.type)}>
          <ChipMain label={typeLabel} color="quaternary" size="small" />
        </div>

        <div className={clsx("flex min-w-0 items-center gap-2.5", columnStyles.content)}>
          <TextCell>{content}</TextCell>
        </div>

        <div className={clsx("flex min-w-0 items-center gap-2.5", columnStyles.amount)}>
          <TextCell>{amount}</TextCell>
        </div>

        <div className={clsx("flex min-w-0 items-center gap-2.5", columnStyles.balance)}>
          <TextCell>{balance}</TextCell>
        </div>
      </div>
    </article>
  );
}
