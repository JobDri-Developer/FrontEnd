"use client";

import clsx from "clsx";
import Icon from "./Icon";
import { useState } from "react";

interface CheckBoxProps {
  type: "DEFAULT" | "RADIO_L" | "RADIO_M";
  selected?: boolean;
  onChange?: (selected: boolean) => void;
  className?: string;
}

export default function CheckBox({
  type,
  selected: externalSelected,
  onChange,
  className,
}: CheckBoxProps) {
  const [internalSelected, setInternalSelected] = useState(false);
  const isControlled = externalSelected !== undefined;
  const isSelected = isControlled ? externalSelected : internalSelected;
  const isRadio = type.includes("RADIO");
  const isM = type.includes("M");

  const handleClick = () => {
    if (!isControlled) setInternalSelected(!internalSelected);
    onChange?.(!isSelected);
  };

  return (
    <div
      className={clsx(
        "p-0.5 cursor-pointer border group",
        isRadio ? "rounded-full" : "rounded-chip-s",
        isSelected
          ? "bg-fill-tertiary-default border-fill-tertiary-default"
          : "bg-transparent border-line-neutral-strong hover:border-transparent hover:bg-icon-neutral-assistive",
        className,
      )}
      onClick={handleClick}
    >
      <Icon
        type={isM ? "CHECK_M" : "CHECK"}
        className={clsx(
          "group-hover:text-text-neutral-white",
          isSelected
            ? "text-text-neutral-white"
            : isRadio
              ? "text-transparent"
              : "text-icon-neutral-assistive group-hover:text-text-neutral-caption",
        )}
      />
    </div>
  );
}
