"use client";

import { useState } from "react";
import { Button } from "@/components/common/buttons";
import {
  InputTextAreaAutoGrowS,
  InputTextAreaFixedL,
  InputTextAreaFixedS,
  JDInput,
} from "@/components/common/input";
import { ModalAdd } from "@/components/common/modal";
import { Select, type SelectOption } from "@/components/common/select";

const maxLengthOptions: SelectOption[] = [
  { label: "300자", value: "300" },
  { label: "500자", value: "500" },
  { label: "800자", value: "800" },
  { label: "1,000자", value: "1000" },
  { label: "1,500자", value: "1500" },
  { label: "2,000자", value: "2000" },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-start gap-5 self-stretch rounded-card-s bg-bg-contents-default p-8 shadow-card">
      <h2 className="text-t20-semibold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ComponentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectValue, setSelectValue] = useState("1000");

  return (
    <main className="flex min-h-screen w-full flex-col items-start gap-8 bg-line-neutral-assistive px-10 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-h28-bold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
          Component Check
        </h1>
        <p className="text-b16-med text-text-neutral-description [font-feature-settings:'liga'_off,'clig'_off]">
          최근 수정한 공통 컴포넌트를 확인하는 화면입니다.
        </p>
      </div>

      <Section title="TextArea Title">
        <div className="flex flex-col gap-8">
          <InputTextAreaFixedS label="주제" />
          <InputTextAreaAutoGrowS
            label="주제"
            defaultValue="내용을 입력해주세요. 내용을 입력해주세요."
          />
          <InputTextAreaFixedL
            label="주제"
            defaultValue="내용을 입력해주세요. 내용을 입력해주세요. 내용을 입력해주세요."
          />
        </div>
      </Section>

      <Section title="JD Input">
        <div className="flex flex-col gap-4">
          <JDInput type="role" />
          <JDInput
            type="role"
            defaultValue={
              "토스 앱 내 금융 서비스의 UX/UI 설계\n사용자 리서치를 통한 문제 정의와 솔루션 디자인\n디자인 시스템(TDS) 운영 및 개선\nPO·개발자와 협업하여 빠른 실험과 출시"
            }
          />
          <JDInput
            type="role"
            state="tapped"
            defaultValue="토스 앱 내 금융 서비스의 UX/UI 설계"
          />
        </div>
      </Section>

      <Section title="Select With Title And Tooltip">
        <div className="flex items-start gap-8 overflow-visible py-8">
          <Select
            title="최대글자수"
            showInfoIcon
            options={maxLengthOptions}
            value={selectValue}
            onChange={setSelectValue}
          />

          <Button
            label="문항 추가 모달 보기"
            size="medium"
            styleType="secondary"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </Section>

      {isModalOpen && (
        <ModalAdd
          onClose={() => setIsModalOpen(false)}
          onAdd={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
}
