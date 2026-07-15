"use client";

import React, { useState, useRef, useEffect } from "react";
import Avatar, { type AvatarColor } from "./Avatar";
import Icon from "@/components/common/icons/Icon"; // 공용 아이콘 컴포넌트 수입
import clsx from "clsx";

interface AvatarColorPickerProps {
  name: string;
  onChange?: (color: AvatarColor) => void;
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
  onChange,
}: AvatarColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<AvatarColor>("default");
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleColorSelect = (color: AvatarColor) => {
    setSelectedColor(color);
    setIsOpen(false);
    if (onChange) {
      onChange(color);
    }
  };

  return (
    <div className="relative inline-block" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-[7px] transition-shadow "
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Avatar type="company" name={name} color={selectedColor} />
      </button>

      {isOpen && (
        <div className="absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 z-50 flex items-center">
          <div className="absolute right-full translate-x-[2px] top-1/2 -translate-y-1/2 z-10 text-white shrink-0">
            <Icon
              type="POLYGON_1"
              className="h-3 w-3 fill-current  rotate-180"
            />
          </div>

          <div
            className={clsx(
              "p-2 bg-white rounded-toast-s shadow-modal  flex gap-2.5 items-center w-max relative",
            )}
          >
            {COLOR_OPTIONS.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className=" transition-all duration-200 hover:shadow-hover cursor-pointer shrink-0 rounded-[7px]"
                >
                  <div
                    className={clsx(
                      "rounded-[9px] flex items-center justify-center p-[1.5px]",
                      isSelected
                        ? "border-[1.5px] border-fill-primary-default"
                        : " border-transparent",
                    )}
                  >
                    <Avatar type="company" name={name} color={color} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
