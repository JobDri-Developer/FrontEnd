import React from "react";
import { QuestionItem, type QuestionData } from "./QuestionItem";
import { Button } from "@/components/common/buttons";
import { type QuestionItem as ApiQuestionItem } from "@/lib/api/questions";

interface QuestionListProps {
  questions: ApiQuestionItem[]; // API에서 받아온 전체 문항 배열
  selectedId: string | null; // 현재 선택된 문항 ID
  onSelect: (id: string) => void; // 문항 클릭 시 부모에게 알림
  onAdd: () => void; // 문항 추가 시 부모에게 알림
  onDelete: (id: string) => void; // 문항 삭제 시 부모에게 알림
  type?: "result" | "apply";
}

export const QuestionList = ({
  questions,
  selectedId,
  onSelect,
  onAdd,
  onDelete,
  type = "apply",
}: QuestionListProps) => {
  const MAX_QUESTIONS = 5;

  return (
    <div className="w-full flex flex-col gap-3">
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sub14-med text-text-neutral-description">
          {type === "apply" ? (
            <>
              자소서 문항 {questions.length}/{MAX_QUESTIONS}
            </>
          ) : (
            <>문항별 피드백</>
          )}
        </h3>
      </div>

      {/* 리스트 영역 */}
      <div className="flex flex-col gap-1.5">
        {questions.map((q, idx) => (
          <QuestionItem
            key={q.id}
            index={idx}
            data={
              {
                id: Number(q.id),
                title: (q.question === "새 문항" ? "" : q.question) || "",
                content: q.answer || "",
              } as QuestionData
            }
            isActive={q.id === selectedId}
            onClick={() => onSelect(q.id)}
            onDelete={
              type === "apply" && questions.length > 1
                ? () => onDelete(q.id)
                : undefined
            }
          />
        ))}

        {type === "apply" && questions.length < MAX_QUESTIONS && (
          <Button
            label="문항 추가"
            iconType="ADD_S"
            onClick={onAdd}
            styleType="tertiary"
            size="small"
          />
        )}
      </div>
    </div>
  );
};
