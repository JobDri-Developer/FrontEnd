import clsx from "clsx";
import Button from "./Button";

type ButtonCtaVariant =
  | "gradient_white"
  | "gradient_dark"
  | "empty_white"
  | "empty_dark";

interface ButtonCtaProps {
  label?: string;
  variant?: ButtonCtaVariant;
  onClick?: () => void;
  className?: string;
}

const gradientWhiteStyle =
  "bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,var(--color-fill-quaternary-default)_22.37%)]";

const variantStyles: Record<ButtonCtaVariant, string> = {
  gradient_white: gradientWhiteStyle,
  gradient_dark: gradientWhiteStyle,
  empty_white: "bg-transparent",
  empty_dark: "bg-transparent",
};

const darkButtonVariants: ButtonCtaVariant[] = ["gradient_dark", "empty_dark"];

export default function ButtonCta({
  label = "기업 선택하기",
  variant = "gradient_white",
  onClick,
  className,
}: ButtonCtaProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center gap-2.5 self-stretch p-6",
        variantStyles[variant],
        className,
      )}
    >
      <Button
        label={label}
        size="large"
        styleType="secondary"
        active={darkButtonVariants.includes(variant)}
        onClick={onClick}
        className="h-[46px] w-full"
      />
    </div>
  );
}
