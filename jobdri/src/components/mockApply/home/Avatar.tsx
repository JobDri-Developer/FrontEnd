import React from "react";
import clsx from "clsx";

export type AvatarType = "user" | "company";
export type AvatarSize = "large" | "medium" | "small" | "xsmall";
export type AvatarColor =
  | "default"
  | "red"
  | "orange"
  | "green"
  | "lightblue"
  | "blue"
  | "pink";

interface AvatarProps {
  name: string;
  type?: AvatarType;
  color?: AvatarColor;
  size?: AvatarSize;
  className?: string;
}

// 색상 스타일 (이전과 동일)
const colorStyles: Record<AvatarColor, string> = {
  default:
    "bg-white border border-line-neutral-default text-text-neutral-description",
  red: "bg-red-200 text-text-system-fail",
  orange: "bg-orange-300 text-orange-800",
  green: "bg-green-300 text-green-800",
  lightblue: "bg-lightblue-200 text-lightblue-700",
  blue: "bg-purple-300 text-purple-800",
  pink: "bg-pink-300 text-pink-700",
};

// 사이즈에 따른 너비, 높이, 폰트 크기 매핑
const sizeStyles: Record<AvatarSize, string> = {
  large: "w-[42px] h-[42px] text-[18px]", // 42px
  medium: "w-[40px] h-[40px] text-[18px]", // 40px
  small: "w-7 h-7", // 28px
  xsmall: "w-6 h-6", // 24px
};

export default function Avatar({
  name,
  type = "company",
  color = "default",
  size = "small",
  className,
}: AvatarProps) {
  // 이름의 첫 글자 추출
  const firstLetter = name.trim().charAt(0).toUpperCase();

  // 1. 유저 타입
  if (type === "user") {
    return (
      <div
        className={clsx(
          "flex shrink-0 items-center w-5 h-5 justify-center rounded-full bg-icon-neutral-default text-text-neutral-white text-sub14-med",
          sizeStyles[size],
          className,
        )}
      >
        {firstLetter}
      </div>
    );
  }

  // 2. 컴퍼니 타입
  return (
    <div
      className={clsx(
        "flex shrink-0 items-center justify-center font-bold text-sub14-med rounded-[7px]",
        sizeStyles[size],
        colorStyles[color],
        className,
      )}
    >
      {firstLetter}
    </div>
  );
}
