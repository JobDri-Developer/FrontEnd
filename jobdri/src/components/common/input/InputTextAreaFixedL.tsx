"use client";

import {
  InputTextAreaFixedBase,
  type InputTextAreaFixedSharedProps,
} from "./InputTextAreaFixedShared";

export type InputTextAreaFixedLProps = InputTextAreaFixedSharedProps;

export function InputTextAreaFixedL(props: InputTextAreaFixedLProps) {
  return (
    <InputTextAreaFixedBase
      fieldLayoutClassName="h-[340px] py-4 pr-4 pl-5"
      inputFrameClassName="relative flex min-h-0 flex-1 items-start self-stretch"
      textareaLayoutClassName="min-h-0 flex-1 self-stretch"
      topContainerClassName="flex min-h-0 flex-1 self-stretch px-1"
      {...props}
    />
  );
}
