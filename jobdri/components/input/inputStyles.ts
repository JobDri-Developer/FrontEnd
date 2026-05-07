import clsx from "clsx";

export function getWrapperClass(
  focused: boolean,
  disabled: boolean,
  isError: boolean,
  focusedBorder = "border-line-primary-default",
  paddingClass = "px-4 py-3",
) {
  return clsx(
    `border rounded-lg ${paddingClass} transition-colors`,
    disabled
      ? "bg-transparent border-line-neutral-default"
      : isError
        ? "bg-white border-line-fail-default"
        : focused
          ? `bg-white ${focusedBorder}`
          : "bg-white border-line-neutral-default",
  );
}

export const scrollbarClass =
  "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track-piece]:bg-fill-quaternary-assistive [&::-webkit-scrollbar-thumb]:bg-fill-tertiary-assistive [&::-webkit-scrollbar-thumb]:rounded-full";

export function getFieldClass(disabled: boolean) {
  return clsx(
    "w-full bg-transparent outline-none text-sub14-reg placeholder:text-text-neutral-disabled caret-line-primary-default",
    disabled && "text-text-neutral-disabled cursor-not-allowed",
  );
}
