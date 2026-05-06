import clsx from "clsx";

type ChipRoundVariant = "strong" | "normal" | "assistive";

interface ChipRoundProps {
  label: string;
  variant?: ChipRoundVariant;
}

const variantStyles: Record<ChipRoundVariant, string> = {
  strong: "bg-fill-primary-default text-text-neutral-white",
  normal:
    "bg-fill-primary-assistive text-text-primary-default border border-1 border-line-primary-default",
  assistive:
    "bg-fill-quaternary-default text-text-neutral-description border border-line-neutral-default",
};

export function ChipRound({ label, variant = "normal" }: ChipRoundProps) {
  return (
    <span
      className={clsx(
        "px-3.5 py-1.5 text-cap12-semibold rounded-chip-round",
        variantStyles[variant],
      )}
    >
      {label}
    </span>
  );
}
