import React, { useState, useRef, useEffect } from "react";
import Avatar, { type AvatarColor } from "./Avatar";

interface AvatarColorPickerProps {
  name: string;
  onChange?: (color: AvatarColor) => void;
}

// 우리가 사용할 수 있는 색상 목록
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

  // 바깥 영역 클릭 시 팔레트 닫기 로직
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
      onChange(color); // 상위 컴포넌트로 변경된 색상 값 전달
    }
  };

  return (
    <div className="relative inline-block" ref={pickerRef}>
      {/* 트리거 버튼 (현재 선택된 아바타) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-shadow"
      >
        <Avatar type="company" name={name} color={selectedColor} />
      </button>

      {/* 색상 팔레트 드롭다운 */}
      {isOpen && (
        <div className="absolute left-0 z-10 p-2 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg flex gap-2 w-max">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorSelect(color)}
              className={`
                p-1 rounded-lg transition-transform hover:scale-110 
                ${selectedColor === color ? "ring-2 ring-blue-500 ring-offset-1" : ""}
              `}
            >
              <Avatar type="company" name={name} color={color} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
