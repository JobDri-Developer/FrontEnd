"use client";

import { useRef, useState } from "react";
import { Button } from "../common/buttons";
import { ListQ, ListQCart } from "../common/list";
import { scrollbarClass } from "../common/input/inputStyles";
import { Toast } from "../common/toast";

const MAX_SELECT = 5;

interface Question {
  id: string;
  question: string;
}

const QUESTIONS: Question[] = [
  {
    id: "q1",
    question:
      "데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요.",
  },
  {
    id: "q2",
    question:
      "데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요.",
  },
  {
    id: "q3",
    question:
      "데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요.",
  },
  {
    id: "q4",
    question:
      "데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요.",
  },
  {
    id: "q5",
    question:
      "데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요.",
  },
  {
    id: "q6",
    question:
      "데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요.",
  },
];

export default function SelectQuestion() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 3000);
  };

  const handleChange = (id: string, isSelected: boolean) => {
    if (isSelected) {
      if (selectedIds.length >= MAX_SELECT) return;
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((q) => q !== id));
    }
  };

  const handleRemove = (id: string) => {
    setSelectedIds((prev) => prev.filter((q) => q !== id));
    showToast();
  };

  const selectedQuestions = QUESTIONS.filter((q) => selectedIds.includes(q.id));

  return (
    <>
      <main className="max-w-[1116] mx-auto">
        <h1 className="text-h24-bold text-center my-8">
          답변할 문항을 5가지 선택해주세요.
        </h1>
        <div className="flex gap-6">
          {/* 왼쪽: 질문 목록 */}
          <section
            aria-label="left-container"
            className="flex-2 flex flex-col bg-fill-quaternary-default shadow-card px-8 py-7 rounded-card-l h-[540px]"
          >
            <div className="flex flex-row justify-between items-start mb-8">
              <h2 className="text-t20-semibold">질문 목록</h2>
              <Button
                label="직접 추가"
                type="button"
                size="small"
                styleType="secondary"
                iconType="ADD_S"
              />
            </div>
            <div
              className={`flex flex-col gap-2 -m-8 px-8 mt-1 mr-[1.5px] mb-[1.8px] overflow-y-auto flex-1 min-h-0 ${scrollbarClass} overflow-visible`}
            >
              {QUESTIONS.map((q) => (
                <ListQ
                  key={q.id}
                  question={q.question}
                  selected={selectedIds.includes(q.id)}
                  maxReached={selectedIds.length >= MAX_SELECT}
                  onChange={(isSelected) => handleChange(q.id, isSelected)}
                />
              ))}
            </div>
          </section>

          {/* 오른쪽: 선택 목록 */}
          <section
            aria-label="right-container"
            className="flex-1 flex flex-col gap-8 p-7 bg-fill-quaternary-assistive shadow-card rounded-card-l h-[496px]"
          >
            <div className="flex items-centen gap-3">
              <h3 className="text-t20-semibold text-text-neutral-description">
                선택 목록
              </h3>
              <span className="text-t20-semibold text-text-neutral-disabled">
                {selectedQuestions.length}/{MAX_SELECT}
              </span>
            </div>
            <div
              className={`flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 ${scrollbarClass}`}
            >
              {selectedQuestions.map((q) => (
                <ListQCart
                  key={q.id}
                  question={q.question}
                  onChange={() => handleRemove(q.id)}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      {toastVisible && (
        <div className="fixed bottom-8 right-5 z-50">
          <Toast
            message="문항이 삭제되었습니다."
            onClose={() => setToastVisible(false)}
            className="w-90"
          />
        </div>
      )}
    </>
  );
}
