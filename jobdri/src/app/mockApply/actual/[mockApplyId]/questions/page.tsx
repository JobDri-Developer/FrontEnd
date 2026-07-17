"use client";

// 🔥 1. React에서 use를 가져옵니다.
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/common/footer";
import Header from "@/components/common/header/Header";
import { QuestionList } from "@/components/mockApply/Question/QuestionList";
import JDSidePanel from "@/components/mockApply/Question/SidePanel";
import SideHeaderContainer from "@/components/common/header/SideHeaderContainer";
import WritingForm from "@/components/mockApply/Question/WritingForm";
import clsx from "clsx";
import { scrollbarClass } from "@/components/common/scrollbar/scrollbarStyles";
import {
  fetchSelectedQuestions,
  saveApply,
  type QuestionItem,
} from "@/lib/api/questions";
import { ModalCard } from "@/components/common/modal/ModalCard";
import { Toast } from "@/components/common/toast";

export default function QuestionsPage({
  params,
}: {
  params: Promise<{ mockApplyId: string }>;
}) {
  const { mockApplyId } = use(params);

  const router = useRouter();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });
  const [modalTarget, setModalTarget] = useState<string | null>(null);

  const performDelete = (targetId: string) => {
    setQuestions((prev) => {
      const targetIndex = prev.findIndex((q) => q.id === targetId);
      const newList = prev.filter((q) => q.id !== targetId);
      if (selectedId === targetId && newList.length > 0) {
        const newSelectedIndex = Math.max(0, targetIndex - 1);
        setSelectedId(newList[newSelectedIndex].id);
      }
      return newList;
    });

    setToast({ open: true, message: "문항이 삭제되었어요" });
    setTimeout(() => setToast({ open: false, message: "" }), 3000);
  };

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchSelectedQuestions(Number(mockApplyId));
        setQuestions(data);

        if (data && data.length > 0) {
          setSelectedId(data[0].id);
        }
      } catch (error) {
        console.error("문항을 불러오지 못했습니다.", error);
      }
    };

    loadQuestions();
  }, [mockApplyId]);

  const currentQ = questions.find((q) => q.id === selectedId);
  const mappedQuestionForForm = currentQ
    ? {
        title: currentQ.question,
        answer: currentQ.answer || "",
        maxLength: String(currentQ.maxLength || 1000),
      }
    : null;

  const handleUpdate = (field: string, value: string) => {
    if (!selectedId) return;

    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => {
        if (q.id !== selectedId) return q;

        if (field === "title") return { ...q, question: value };
        if (field === "answer") return { ...q, answer: value };
        if (field === "maxLength") return { ...q, maxLength: Number(value) };

        return q;
      }),
    );
  };

  const handleConfirm = async () => {
    try {
      const answersToSubmit = questions.map((q) => ({
        questionId: q.questionId!,
        answer: q.answer || "",
      }));

      await saveApply(Number(mockApplyId), answersToSubmit);
      router.push(`/mockApply/actual/${mockApplyId}/jd-review`);
    } catch (error) {
      console.error("답변 저장 실패:", error);
      alert("답변 저장에 실패했습니다.");
    }
  };

  const handleAddQuestion = () => {
    if (questions.length >= 5) return;
    const newId = `custom-${Date.now()}`;
    const newQuestion: QuestionItem = {
      id: newId,
      question: "",
      answer: "",
      maxLength: 1000,
      custom: true,
    };

    setQuestions((prev) => [...prev, newQuestion]);
    setSelectedId(newId);
  };

  const handleDeleteQuestion = (targetId: string) => {
    const targetQ = questions.find((q) => q.id === targetId);
    const hasContent =
      (targetQ?.question?.trim() || "") !== "" ||
      (targetQ?.answer?.trim() || "") !== "";

    if (hasContent) {
      setModalTarget(targetId);
    } else {
      performDelete(targetId);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-bg-default overflow-hidden">
      <Header currentStep={4} />

      <main
        className={clsx(
          "flex-1 flex gap-6 transition-all duration-300 ease-in-out",
          isPanelOpen ? "mr-[300px]" : "mr-0",
        )}
      >
        <div className={clsx("flex flex-col shrink-0 ", scrollbarClass)}>
          <SideHeaderContainer
            leading={2}
            title="자소서를 작성해주세요"
            subtitle="공고의 문항을 추가하고, 각 문항에 답변을 입력해 주세요."
            element={
              <QuestionList
                questions={questions}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId(id)}
                onAdd={handleAddQuestion}
                onDelete={handleDeleteQuestion}
              />
            }
          />
        </div>

        <div
          className={clsx(
            "flex-1 overflow-y-auto flex flex-col pt-16 pl-16 pb-30 pr-[40px]",
            scrollbarClass,
          )}
        >
          <div className="w-full min-w-[600px] max-w-[1000px]">
            {mappedQuestionForForm ? (
              <WritingForm
                question={mappedQuestionForForm}
                onChange={handleUpdate}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-text-neutral-assistive">
                문항을 불러오는 중입니다...
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer
        ctaLabel="채점하기"
        backAction={{ href: `/mockApply/actual/${mockApplyId}/jd-review` }}
        ctaAction={{
          onClick: handleConfirm,
          disabled:
            !mappedQuestionForForm ||
            questions.some((q) => !(q.answer || "").trim()),
        }}
      />

      <JDSidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onOpen={() => setIsPanelOpen(true)}
      />

      {modalTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <ModalCard
            title="문항을 삭제할까요?"
            description="작성한 내용이 모두 사라집니다."
            secondaryBtn="취소"
            errorBtn="삭제"
            onSecondaryClick={() => setModalTarget(null)}
            onErrorClick={() => {
              performDelete(modalTarget);
              setModalTarget(null);
            }}
          />
        </div>
      )}

      {toast.open && (
        <Toast
          message={toast.message}
          variant="normal"
          position="top"
          onClose={() => setToast({ ...toast, open: false })}
          className="absolute top-6"
        />
      )}
    </div>
  );
}
