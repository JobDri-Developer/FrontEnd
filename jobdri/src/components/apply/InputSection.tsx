"use client";

import { useEffect, useMemo, useState } from "react";
import { ChipQnumber } from "@/components/common/chips";
import { InputMultiLine1000 } from "@/components/common/input";

export interface StoredQuestion {
  id: string;
  question: string;
  maxLength?: number;
}

interface InputSectionProps {
  storageKey?: string;
}

const DEFAULT_MAX_LENGTH = 1000;

const fallbackQuestions: StoredQuestion[] = [
  {
    id: "q1",
    question:
      "데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요.",
    maxLength: DEFAULT_MAX_LENGTH,
  },
];

function normalizeQuestions(value: string | null): StoredQuestion[] {
  if (!value) {
    return fallbackQuestions;
  }

  try {
    const parsedValue = JSON.parse(value);

    if (!Array.isArray(parsedValue)) {
      return fallbackQuestions;
    }

    const questions = parsedValue
      .filter(
        (item): item is StoredQuestion =>
          typeof item?.id === "string" && typeof item?.question === "string",
      )
      .map((item) => ({
        ...item,
        maxLength:
          typeof item.maxLength === "number"
            ? item.maxLength
            : DEFAULT_MAX_LENGTH,
      }));

    return questions.length > 0 ? questions : fallbackQuestions;
  } catch {
    return fallbackQuestions;
  }
}

export default function InputSection({
  storageKey = "selectedQuestions",
}: InputSectionProps) {
  const [questions, setQuestions] = useState<StoredQuestion[]>(fallbackQuestions);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answersById, setAnswersById] = useState<Record<string, string>>({});

  useEffect(() => {
    setQuestions(normalizeQuestions(sessionStorage.getItem(storageKey)));
  }, [storageKey]);

  const activeQuestion = questions[activeQuestionIndex] ?? questions[0];
  const activeAnswer = activeQuestion ? (answersById[activeQuestion.id] ?? "") : "";
  const activeMaxLength = activeQuestion?.maxLength ?? DEFAULT_MAX_LENGTH;

  const completedById = useMemo(
    () =>
      questions.reduce<Record<string, boolean>>((acc, question) => {
        const maxLength = question.maxLength ?? DEFAULT_MAX_LENGTH;
        const answerLength = (answersById[question.id] ?? "").trim().length;

        acc[question.id] =
          answerLength >= Math.ceil(maxLength * 0.5) && answerLength <= maxLength;
        return acc;
      }, {}),
    [answersById, questions],
  );

  const handleAnswerChange = (value: string) => {
    if (!activeQuestion) {
      return;
    }

    setAnswersById((prevAnswers) => ({
      ...prevAnswers,
      [activeQuestion.id]: value,
    }));
  };

  return (
    <div className="mx-auto flex w-full max-w-[1116px] flex-col gap-8">
      <h2 className="text-center text-h24-bold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
        자소서를 입력해주세요.
      </h2>

      <div className="flex flex-col gap-4 rounded-card-l bg-fill-quaternary-default px-8 py-7 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {questions.map((question, index) => (
              <ChipQnumber
                key={question.id}
                number={index + 1}
                selected={activeQuestionIndex === index}
                showComplete={completedById[question.id]}
                onChange={() => setActiveQuestionIndex(index)}
              />
            ))}
          </div>
          <span className="text-sub14-med text-text-neutral-caption">
            {activeAnswer.length}/{activeMaxLength}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-b16-med text-text-neutral-title">
            {activeQuestion?.question}
          </p>
          <InputMultiLine1000
            value={activeAnswer}
            onChange={handleAnswerChange}
            maxLength={activeMaxLength}
            placeholder="문항에 대한 답변을 입력해주세요."
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
