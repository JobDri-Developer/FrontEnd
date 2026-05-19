import clsx from "clsx";
import Icon, { type IconType } from "@/components/common/icons/Icon";
import Button from "./Button";

type ButtonCtaModalStack =
  | "stack1_horizontal"
  | "stack2_horizontal"
  | "stack3_vertical";

interface ButtonCtaModalProps {
  label?: string;
  cancelLabel?: string;
  stack?: ButtonCtaModalStack;
  onSubmit?: () => void;
  onCancel?: () => void;
  className?: string;
}

interface Stack3Item {
  label: string;
  iconType: IconType;
}

const stack3Items: Stack3Item[] = [
  { label: "직접 입력하기", iconType: "EDIT" },
  { label: "링크 붙여넣기", iconType: "LINK" },
  { label: "이미지 업로드", iconType: "UPLOAD_M" },
];

function ModalIconButton({ label, iconType }: Stack3Item) {
  return (
    <button
      type="button"
      className="flex h-[46px] w-full cursor-pointer items-center justify-center gap-1 self-stretch rounded-cta-s bg-fill-quaternary-assistive p-3 text-btn16-semibold text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]"
    >
      <Icon
        type={iconType}
        className="h-6 w-6 shrink-0 text-icon-neutral-default"
      />
      <span className="flex h-[22px] items-center justify-center gap-2.5 px-0.5">
        {label}
      </span>
    </button>
  );
}

export default function ButtonCtaModal({
  label = "입력하기",
  cancelLabel = "취소하기",
  stack = "stack1_horizontal",
  onSubmit,
  onCancel,
  className,
}: ButtonCtaModalProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-start gap-2.5 self-stretch pb-8",
        className,
      )}
    >
      {stack === "stack1_horizontal" ? (
        <Button
          label={label}
          size="large"
          styleType="secondary"
          onClick={onSubmit}
          className="h-[46px] w-full"
        />
      ) : stack === "stack2_horizontal" ? (
        <div className="flex w-full items-start gap-3 self-stretch">
          <Button
            label={cancelLabel}
            size="large"
            styleType="quaternary"
            onClick={onCancel}
            className="h-[46px] flex-1 "
          />
          <Button
            label={label}
            size="large"
            styleType="secondary"
            onClick={onSubmit}
            className="h-[46px] flex-1 "
          />
        </div>
      ) : (
        stack3Items.map((item) => (
          <ModalIconButton key={item.label} {...item} />
        ))
      )}
    </div>
  );
}
