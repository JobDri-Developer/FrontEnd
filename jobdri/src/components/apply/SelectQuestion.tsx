"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../common/buttons";
import { ListQ, ListQCart } from "../common/list";
import { scrollbarClass } from "../common/input/inputStyles";
import { Toast } from "../common/toast";
import AddQuestion from "./AddQuestion";
import { fetchQuestions, fetchSelectedQuestions } from "@/lib/api/questions";

const MAX_SELECT = 5;
const CUSTOM_QUESTIONS_STORAGE_PREFIX = "jobdri.customQuestions";

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: "default_1",
    question:
      "데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요.",
  },
  {
    id: "default_2",
    question:
      "사용자의 의견을 반영하여 디자인을 개선한 사례를 설명해 주세요.",
  },
  {
    id: "default_3",
    question:
      "프로젝트에서 마주친 기술적 문제를 어떻게 해결했는지 서술해 주세요.",
  },
  {
    id: "default_4",
    question:
      "시장 조사를 통해 새로운 기회를 발견한 경험에 대해 이야기해 주세요.",
  },
  {
    id: "default_5",
    question:
      "협업 과정에서 갈등을 해결하고 성과를 낸 경험을 작성해 주세요.",
  },
];

export interface Question {
  id: string;
  questionId?: number;
  question: string;
  maxLength?: number;
  selected?: boolean;
  custom?: boolean;
}

interface SelectQuestionProps {
  applyId: number;
  onSelectionChange?: (count: number) => void;
  onQuestionsChange?: (questions: Question[]) => void;
}

function isSameQuestion(a: Question, b: Question) {
  if (a.questionId && b.questionId) {
    return a.questionId === b.questionId;
  }

  return normalizeQuestionText(a.question) === normalizeQuestionText(b.question);
}

function normalizeQuestionText(question: string) {
  return question.trim().replace(/\s+/g, " ");
}

function getCustomQuestionsStorageKey(applyId: number) {
  return `${CUSTOM_QUESTIONS_STORAGE_PREFIX}:${applyId}`;
}

function createMergedQuestionId(
  prefix: string,
  question: Question,
  index: number,
) {
  return `${prefix}_${question.questionId ?? index}_${normalizeQuestionText(
    question.question,
  ).slice(0, 24)}`;
}

function readStoredCustomQuestions(applyId: number): Question[] {
  if (typeof window === "undefined") return [];

  try {
    const rawValue = window.sessionStorage.getItem(
      getCustomQuestionsStorageKey(applyId),
    );
    if (!rawValue) return [];

    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (question): question is Pick<Question, "question"> &
          Partial<Question> =>
          typeof question?.question === "string" &&
          question.question.trim().length > 0,
      )
      .map((question, index) => ({
        id: createMergedQuestionId("stored_custom", question as Question, index),
        questionId:
          typeof question.questionId === "number"
            ? question.questionId
            : undefined,
        question: question.question,
        maxLength:
          typeof question.maxLength === "number" ? question.maxLength : 1000,
        selected: true,
        custom: true,
      }));
  } catch {
    return [];
  }
}

function uniqueQuestionsByContent(questions: Question[]) {
  return questions.reduce<Question[]>((acc, question) => {
    if (acc.some((savedQuestion) => isSameQuestion(savedQuestion, question))) {
      return acc;
    }

    return [...acc, question];
  }, []);
}

function mergeDuplicateQuestions(questions: Question[]) {
  return questions.reduce<Question[]>((acc, question) => {
    const existingIndex = acc.findIndex((savedQuestion) =>
      isSameQuestion(savedQuestion, question),
    );

    if (existingIndex === -1) {
      return [...acc, question];
    }

    const existingQuestion = acc[existingIndex];
    const mergedQuestion = {
      ...existingQuestion,
      questionId: existingQuestion.questionId ?? question.questionId,
      maxLength: existingQuestion.maxLength ?? question.maxLength,
      selected: existingQuestion.selected || question.selected,
      custom: existingQuestion.custom || question.custom,
    };

    return acc.map((savedQuestion, index) =>
      index === existingIndex ? mergedQuestion : savedQuestion,
    );
  }, []);
}

function saveStoredCustomQuestions(applyId: number, questions: Question[]) {
  if (typeof window === "undefined") return;

  const uniqueQuestions = questions.reduce<Question[]>((acc, question) => {
    if (!question.custom) return acc;
    if (acc.some((savedQuestion) => isSameQuestion(savedQuestion, question))) {
      return acc;
    }

    return [
      ...acc,
      {
        id: question.id,
        questionId: question.questionId,
        question: question.question,
        maxLength: question.maxLength ?? 1000,
        custom: true,
      },
    ];
  }, []);

  window.sessionStorage.setItem(
    getCustomQuestionsStorageKey(applyId),
    JSON.stringify(uniqueQuestions),
  );
}

