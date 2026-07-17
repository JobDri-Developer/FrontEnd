"use client";

import React from "react";
import { DropDown } from "@/components/common/dropdown";
import {
  InputTextAreaAutoGrowS,
  InputTextAreaFixedL,
} from "@/components/common/input";
import Icon from "@/components/common/icons/Icon";
import { InputTextAreaFixedBottom } from "@/components/common/input/InputTextAreaFixedShared";

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
  const isError = question.answer.length > maxLen;

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
          hasError={isError}
          message="글자 수를 확인해주세요"
        />
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex flex-row gap-0.5 items-center">
          <label className="text-b16-med text-text-neutral-title">
            최대 글자수
          </label>
          <button className="p-1.5">
            <Icon type="INFO" />
          </button>
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
          hasError={isError}
          message="글자 수를 확인해주세요"
        />
      </section>
    </div>
  );
}
