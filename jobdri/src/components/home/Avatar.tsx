"use client";

import React, { useState, useRef, useCallback } from "react";
import clsx from "clsx";
import AvatarColorPicker from "./AvatarColorPicker";
import Icon from "@/components/common/icons/Icon";
import useOutsideClick from "@/hooks/useOutsideClick";

export type AvatarType = "user" | "company";
export type AvatarSize = "large" | "medium" | "small" | "xsmall";
export type AvatarColor =
  "default" | "red" | "orange" | "green" | "lightblue" | "blue" | "pink";
export type AvatarColorValue = AvatarColor | Uppercase<AvatarColor>;

interface AvatarProps {
  name: string;
  type?: AvatarType;
  color?: AvatarColorValue;
  size?: AvatarSize;
  className?: string;
  isEditable?: boolean;
  onChange?: (color: AvatarColor) => void;
}

export const colorStyles: Record<AvatarColor, string> = {
  default:
    "bg-white border border-line-neutral-default text-text-neutral-description",
  red: "bg-red-200 text-text-system-fail",
  orange: "bg-orange-300 text-orange-800",
  green: "bg-green-300 text-green-800",
  lightblue: "bg-lightblue-200 text-lightblue-700",
  blue: "bg-blue-300 text-blue-800",
  pink: "bg-pink-300 text-pink-700",
};

export const sizeStyles: Record<AvatarSize, string> = {
  large: "w-[42px] h-[42px] text-[18px] rounded-cta-s",
  medium: "w-[40px] h-[40px] text-[18px] rounded-cta-s",
  small: "w-7 h-7 text-sub14-med rounded-chip-s",
  xsmall: "w-6 h-6 text-[12px] rounded-chip-s",
};

const avatarColors: AvatarColor[] = [
  "default",
  "red",
  "orange",
  "green",
  "lightblue",
  "blue",
  "pink",
];

export function normalizeAvatarColor(
  color?: AvatarColorValue | null,
): AvatarColor {
  const normalizedColor = color?.toLowerCase() as AvatarColor | undefined;

  return normalizedColor && avatarColors.includes(normalizedColor)
    ? normalizedColor
    : "default";
}

export default function Avatar({
  name,
  type = "company",
  color = "default",
  size = "small",
  className,
  isEditable = false,
  onChange,
}: AvatarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstLetter = name.trim().charAt(0).toUpperCase();
  const currentColor = normalizeAvatarColor(color);

  // 바깥 영역 클릭 시 말풍선 닫기
  const closePopover = useCallback(() => setIsOpen(false), []);
  useOutsideClick(containerRef, closePopover, isOpen);

  if (type === "user") {
    return (
      <div
        className={clsx(
          "flex shrink-0 items-center justify-center rounded-full bg-icon-neutral-default text-text-neutral-white font-bold",
          sizeStyles[size],
          className,
        )}
      >
        {firstLetter}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onClick={() => isEditable && setIsOpen((prev) => !prev)}
      className={clsx(
        "flex shrink-0 items-center justify-center font-bold relative ",
        sizeStyles[size],
        colorStyles[currentColor],
        className,
        isEditable && "group cursor-pointer",
        isEditable && !isOpen && "hover:bg-alpha-300",
      )}
    >
      {firstLetter}

      {isEditable && (
        <div
          className={clsx(
            "absolute inset-0 bg-[#000000]/40 flex items-center justify-center text-white pointer-events-none rounded-[7px]",
            "transition-opacity duration-200 ease-in-out opacity-0",
            !isOpen && "group-hover:opacity-100",
          )}
        >
          <Icon type="EDIT" className={clsx("shrink-0 fill-current ")} />
        </div>
      )}

      {isEditable && isOpen && (
        <AvatarColorPicker
          name={name}
          selectedColor={currentColor}
          onColorSelect={(newColor) => {
            onChange?.(newColor);
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}
