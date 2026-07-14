"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChipQnumber } from "@/components/common/chips";
import { InputMultiLine1000 } from "@/components/common/input";
import { fetchSelectedQuestions, saveApply, type AnswerItem } from "@/lib/api/questions";

export interface StoredQuestion {
  id: string;
  questionId?: number;
  question: string;
  maxLength?: number;
}

export interface InputSectionHandle {
  isAllComplete: () => boolean;
  hasUnderThreshold: () => boolean;
  getAnswers: () => AnswerItem[];
}

interface InputSectionProps {
  applyId: number;
  onAllCompleteChange?: (allComplete: boolean) => void;
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

const InputSection = forwardRef<InputSectionHandle, InputSectionProps>(
  function InputSection({ applyId, onAllCompleteChange }, ref) {
    const [questions, setQuestions] =
      useState<StoredQuestion[]>(fallbackQuestions);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [answersById, setAnswersById] = useState<Record<string, string>>({});
    const isRestoredRef = useRef(false);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
      fetchSelectedQuestions(applyId)
        .then((fetched) => {
          const normalized = normalizeQuestions(JSON.stringify(fetched));
          setQuestions(normalized);

          const restoredById: Record<string, string> = {};
          fetched.forEach((question, index) => {
            if (question.answer) restoredById[String(index)] = question.answer;
          });
          if (Object.keys(restoredById).length > 0) {
            setAnswersById(restoredById);
          }
          isRestoredRef.current = true;
        })
        .catch(() => {
          setQuestions(fallbackQuestions);
          isRestoredRef.current = true;
        });
    }, [applyId]);

    useEffect(() => {
      if (!isRestoredRef.current) return;

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        const answers = questions.map((question, index) => ({
          questionId: question.questionId ?? index,
          answer: answersById[question.id] ?? "",
        }));
        saveApply(applyId, answers).catch(() => {});
      }, 1500);

      return () => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      };
    }, [answersById, applyId, questions]);

    const activeQuestion = questions[activeQuestionIndex] ?? questions[0];
    const activeAnswer = activeQuestion
      ? (answersById[activeQuestion.id] ?? "")
      : "";
    const activeMaxLength = activeQuestion?.maxLength ?? DEFAULT_MAX_LENGTH;

    const completedById = useMemo(
      () =>
        questions.reduce<Record<string, boolean>>((acc, question) => {
          const maxLength = question.maxLength ?? DEFAULT_MAX_LENGTH;
          const answerLength = (answersById[question.id] ?? "").trim().length;

          acc[question.id] = answerLength >= 10 && answerLength <= maxLength;
          return acc;
        }, {}),
      [answersById, questions],
    );

    const allComplete =
      questions.length > 0 &&
      questions.every((question) => completedById[question.id]);

    useEffect(() => {
      onAllCompleteChange?.(allComplete);
    }, [allComplete, onAllCompleteChange]);

    useImperativeHandle(ref, () => ({
      isAllComplete: () => allComplete,
      hasUnderThreshold: () =>
        questions.some((question) => {
          const maxLength = question.maxLength ?? DEFAULT_MAX_LENGTH;
          const answerLength = (answersById[question.id] ?? "").trim().length;

          return answerLength < maxLength * 0.8;
        }),
      getAnswers: () =>
        questions.map((question, index) => ({
          questionId: question.questionId ?? index,
          answer: answersById[question.id] ?? "",
        })),
    }));

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
      <div className="mt-8 mb-20 flex max-w-279 flex-col gap-8">
        <h1 className="text-center text-h24-bold">
          자소서 내용을 입력해주세요.
        </h1>
        <main className="flex flex-row gap-6">
          <div aria-label="state selected" className="flex flex-col gap-2">
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
          <div className="flex w-full flex-col gap-6 rounded-card-l bg-fill-quaternary-default px-8 py-6 shadow-card">
            <div aria-label="subtitle" className="gap-1">
              <h2 className="text-b16-semibold">
                {activeQuestion?.question ?? ""}
              </h2>
              <p className="text-cap12-semibold text-text-neutral-caption">
                {activeMaxLength}자 이내
              </p>
            </div>
            <InputMultiLine1000
              className="w-full"
              value={activeAnswer}
              maxLength={activeMaxLength}
              onChange={handleAnswerChange}
            />
          </div>
        </main>
      </div>
    );
  },
);

export default InputSection;
