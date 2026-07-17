import React, { useState } from "react";
import { QuestionItem, type QuestionData } from "./QuestionItem";
import { Button } from "@/components/common/buttons";

interface QuestionListProps {
  onSelect: (q: QuestionData) => void;
}

export const QuestionList = ({ onSelect }: QuestionListProps) => {
  const [questions, setQuestions] = useState<QuestionData[]>([
    {
      id: 1,
      title: "새로운 문항",
      content: "문항 내용 더미텍스트입니다.문항 내용 더미텍스트입니다.",
    },
  ]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const MAX_QUESTIONS = 5;

  const handleAddQuestion = () => {
    if (questions.length < MAX_QUESTIONS) {
      const newQuestion: QuestionData = {
        id: Date.now(),
        title: "새로운 문항",
        content: "",
      };

      setQuestions((prev) => [...prev, newQuestion]);
      setActiveIndex(questions.length);
      onSelect(newQuestion);
    }
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions((prev) => {
      const targetIndex = prev.findIndex((q) => q.id === id);

      const newList = prev.filter((q) => q.id !== id);

      if (activeIndex === targetIndex) {
        setActiveIndex(Math.max(0, targetIndex - 1));
      } else if (activeIndex > targetIndex) {
        setActiveIndex((prevActive) => prevActive - 1);
      }

      return newList;
    });
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sub14-med text-text-neutral-description">
          자소서 문항 {questions.length}/{MAX_QUESTIONS}
        </h3>
      </div>

      {/* 리스트 영역 */}
      <div className="flex flex-col gap-1.5">
        {questions.map((q, idx) => (
          <QuestionItem
            key={q.id}
            index={idx}
            data={q}
            isActive={activeIndex === idx}
            onClick={() => {
              setActiveIndex(idx);
              onSelect(q);
            }}
            onDelete={questions.length > 1 ? handleDeleteQuestion : undefined}
          />
        ))}
        {/* 문항 추가 버튼 */}
        {questions.length < MAX_QUESTIONS && (
          <Button
            label="문항 추가"
            iconType="ADD_S"
            onClick={handleAddQuestion}
            styleType="tertiary"
            size="small"
          />
        )}
      </div>
    </div>
  );
};
