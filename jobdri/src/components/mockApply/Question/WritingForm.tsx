"use client";

import React, { useState } from "react"; // 🔥 useState 추가
import { DropDown } from "@/components/common/dropdown";
import {
  InputTextAreaAutoGrowS,
  InputTextAreaFixedL,
} from "@/components/common/input";
import Icon from "@/components/common/icons/Icon";
import { Tooltip } from "@/components/common/tooltip";

interface QuestionData {
  title: string;
  answer: string;
  maxLength: string;
}

interface WritingFormProps {
  question: QuestionData;
  onChange: (field: keyof QuestionData, value: string) => void;
}

export default function WritingForm({ question, onChange }: WritingFormProps) {
  const maxLen = Number(question.maxLength);
  const isAnswerError = question.answer.length > maxLen;
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  return (
    <div className="w-full flex flex-col gap-8 rounded-card-s bg-bg-contents-default p-8">
      <section className="flex flex-col gap-2">
        <InputTextAreaAutoGrowS
          label="문항"
          required={false}
          value={question.title}
          onChange={(val) => onChange("title", val)}
          maxLength={100}
          placeholder="예) 이 회사에 지원한 동기를 작성해주세요."
          showAddButton={false}
        />
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex flex-row gap-0.5 items-center">
          <label className="text-b16-med text-text-neutral-title">
            최대 글자수
          </label>

          <div className="relative flex items-center">
            <div
              className="p-1.5 cursor-pointer"
              onMouseEnter={() => setIsTooltipOpen(true)}
              onMouseLeave={() => setIsTooltipOpen(false)}
              onClick={() => setIsTooltipOpen((prev) => !prev)}
            >
              <Icon type="INFO" />
            </div>

            {isTooltipOpen && (
              <div className="absolute top-1/2 -translate-y-1/2 left-full ml-2 z-50 w-max">
                <Tooltip
                  placement="left_mid"
                  message="공고에 명시된 글자수 제한을 확인해주세요."
                />
              </div>
            )}
          </div>
        </div>

        <DropDown
          value={question.maxLength}
          onChange={(val) => onChange("maxLength", val)}
        />
      </section>

      {/* 3. 답변 작성 영역 */}
      <section className="flex flex-col gap-2">
        <InputTextAreaFixedL
          label="답변"
          required={false}
          value={question.answer}
          onChange={(val) => onChange("answer", val)}
          showAddButton={false}
          hasError={isAnswerError}
          message="글자 수를 확인해주세요"
        />
      </section>
    </div>
  );
}
