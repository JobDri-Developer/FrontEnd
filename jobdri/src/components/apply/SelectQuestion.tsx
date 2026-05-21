"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../common/buttons";
import { ListQ, ListQCart } from "../common/list";
import { scrollbarClass } from "../common/input/inputStyles";
import { Toast } from "../common/toast";
import AddQuestion from "./AddQuestion";
import { fetchQuestions } from "@/lib/api/questions";

const MAX_SELECT = 5;

interface Question {
  id: string;
  question: string;
  maxLength?: number;
}

interface SelectQuestionProps {
  applyId: string;
  onSelectionChange?: (count: number) => void;
  onQuestionsChange?: (questions: Question[]) => void;
}

export default function SelectQuestion({
  applyId,
  onSelectionChange,
  onQuestionsChange,
}: SelectQuestionProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuestions(applyId)
      .then(setQuestions)
      .finally(() => setIsLoading(false));
  }, [applyId]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<
    "normal" | "check" | "warning" | "dark"
  >("normal");
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const customIdCounterRef = useRef(0);
  const [isOpen, setIsOpen] = useState(false);

  const showToast = (
    message: string,
    variant: "normal" | "check" | "warning" | "dark" = "normal",
  ) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    setToastVariant(variant);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 3000);
  };

  const notify = (nextIds: string[], currentQuestions: Question[]) => {
    const selected = currentQuestions.filter((q) => nextIds.includes(q.id));
    onSelectionChange?.(nextIds.length);
    onQuestionsChange?.(selected);
  };

  const handleChange = (id: string, isSelected: boolean) => {
    if (isSelected) {
      if (selectedIds.length >= MAX_SELECT) return;
      const next = [...selectedIds, id];
      setSelectedIds(next);
      notify(next, questions);
    } else {
      const next = selectedIds.filter((q) => q !== id);
      setSelectedIds(next);
      notify(next, questions);
    }
  };

  const handleRemove = (id: string) => {
    const next = selectedIds.filter((q) => q !== id);
    setSelectedIds(next);
    notify(next, questions);
    showToast("문항이 삭제되었습니다.", "normal");
  };

  const handleAdd = (question: string, maxLength: number) => {
    const newId = `custom_${++customIdCounterRef.current}`;
    const nextQuestions = [{ id: newId, question, maxLength }, ...questions];
    setQuestions(nextQuestions);
    if (selectedIds.length < MAX_SELECT) {
      const next = [...selectedIds, newId];
      setSelectedIds(next);
      notify(next, nextQuestions);
    }
    showToast("문항이 추가되었습니다.", "check");
  };

  const selectedQuestions = questions.filter((q) => selectedIds.includes(q.id));

  if (isLoading) {
    return (
      <main className="max-w-[1116px] mx-auto flex items-center justify-center h-[540px]">
        <p className="text-text-neutral-disabled text-sub14-med">
          문항을 불러오는 중...
        </p>
      </main>
    );
  }

  return (
    <>
      <main className="max-w-[1116] mx-auto">
        {isOpen && (
          <AddQuestion onClose={() => setIsOpen(false)} onAdd={handleAdd} />
        )}
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
                onClick={() => setIsOpen(true)}
              />
            </div>
            <div
              className={`flex flex-col gap-2 -m-8 px-8 mt-1 mr-[1.5px] mb-[1.5px] overflow-y-auto flex-1 min-h-0 ${scrollbarClass} overflow-visible`}
            >
              {questions.map((q) => (
                <ListQ
                  key={q.id}
                  question={q.question}
                  selected={selectedIds.includes(q.id)}
                  maxReached={selectedIds.length >= MAX_SELECT}
                  isCustom={q.id.startsWith("custom_")}
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
              className={`flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 w-full ${scrollbarClass}`}
            >
              {selectedQuestions.length > 0 ? (
                selectedQuestions.map((q) => (
                  <ListQCart
                    key={q.id}
                    question={q.question}
                    onChange={() => handleRemove(q.id)}
                  />
                ))
              ) : (
                <p className="flex text-text-neutral-disabled text-t20-semibold items-center justify-center mt-20">
                  선택한 문항이 없습니다.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>

      {toastVisible && (
        <div className="fixed bottom-8 right-5 z-50">
          <Toast
            message={toastMessage}
            variant={toastVariant}
            onClose={() => setToastVisible(false)}
            className="w-90"
          />
        </div>
      )}
    </>
  );
}
