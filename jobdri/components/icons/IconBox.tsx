"use client";
import { useState } from "react";
import clsx from "clsx";
import Icon, { IconType } from "./Icon";

interface IconBoxProps {
  type: IconType;
}

export default function IconBox({ type }: IconBoxProps) {
  const [isSelected, setIsSelected] = useState(false);

  return type === "TRASH" ? (
    <div
      className={clsx(
        "p-1 bg-gray-100 hover:bg-red-100 rounded-cta-s",
        isSelected && "bg-red-400",
      )}
      onClick={() => setIsSelected(!isSelected)}
    >
      <Icon type="TRASH" />
    </div>
  ) : (
    <div className=" p-2 bg-gray-95 hover:bg-white rounded-cta-s">
      <Icon type={type} />
    </div>
  );
}
