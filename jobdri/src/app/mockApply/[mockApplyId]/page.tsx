"use client";
import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/common/header/Header";
import { QuestionList } from "@/components/mockApply/Question/QuestionList";
import JDSidePanel from "@/components/mockApply/Question/SidePanel";
import SideHeaderContainer from "@/components/common/header/SideHeaderContainer";
import WritingForm from "@/components/mockApply/Question/WritingForm";
import clsx from "clsx";
import { scrollbarClassS } from "@/components/common/scrollbar/scrollbarStyles";
import {
  fetchSelectedQuestions,
  saveQuestions,
  saveApply,
  type QuestionItem,
} from "@/lib/api/questions";
import { ModalCard } from "@/components/common/modal/ModalCard";
import { Toast, type ToastVariant } from "@/components/common/toast";
import { CtaFooter } from "@/components/common/cta";
import { fetchCreditBalance } from "@/lib/api/credit";
import { requestAnalysis } from "@/lib/api/analysis";

const ModalOverlay = ({ children }: { children: React.ReactNode }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
    {children}
  </div>
);

export default function MockApplyPage({
  params,
}: {
  params: Promise<{ mockApplyId: string }>;
}) {
  const { mockApplyId } = use(params);
  const router = useRouter();

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string>("저장 전");

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    variant?: string;
  }>({
    open: false,
    message: "",
    variant: "normal",
  });
  const [modalTarget, setModalTarget] = useState<string | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCreditShortModalOpen, setIsCreditShortModalOpen] = useState(false);
  const [applicationLabel, setApplicationLabel] = useState<string>("");

  // 데이터 포맷팅 함수
  const getSubmitPayload = (questionsData: QuestionItem[]) => {
    return questionsData.map((q) => ({
      questionId: q.questionId,
      content: q.question,
      charLimit: q.maxLength ?? 1000,
      answer: q.answer || "",
    }));
  };

  // 초기 데이터 불러오기
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchSelectedQuestions(Number(mockApplyId));
        setQuestions(data);
        if (data && data.length > 0) setSelectedId(data[0].id);
      } catch (error) {
        console.error("문항을 불러오지 못했습니다.", error);
      }
    };
    loadQuestions();
  }, [mockApplyId]);

  // 자동 저장 타이머
  useEffect(() => {
    if (!toast.open || toast.variant !== "check") return;

    const retryToastTimer = window.setTimeout(() => {
      setToast({ open: false, message: "", variant: "normal" });
    }, 3000);

    return () => window.clearTimeout(retryToastTimer);
  }, [toast.open, toast.variant]);

  useEffect(() => {
    if (questions.length === 0) return;

    const autoSaveTimer = setTimeout(async () => {
      try {
        await saveApply(Number(mockApplyId), getSubmitPayload(questions));

        const now = new Date();
        const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
        setLastSavedTime(timeString);
        console.log("자동 저장 완료!", timeString);
      } catch (error) {
        console.error("자동 저장 실패:", error);
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [questions, mockApplyId]);

  // 핸들러
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

  const handleConfirm = async () => {
    try {
      await saveApply(Number(mockApplyId), getSubmitPayload(questions));
      const response = await requestAnalysis(Number(mockApplyId));
      const taskId = response.taskId;

      router.push(
        `/mockApply/${mockApplyId}/result/resume-analysis-loading?taskId=${taskId}`,
      );
    } catch (error) {
      console.error("제출 실패:", error);
      alert("채점 요청 중 오류가 발생했습니다.");
    }
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

  const handleUpdate = (field: string, value: string) => {
    if (!selectedId) return;
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== selectedId) return q;
        if (field === "title") return { ...q, question: value };
        if (field === "answer") return { ...q, answer: value };
        if (field === "maxLength") return { ...q, maxLength: Number(value) };
        return q;
      }),
    );
  };

  const handleAddQuestion = async () => {
    if (questions.length >= 5) return;
    try {
      const newQuestion: QuestionItem = {
        id: `temp-${Date.now()}`,
        questionId: 0,
        question: "새로운 문항",
        answer: "",
        maxLength: 1000,
        custom: true,
      };

      const updatedQuestions = [...questions, newQuestion];
      await saveQuestions(Number(mockApplyId), updatedQuestions);

      const refreshedQuestions = await fetchSelectedQuestions(
        Number(mockApplyId),
      );
      setQuestions(refreshedQuestions);

      const lastQuestion = refreshedQuestions[refreshedQuestions.length - 1];
      if (lastQuestion) setSelectedId(lastQuestion.id);
    } catch (error) {
      console.error("문항 추가 실패:", error);
      setToast({
        open: true,
        message: "문항 추가에 실패했어요. 잠시 후 다시 시도해주세요.",
        variant: "normal",
      });
    }
  };

  const handleTrySubmit = async () => {
    try {
      const currentCredit = await fetchCreditBalance();
      setIsConfirmModalOpen(false);

      if (currentCredit > 0) {
        await handleConfirm();
      } else {
        setIsCreditShortModalOpen(true);
      }
    } catch (error) {
      console.error("크레딧 조회/저장 실패:", error);
      setToast({
        open: true,
        message: "오류가 발생했어요. 잠시 후 다시 시도해주세요.",
      });
      setTimeout(
        () => setToast({ open: false, message: "", variant: "normal" }),
        3000,
      );
    }
  };

  // 현재 선택된 문항 폼 데이터
  const currentQ = questions.find((q) => q.id === selectedId);
  const mappedQuestionForForm = currentQ
    ? {
        title: currentQ.question,
        answer: currentQ.answer || "",
        maxLength: String(currentQ.maxLength || 1000),
      }
    : null;

  return (
    <div className="flex flex-col h-dvh bg-bg-default overflow-hidden">
      <Header
        currentStep={4}
        lastSavedAt={lastSavedTime}
        applicationLabel={applicationLabel}
      />

      <main
        className={clsx(
          "flex-1 flex gap-6 transition-all duration-300 ease-in-out",
          isPanelOpen ? "mr-[300px]" : "mr-0",
        )}
      >
        <div className={clsx("flex flex-col shrink-0 ", scrollbarClassS)}>
          <SideHeaderContainer
            leading={2}
            title="자소서를 작성해주세요"
            subtitle="공고의 문항을 추가하고, 각 문항에 답변을 입력해 주세요."
            element={
              <QuestionList
                questions={questions}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onAdd={handleAddQuestion}
                onDelete={handleDeleteQuestion}
              />
            }
          />
        </div>

        <div
          className={clsx(
            "flex-1 overflow-y-auto flex flex-col pt-16 pl-16 pr-[40px]",
            scrollbarClassS,
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

      <CtaFooter
        backAction={{ onClick: () => setIsLeaveModalOpen(true) }}
        nextAction={{
          label: "채점하기",
          onClick: () => setIsConfirmModalOpen(true),
          disabled:
            !mappedQuestionForForm ||
            questions.some((q) => !(q.answer || "").trim()),
          iconType: "SPARKLE",
        }}
      />

      <JDSidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onOpen={() => setIsPanelOpen(true)}
      />

      {toast.open && (
        <Toast
          message={toast.message}
          variant="normal"
          position="top"
          onClose={() => setToast({ ...toast, open: false })}
          className="absolute top-6"
        />
      )}

      {modalTarget && (
        <ModalOverlay>
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
        </ModalOverlay>
      )}

      {isLeaveModalOpen && (
        <ModalOverlay>
          <ModalCard
            title="페이지를 나가시겠어요?"
            description="자동 저장 이후 작성된 내용은 저장되지 않아요."
            secondaryBtn="취소"
            primaryBtn="나가기"
            onSecondaryClick={() => setIsLeaveModalOpen(false)}
            onPrimaryClick={() => {
              setIsLeaveModalOpen(false);
              router.push(`/mockApply/actual/${mockApplyId}/jd-review`);
            }}
          />
        </ModalOverlay>
      )}

      {isConfirmModalOpen && (
        <ModalOverlay>
          <ModalCard
            title="이대로 채점할까요?"
            description="지원 시 1 크레딧이 차감되며, 취소할 수 없어요."
            secondaryBtn="닫기"
            primaryBtn="지원하기"
            onSecondaryClick={() => setIsConfirmModalOpen(false)}
            onPrimaryClick={handleTrySubmit}
          />
        </ModalOverlay>
      )}

      {isCreditShortModalOpen && (
        <ModalOverlay>
          <ModalCard
            title="크레딧이 부족해요"
            description="크레딧을 충전하고 다시 시도해주세요."
            secondaryBtn="닫기"
            primaryBtn="충전하기"
            onSecondaryClick={() => setIsCreditShortModalOpen(false)}
            onPrimaryClick={() => setIsCreditShortModalOpen(false)}
          />
        </ModalOverlay>
      )}
    </div>
  );
}
