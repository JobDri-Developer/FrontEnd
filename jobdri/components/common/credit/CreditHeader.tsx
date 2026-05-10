import clsx from "clsx";
import type { HTMLAttributes } from "react";

type CreditHeaderColumn = {
  key: string;
  label: string;
  className: string;
};

const columns: CreditHeaderColumn[] = [
  { key: "date", label: "날짜", className: "w-[240px]" },
  { key: "type", label: "구분", className: "w-[120px]" },
  { key: "content", label: "내용", className: "w-[320px]" },
  { key: "quantity", label: "수량", className: "flex-1" },
  { key: "balance", label: "잔액", className: "w-[101px] justify-end" },
];

export default function CreditHeader({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={clsx(
        "flex w-full flex-col items-start gap-2.5 bg-bg-contents-assistive px-6",
        className,
      )}
      {...props}
    >
      <div className="flex items-center self-stretch px-2 py-5">
        {columns.map((column) => (
          <div
            key={column.key}
            className={clsx(
              "flex min-w-0 items-center gap-2.5",
              column.className,
            )}
          >
            <span className="line-clamp-1 min-w-0 overflow-hidden text-ellipsis text-sub14-med text-text-neutral-caption [font-feature-settings:'liga'_off,'clig'_off]">
              {column.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
