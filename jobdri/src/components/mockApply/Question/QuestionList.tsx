import React, { useState } from "react";
import { QuestionItem, type QuestionData } from "./QuestionItem";
import Icon from "@/components/icons/Icon";
import { Button } from "@/components/common/buttons";

export const QuestionList = () => {
  // 제네릭을 사용하여 상태의 타입을 명시
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
        id: Date.now(), // 실제 환경에서는 uuid나 서버 생성 id 사용 권장
        title: "새로운 문항",
        content: "",
      };

      setQuestions((prev) => [...prev, newQuestion]);
      setActiveIndex(questions.length); // 새 문항 추가 시 해당 문항으로 Active 상태 변경
    }
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
            onClick={() => setActiveIndex(idx)}
          />
        ))}

        {/* 문항 추가 버튼 */}
        {questions.length < MAX_QUESTIONS && (
          <Button
            label="문항 추가"
            iconType="ADD_S"
            onClick={handleAddQuestion}
            styleType="tertiary"
          />
        )}
      </div>
    </div>
  );
};
