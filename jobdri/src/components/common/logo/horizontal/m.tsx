import type { HTMLAttributes } from "react";
import clsx from "clsx";
import LogoMinimum from "@/assets/ic_LOGO_minimum_favi.svg";

export default function LogoHorizontalMedium({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="img"
      aria-label="JobDri"
      className={clsx(
        "flex h-12 w-40 shrink-0 items-center justify-center aspect-[10/3]",
        className,
      )}
      {...props}
    >
      <LogoMinimum
        aria-hidden="true"
        viewBox="8 7.25 83 14.25"
        className="h-[92%] w-[92%] shrink-0"
      />
    </div>
  );
}
