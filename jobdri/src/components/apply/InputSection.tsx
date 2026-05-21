"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { ChipQnumber } from "../common/chips";
import { InputMultiLine1000 } from "../common/input";

interface Question {
  id: string;
  question: string;
  maxLength?: number;
}

export interface InputSectionHandle {
  isAllComplete: () => boolean;
  hasUnderThreshold: () => boolean;
}

interface InputSectionProps {
  onAllCompleteChange?: (allComplete: boolean) => void;
}

const InputSection = forwardRef<InputSectionHandle, InputSectionProps>(
  function InputSection({ onAllCompleteChange }, ref) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [texts, setTexts] = useState<string[]>([]);

    useEffect(() => {
      const raw = sessionStorage.getItem("selectedQuestions");
      if (raw) {
        const parsed: Question[] = JSON.parse(raw);
        setQuestions(parsed);
        setTexts(new Array(parsed.length).fill(""));
      }
    }, []);

    const isComplete = (text: string, maxLength: number) =>
      text.length >= 1 && text.length <= maxLength;

    const checkAllComplete = (currentTexts: string[]) =>
      questions.length > 0 &&
      questions.every((q, i) =>
        isComplete(currentTexts[i] ?? "", q.maxLength ?? 1000),
      );

    useImperativeHandle(ref, () => ({
      isAllComplete: () => checkAllComplete(texts),
      hasUnderThreshold: () =>
        questions.some((q, i) => {
          const limit = q.maxLength ?? 1000;
          return (texts[i] ?? "").length < limit * 0.8;
        }),
    }));

    const handleTextChange = (value: string) => {
      const nextTexts = texts.map((t, i) => (i === selectedIndex ? value : t));
      setTexts(nextTexts);
      onAllCompleteChange?.(checkAllComplete(nextTexts));
    };

    const currentQuestion = questions[selectedIndex];

    return (
      <div className="max-w-279 flex flex-col gap-8 mt-8 mb-20">
        <h1 className="text-h24-bold text-center">
          자소서 내용을 입력해주세요.
        </h1>
        <main className="flex flex-row gap-6">
          <div aria-label="state selected" className="flex flex-col gap-2">
            {questions.map((q, i) => (
              <ChipQnumber
                key={i}
                number={i + 1}
                selected={selectedIndex === i}
                showComplete={isComplete(texts[i] ?? "", q.maxLength ?? 1000)}
                onChange={() => setSelectedIndex(i)}
              />
            ))}
          </div>
          <div className="px-8 py-6 w-full bg-fill-quaternary-default rounded-card-l shadow-card flex flex-col gap-6">
            <div aria-label="subtitle" className="gap-1">
              <h2 className="text-b16-semibold">
                {currentQuestion?.question ?? ""}
              </h2>
              <p className="text-cap12-semibold text-text-neutral-caption">
                {currentQuestion?.maxLength ?? 1000}자 이내
              </p>
            </div>
            <InputMultiLine1000
              className="w-full"
              value={texts[selectedIndex] ?? ""}
              onChange={handleTextChange}
            />
          </div>
        </main>
      </div>
    );
  },
);

export default InputSection;
