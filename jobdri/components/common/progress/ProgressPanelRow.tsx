import clsx from "clsx";
import ProgressPanelRowItem, {
  type ProgressPanelRowItemStatus,
} from "./ProgressPanelRowItem";

export interface ProgressPanelRowItemData {
  title?: string;
  description?: string;
  stepNumber?: number;
  status?: ProgressPanelRowItemStatus;
}

interface ProgressPanelRowProps {
  itemCount?: 3 | 4;
  currentStep?: number;
  items?: ProgressPanelRowItemData[];
  className?: string;
  itemClassName?: string;
}

function getStepStatus(
  index: number,
  currentStep: number,
): ProgressPanelRowItemStatus {
  const stepNumber = index + 1;

  if (stepNumber < currentStep) return "complete";
  if (stepNumber === currentStep) return "inProgress";
  return "idle";
}

export default function ProgressPanelRow({
  itemCount = 3,
  currentStep = 2,
  items,
  className,
  itemClassName,
}: ProgressPanelRowProps) {
  const steps: ProgressPanelRowItemData[] =
    items ??
    Array.from({ length: itemCount }, (_, index) => ({
      stepNumber: index + 1,
    }));

  return (
    <div className={clsx("flex min-h-[133px] items-start gap-14", className)}>
      {steps.map((item, index) => (
        <ProgressPanelRowItem
          key={item.stepNumber ?? index}
          title={item.title}
          description={item.description}
          stepNumber={item.stepNumber ?? index + 1}
          status={item.status ?? getStepStatus(index, currentStep)}
          showConnector={index < steps.length - 1}
          className={itemClassName}
        />
      ))}
    </div>
  );
}
