import type { HTMLAttributes } from "react";
import clsx from "clsx";
import LogoSymbol from "@/assets/ic_LOGO_symbol.svg";
import LogoType from "@/assets/ic_LOGO_type.svg";

export default function LogoVerticalMedium({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="img"
      aria-label="JobDri"
      className={clsx(
        "flex h-36 w-60 shrink-0 items-center justify-center",
        className,
      )}
      {...props}
    >
      <div className="flex h-[86.25px] w-[160.096px] shrink-0 flex-col items-center gap-[14.712px]">
        <LogoSymbol aria-hidden="true" className="h-[30.288px] w-[90.577px]" />
        <LogoType aria-hidden="true" className="h-[41.25px] w-[160.096px]" />
      </div>
    </div>
  );
}
