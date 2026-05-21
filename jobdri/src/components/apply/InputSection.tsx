"use client";

import { useState } from "react";
import { ChipQnumber } from "../common/chips";
import { InputMultiLine1000 } from "../common/input";

const MAX_LENGTH = 1000;
const COMPLETE_THRESHOLD = MAX_LENGTH * 0.5;

export default function InputSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [texts, setTexts] = useState(["", "", ""]);

  const handleTextChange = (value: string) => {
    setTexts((prev) => prev.map((t, i) => (i === selectedIndex ? value : t)));
  };

  const isComplete = (text: string) =>
    text.length >= COMPLETE_THRESHOLD && text.length <= MAX_LENGTH;

  return (
    <div className="max-w-279 flex flex-col gap-8 mt-8 mb-20">
      <h1 className="text-h24-bold text-center">자소서 내용을 입력해주세요.</h1>
      <main className="flex flex-row gap-6">
        <div aria-label="state selected" className="flex flex-col gap-2">
          {texts.map((text, i) => (
            <ChipQnumber
              key={i}
              number={i + 1}
              selected={selectedIndex === i}
              showComplete={isComplete(text)}
              onChange={() => setSelectedIndex(i)}
            />
          ))}
        </div>
        <div className="px-8 py-6 w-full bg-fill-quaternary-default rounded-card-l shadow-card flex flex-col gap-6">
          <div aria-label="subtitle" className="gap-1">
            <h2 className="text-b16-semibold">
              당사에 지원하게 된 동기와 입사 후 포부를 서술해주세요.
            </h2>
            <p className="text-cap12-semibold text-text-neutral-caption">
              1,000자 이내
            </p>
          </div>
          <InputMultiLine1000
            className="w-full"
            value={texts[selectedIndex]}
            onChange={handleTextChange}
          />
        </div>
      </main>
    </div>
  );
}