function mergeStoredCustomQuestions(
  candidates: Question[],
  storedCustomQuestions: Question[],
) {
  if (storedCustomQuestions.length === 0) {
    return candidates;
  }

  const customQuestions = storedCustomQuestions
    .filter(
      (storedQuestion) =>
        !candidates.some((candidate) =>
          isSameQuestion(candidate, storedQuestion),
        ),
    )
    .map((storedQuestion) => ({
      ...storedQuestion,
      selected: true,
      custom: true,
    }));

  const mergedCandidates = candidates.map((candidate) => {
    const storedQuestion = storedCustomQuestions.find((question) =>
      isSameQuestion(candidate, question),
    );

    return storedQuestion
      ? {
          ...candidate,
          maxLength: candidate.maxLength ?? storedQuestion.maxLength,
          selected: true,
          custom: true,
        }
      : candidate;
  });

  return [...customQuestions, ...mergedCandidates];
}

function mergeSelectedQuestions(
  candidates: Question[],
  selectedQuestions: Question[],
  storedCustomQuestions: Question[],
) {
  const selectedQuestionsWithState = selectedQuestions.map((question) => ({
    ...question,
    selected: true,
  }));
  const storedAndSelectedCustomQuestions = uniqueQuestionsByContent([
    ...selectedQuestionsWithState.filter((question) => question.custom),
    ...storedCustomQuestions,
  ]);
  const mergedCandidates = mergeStoredCustomQuestions(
    candidates,
    storedAndSelectedCustomQuestions,
  ).map((candidate) => {
    const selectedQuestion = selectedQuestionsWithState.find((question) =>
      isSameQuestion(candidate, question),
    );

    return selectedQuestion
      ? {
          ...candidate,
          maxLength: candidate.maxLength ?? selectedQuestion.maxLength,
          selected: true,
          custom: candidate.custom || selectedQuestion.custom || false,
        }
      : candidate;
  });
  const missingSelectedQuestions = selectedQuestionsWithState
    .filter(
      (selectedQuestion) =>
        !mergedCandidates.some((candidate) =>
          isSameQuestion(candidate, selectedQuestion),
        ),
    )
    .map((question, index) => ({
      ...question,
      id: createMergedQuestionId("selected", question, index),
      maxLength: question.maxLength ?? 1000,
      selected: true,
      custom: question.custom ?? false,
    }));

  return [...missingSelectedQuestions, ...mergedCandidates];
}

