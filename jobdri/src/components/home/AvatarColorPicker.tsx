"use client";

import React from "react";
import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";
import Avatar, { type AvatarColor } from "./Avatar";

interface AvatarColorPickerProps {
  name: string;
  selectedColor: AvatarColor;
  onColorSelect: (color: AvatarColor) => void;
}

const COLOR_OPTIONS: AvatarColor[] = [
  "default",
  "red",
  "orange",
  "green",
  "lightblue",
  "blue",
  "pink",
];

export default function AvatarColorPicker({
  name,
  selectedColor,
  onColorSelect,
}: AvatarColorPickerProps) {
  return (
    <div
      className="absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 z-50 flex items-center cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute right-full translate-x-[2px] top-1/2 -translate-y-1/2 z-10 text-white shrink-0">
        <Icon type="POLYGON_1" className="h-3 w-3 fill-current rotate-180" />
      </div>

      <div className="p-2 bg-white rounded-toast-s shadow-modal flex gap-2.5 items-center w-max relative border border-line-neutral-assistive">
        {COLOR_OPTIONS.map((color) => {
          const isSelected = selectedColor === color;
          return (
            <button
              key={color}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onColorSelect(color);
              }}
              className="transition-all duration-200 hover:shadow-hover cursor-pointer shrink-0 rounded-[7px]"
            >
              <div
                className={clsx(
                  "rounded-[9px] flex items-center justify-center p-[1.5px]",
                  isSelected
                    ? "border-[1.5px] border-fill-primary-default"
                    : "border-[1.5px] border-transparent",
                )}
              >
                <Avatar
                  name={name}
                  color={color}
                  size="small"
                  isEditable={false}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
