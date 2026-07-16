"use client";

import {
  InputTextAreaFixedBase,
  type InputTextAreaFixedSharedProps,
} from "./InputTextAreaFixedShared";

const TEXTAREA_HEIGHT = 64;

export type InputTextAreaFixedSProps = InputTextAreaFixedSharedProps;

export function InputTextAreaFixedS(props: InputTextAreaFixedSProps) {
  return (
    <InputTextAreaFixedBase
      fieldLayoutClassName="p-4"
      inputFrameClassName="relative flex h-16 flex-1 items-start"
      textareaLayoutClassName="h-16 flex-1"
      textareaStyle={{ height: TEXTAREA_HEIGHT }}
      topContainerClassName="flex h-16 self-stretch px-1"
      {...props}
    />
  );
}