export default function SelectQuestion({
  applyId,
  onSelectionChange,
  onQuestionsChange,
}: SelectQuestionProps) {
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<
    "normal" | "check" | "warning" | "dark"
  >("normal");
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const customIdCounterRef = useRef(0);
  const onSelectionChangeRef = useRef(onSelectionChange);
  const onQuestionsChangeRef = useRef(onQuestionsChange);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
    onQuestionsChangeRef.current = onQuestionsChange;
  }, [onQuestionsChange, onSelectionChange]);

  const notify = useCallback(
    (nextIds: string[], currentQuestions: Question[]) => {
      const selected = currentQuestions.filter((question) =>
        nextIds.includes(question.id),
      );

      onSelectionChangeRef.current?.(selected.length);
      onQuestionsChangeRef.current?.(selected);
    },
    [],
  );

  const persistSelectedCustomQuestions = useCallback(
    (nextIds: string[], currentQuestions: Question[]) => {
      saveStoredCustomQuestions(
        applyId,
        currentQuestions.filter(
          (question) => nextIds.includes(question.id) && question.custom,
        ),
      );
    },
    [applyId],
  );

  useEffect(() => {
    let ignore = false;

    Promise.allSettled([
      fetchQuestions(applyId),
      fetchSelectedQuestions(applyId),
    ])
      .then(([questionsResult, selectedQuestionsResult]) => {
        if (ignore) return;

        setErrorMessage("");

        const fetchedQuestions =
          questionsResult.status === "fulfilled" ? questionsResult.value : [];
        const fetchedSelectedQuestions =
          selectedQuestionsResult.status === "fulfilled"
            ? selectedQuestionsResult.value
            : [];
        const storedCustomQuestions = readStoredCustomQuestions(applyId);
        const baseQuestions =
          fetchedQuestions.length > 0 ||
          fetchedSelectedQuestions.length > 0 ||
          storedCustomQuestions.length > 0
            ? fetchedQuestions
            : DEFAULT_QUESTIONS;
        const nextQuestions = mergeSelectedQuestions(
          baseQuestions,
          fetchedSelectedQuestions,
          storedCustomQuestions,
        );
        const dedupedQuestions = mergeDuplicateQuestions(nextQuestions);
        const selectionSources =
          fetchedSelectedQuestions.length > 0
            ? fetchedSelectedQuestions
            : [
                ...storedCustomQuestions,
                ...dedupedQuestions.filter((question) => question.selected),
              ];
        const selectedQuestionRefs = uniqueQuestionsByContent(
          selectionSources,
        ).slice(0, MAX_SELECT);
        const normalizedQuestions = dedupedQuestions.map((question) => ({
          ...question,
          selected: selectedQuestionRefs.some((selectedQuestion) =>
            isSameQuestion(question, selectedQuestion),
          ),
        }));
        const preSelected = normalizedQuestions
          .filter((q) => q.selected)
          .map((q) => q.id);

        setQuestions(normalizedQuestions);
        setSelectedIds(preSelected);
        persistSelectedCustomQuestions(preSelected, normalizedQuestions);
        notify(preSelected, normalizedQuestions);
      })
      .catch(() => {
        if (ignore) return;

        setQuestions(DEFAULT_QUESTIONS);
        setSelectedIds([]);
        notify([], DEFAULT_QUESTIONS);
        setErrorMessage("");
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [applyId, notify, persistSelectedCustomQuestions]);

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

  const handleChange = (id: string, isSelected: boolean) => {
    if (isSelected) {
      if (selectedIds.length >= MAX_SELECT) return;
      const next = [...selectedIds, id];
      setSelectedIds(next);
      persistSelectedCustomQuestions(next, questions);
      notify(next, questions);
      return;
    }

    const next = selectedIds.filter((questionId) => questionId !== id);
    setSelectedIds(next);
    persistSelectedCustomQuestions(next, questions);
    notify(next, questions);
  };

  const handleRemove = (id: string) => {
    const next = selectedIds.filter((questionId) => questionId !== id);
    setSelectedIds(next);
    persistSelectedCustomQuestions(next, questions);
    notify(next, questions);
    showToast("문항이 삭제되었습니다.", "normal");
  };

  const handleAdd = (question: string, maxLength: number) => {
    if (selectedIds.length >= MAX_SELECT) {
      return;
    }

    customIdCounterRef.current += 1;

    const newQuestion = {
      id: `custom_${customIdCounterRef.current}`,
      question,
      maxLength,
      custom: true,
    };
    const nextQuestions = [newQuestion, ...questions];

    const next = [...selectedIds, newQuestion.id];

    setQuestions(nextQuestions);
    setSelectedIds(next);
    persistSelectedCustomQuestions(next, nextQuestions);
    notify(next, nextQuestions);
    showToast("문항이 추가되었습니다.", "check");
  };

  const selectedQuestions = questions.filter((question) =>
    selectedIds.includes(question.id),
  );

  return (
    <>
      <main className="mx-auto w-full max-w-[1116px]">
        {isOpen && (
          <AddQuestion onClose={() => setIsOpen(false)} onAdd={handleAdd} />
        )}
        <h1 className="my-8 text-center text-h24-bold">
          답변할 문항을 5가지 선택해주세요.
        </h1>
        <div className="flex gap-6">
          <section
            aria-label="left-container"
            className="flex-2 flex h-[540px] flex-col rounded-card-l bg-fill-quaternary-default px-8 py-7 shadow-card"
          >
            <div className="mb-8 flex flex-row items-start justify-between">
              <h2 className="text-t20-semibold">질문 목록</h2>
              <Button
                label="직접 추가"
                type="button"
                size="small"
                styleType="secondary"
                iconType="ADD_S"
                disabled={selectedIds.length >= MAX_SELECT}
                onClick={() => setIsOpen(true)}
              />
            </div>
            <div
              className={`-m-8 mt-1 mr-[1.5px] mb-[1.5px] flex min-h-0 flex-1 flex-col gap-2 overflow-visible overflow-y-auto px-8 ${scrollbarClass}`}
            >
              {isLoading ? (
                <p className="mt-20 flex items-center justify-center text-t20-semibold text-text-neutral-disabled">
                  문항을 불러오는 중입니다.
                </p>
              ) : errorMessage ? (
                <p className="mt-20 flex items-center justify-center text-center text-t20-semibold text-text-neutral-disabled">
                  {errorMessage}
                </p>
              ) : questions.length > 0 ? (
                questions.map((question) => (
                  <ListQ
                    key={question.id}
                    question={question.question}
                    selected={selectedIds.includes(question.id)}
                    maxReached={selectedIds.length >= MAX_SELECT}
                    isCustom={question.custom === true}
                    onChange={(isSelected) =>
                      handleChange(question.id, isSelected)
                    }
                  />
                ))
              ) : (
                <p className="mt-20 flex items-center justify-center text-t20-semibold text-text-neutral-disabled">
                  불러온 문항이 없습니다.
                </p>
              )}
            </div>
          </section>

          <section
            aria-label="right-container"
            className="flex h-[496px] flex-1 flex-col gap-8 rounded-card-l bg-fill-quaternary-assistive p-7 shadow-card"
          >
            <div className="flex items-center gap-3">
              <h3 className="text-t20-semibold text-text-neutral-description">
                선택 목록
              </h3>
              <span className="text-t20-semibold text-text-neutral-disabled">
                {selectedQuestions.length}/{MAX_SELECT}
              </span>
            </div>
            <div
              className={`flex min-h-0 w-full flex-1 flex-col gap-2 overflow-y-auto ${scrollbarClass}`}
            >
              {selectedQuestions.length > 0 ? (
                selectedQuestions.map((question) => (
                  <ListQCart
                    key={question.id}
                    question={question.question}
                    onChange={() => handleRemove(question.id)}
                  />
                ))
              ) : (
                <p className="mt-20 flex items-center justify-center text-t20-semibold text-text-neutral-disabled">
                  선택한 문항이 없습니다.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>

      {toastVisible && (
        <div className="fixed right-5 bottom-8 z-50">
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
