import React from "react";
import Button from "@/components/common/buttons/Button";

interface ModalCardProps {
  title: string;
  description: string;
  secondaryBtn: string;
  primaryBtn?: string;
  errorBtn?: string;
  onSecondaryClick?: () => void;
  onPrimaryClick?: () => void;
  onErrorClick?: () => void;
}

export const ModalCard: React.FC<ModalCardProps> = ({
  title,
  description,
  secondaryBtn,
  primaryBtn,
  errorBtn,
  onSecondaryClick,
  onPrimaryClick,
  onErrorClick,
}) => {
  return (
    <div className="bg-white rounded-modal shadow-modal flex flex-col h-full w-100">
      <div className="flex flex-col justify-center items-start mx-7 mt-7">
        <h3 className="text-t20-semibold text-text-neutral-title text-center mb-3">
          {title}
        </h3>
        <p className="text-sub14-med text-text-neutral-caption text-left leading-relaxed break-keep">
          {description}
        </p>
      </div>

      {/* 하단 버튼 배치 영역 */}
      <div className="flex gap-2 mt-8 mb-5 mx-5 justify-center">
        <Button
          label={secondaryBtn}
          styleType="quaternary"
          className="w-full"
          onClick={onSecondaryClick}
        />
        {primaryBtn && (
          <Button
            label={primaryBtn}
            styleType="secondary"
            className="w-full"
            onClick={onPrimaryClick}
          />
        )}
        {errorBtn && (
          <Button
            label={errorBtn}
            styleType="error"
            className="w-full"
            onClick={onErrorClick}
          />
        )}
      </div>
    </div>
  );
};
