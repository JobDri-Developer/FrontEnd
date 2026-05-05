"use client";

import clsx from "clsx";
import Icon from "./Icon";
import { useState } from "react";

interface CheckBoxProps {
  type: "DEFAULT" | "RADIO_L" | "RADIO_M";
}

export default function CheckBox({ type }: CheckBoxProps) {
  const [isSelected, setIsSelected] = useState(false);
  const isRadio = type.includes("RADIO");
  const isM = type.includes("M");

  return (
    <div
      className={clsx(
        "p-0.5 bg-gray-200 hover:bg-gray-300",
        isRadio ? "rounded-full" : "rounded-chip-s",
        isSelected && "bg-gray-800",
      )}
      onClick={() => setIsSelected(!isSelected)}
    >
      <Icon
        type={isM ? "CHECK_M" : "CHECK"}
        className={`text-gray-300 hover:text-gray-200 ${isSelected && "text-white"}`}
      />
    </div>
  );
}
