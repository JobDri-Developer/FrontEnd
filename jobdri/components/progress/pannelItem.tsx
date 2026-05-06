import clsx from "clsx";

type PannelItemStatus = "inProgress" | "idle";

interface PannelItemProps {
  step: number;
  label: string;
  status: PannelItemStatus;
}

export default function PannelItem({ step, label, status }: PannelItemProps) {
  const isInProgress = status === "inProgress";

  return (
    <div className="flex items-center gap-2 p-2">
      <div
        className={clsx(
          "w-5 h-5 rounded-full flex items-center justify-center text-cap12-med leading-none shrink-0",
          isInProgress
            ? "bg-fill-quaternary-default text-text-white"
            : "bg-fill-disabled text-text-neutral-disabled",
        )}
      >
        {step}
      </div>
      <span
        className={clsx(
          "text-sub14-med",
          isInProgress
            ? "text-text-neutral-description"
            : "text-text-neutral-disabled",
        )}
      >
        {label}
      </span>
    </div>
  );
}
