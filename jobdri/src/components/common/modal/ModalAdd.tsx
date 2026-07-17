"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import Icon from "@/components/common/icons/Icon";
import { Button } from "@/components/common/buttons";
import { Select, type SelectOption } from "@/components/common/select";
import useOutsideClick from "@/hooks/useOutsideClick";

interface ModalAddProps {
  onClose: () => void;
  onAdd: (question: string, maxLength: number) => void;
}

const maxLengthOptions: SelectOption[] = [
  { label: "300자", value: "300" },
  { label: "500자", value: "500" },
  { label: "800자", value: "800" },
  { label: "1,000자", value: "1000" },
  { label: "1,500자", value: "1500" },
  { label: "2,000자", value: "2000" },
];

export default function ModalAdd({ onClose, onAdd }: ModalAddProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [question, setQuestion] = useState("");
  const [maxLength, setMaxLength] = useState("1000");
  const [error, setError] = useState("");

  useOutsideClick(modalRef, onClose);

  const handleSubmit = () => {
    if (question.trim() === "") {
      setError("유효한 문항을 입력해주세요.");
      return;
    }
    onAdd(question.trim(), Number(maxLength));
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-bg-lightbox-default z-50">
      <div
        ref={modalRef}
        className="flex flex-col bg-fill-quaternary-default rounded-card w-[480px] overflow-visible shadow-card"
      >
        {/* X 버튼 */}
        <div className="flex justify-end px-7 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="text-icon-neutral-assistive hover:text-icon-neutral-default transition-colors"
          >
            <Icon type="CLOSE_M" className="w-5 h-5" />
          </button>
        </div>

        {/* 바디 */}
        <div className="flex flex-col items-center gap-6 px-8 pb-8 pt-3">
          {/* 타이틀 */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            <span className="text-t20-semibold text-text-neutral-title">
              추가할 문항을 입력해주세요
            </span>
            <span className="text-sub14-med text-text-neutral-caption">
              최대 글자수를 함께 설정해주세요
            </span>
          </div>

          {/* 인풋 + 드롭다운 */}
          <div className="flex w-full gap-3 items-start">
            {/* 텍스트 인풋 */}
            <div className="flex flex-col flex-1 min-w-0 gap-1.5">
              <div
                className={clsx(
                  "flex items-center rounded-card-result ",
                  error
                    ? "border-line-system-fail-default bg-fill-quaternary-assistive"
                    : "border-line-neutral-default bg-fill-quaternary-assistive",
                )}
              >
                <input
                  placeholder="문항 내용을 입력하세요"
                  value={question}
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sub14-reg text-text-neutral-description outline-none placeholder:text-text-neutral-disabled caret-line-primary-strong [font-feature-settings:'liga'_off,'clig'_off]"
                  onChange={(event) => {
                    setQuestion(event.target.value);
                    if (error) setError("");
                  }}
                />
              </div>
              {error && (
                <span className="text-cap12-med text-text-system-fail">
                  {error}
                </span>
              )}
            </div>

            {/* 글자수 드롭다운 */}
            <Select
              title="최대글자수"
              showInfoIcon
              options={maxLengthOptions}
              value={maxLength}
              onChange={setMaxLength}
            />
          </div>

          {/* 추가 버튼 */}
          <Button
            label="문항 추가하기"
            size="large"
            styleType="secondary"
            active={question.trim().length > 0}
            onClick={handleSubmit}
            className="w-full justify-center"
          />
        </div>
      </div>
    </div>
  );
}
