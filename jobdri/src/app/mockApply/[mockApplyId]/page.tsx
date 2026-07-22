"use client";
import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QuestionList } from "@/components/mockApply/Question/QuestionList";
import JDSidePanel from "@/components/mockApply/Question/SidePanel";
import SideHeaderContainer from "@/components/common/header/SideHeaderContainer";
import WritingForm from "@/components/mockApply/Question/WritingForm";
import clsx from "clsx";
import { scrollbarClassS } from "@/components/common/scrollbar/scrollbarStyles";
import {
  fetchQuestions,
  fetchSelectedQuestions,
  saveQuestions,
  saveApply,
  type QuestionItem,
} from "@/lib/api/questions";
import { ModalCard } from "@/components/common/modal/ModalCard";
import { Toast } from "@/components/common/toast";
import {
  CreditInsufficientError,
  fetchSequence,
  requestAnalysis,
} from "@/lib/api/result";
import MockApplyTemplate from "@/components/common/MockApplyTemplate";
import { fetchMyJobPosting } from "@/lib/api/jobPostings";
import type { JDData } from "@/components/mockApply/Question/SidePanel";
import { saveJobPostingAnalysis } from "@/app/mockApply/job/jobPostingDraftStore";

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
  const searchParams = useSearchParams();
  const requestedJobPostingId = Number(searchParams.get("jobPostingId"));
  const hasRequestedJobPostingId =
    Number.isInteger(requestedJobPostingId) && requestedJobPostingId > 0;

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(true);
  const [questionsErrorMessage, setQuestionsErrorMessage] = useState("");
  const [jdData, setJdData] = useState<JDData | null>(null);
  const [sequenceJobPostingId, setSequenceJobPostingId] = useState<
    number | null
  >(null);
  const jobPostingId = hasRequestedJobPostingId
    ? requestedJobPostingId
    : sequenceJobPostingId;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    let ignore = false;

    const loadQuestions = async () => {
      try {
        setIsQuestionsLoading(true);
        setQuestionsErrorMessage("");

        const [selectedResult, candidatesResult] = await Promise.allSettled([
          fetchSelectedQuestions(Number(mockApplyId)),
          fetchQuestions(Number(mockApplyId)),
        ]);
        let data =
          selectedResult.status === "fulfilled" ? selectedResult.value : [];

        if (data.length === 0) {
          if (candidatesResult.status === "rejected") {
            throw candidatesResult.reason;
          }

          const candidates = candidatesResult.value;
          const preselectedCandidates = candidates.filter(
            (question) => question.selected,
          );
          const initialQuestions = (
            preselectedCandidates.length > 0
              ? preselectedCandidates
              : candidates
          ).slice(0, 5);

          if (initialQuestions.length > 0) {
            await saveQuestions(Number(mockApplyId), initialQuestions);
            const savedQuestions = await fetchSelectedQuestions(
              Number(mockApplyId),
            ).catch(() => []);
            data = savedQuestions.length > 0
              ? savedQuestions
              : initialQuestions;
          }
        }

        if (ignore) {
          return;
        }

        setQuestions(data);
        setSelectedId(data[0]?.id ?? null);

        if (data.length === 0) {
          setQuestionsErrorMessage(
            "공고에 맞는 자소서 문항을 불러오지 못했습니다.",
          );
        }
      } catch (error) {
        if (ignore) {
          return;
        }

        console.error("문항을 불러오지 못했습니다.", error);
        setQuestions([]);
        setSelectedId(null);
        setQuestionsErrorMessage(
          error instanceof Error
            ? error.message
            : "자소서 문항을 불러오지 못했습니다.",
        );
      } finally {
        if (!ignore) {
          setIsQuestionsLoading(false);
        }
      }
    };

    void loadQuestions();

    return () => {
      ignore = true;
    };
  }, [mockApplyId]);

  useEffect(() => {
    if (hasRequestedJobPostingId) {
      return;
    }

    let ignore = false;

    fetchSequence(Number(mockApplyId))
      .then((sequence) => {
        if (!ignore) {
          setSequenceJobPostingId(sequence.jobPostingId);
        }
      })
      .catch((error) => {
        if (!ignore) {
          console.error("연결된 채용 공고를 확인하지 못했습니다.", error);
        }
      });

    return () => {
      ignore = true;
    };
  }, [hasRequestedJobPostingId, mockApplyId]);

  useEffect(() => {
    if (!jobPostingId) {
      return;
    }

    let ignore = false;

    fetchMyJobPosting(jobPostingId)
      .then((jobPosting) => {
        if (ignore) {
          return;
        }

        setJdData({
          companyName: jobPosting.companyName,
          title: jobPosting.detailClassificationName || "채용 공고",
          sections: [
            {
              subtitle: "직무",
              content: jobPosting.detailClassificationName,
            },
            { subtitle: "주요 업무", content: jobPosting.task },
            { subtitle: "자격요건", content: jobPosting.requirement },
            { subtitle: "우대사항", content: jobPosting.preferred },
          ].filter((section) => section.content.trim().length > 0),
        });
        saveJobPostingAnalysis({
          savedToDatabase: true,
          message: "저장된 채용 공고를 불러왔습니다.",
          extracted: null,
          candidates: [],
          classification: null,
          generated: null,
          saved: jobPosting,
        });
      })
      .catch((error) => {
        if (!ignore) {
          console.error("채용 공고를 불러오지 못했습니다.", error);
        }
      });

    return () => {
      ignore = true;
    };
  }, [jobPostingId]);

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
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setIsConfirmModalOpen(false);

    try {
      const savedApply = await saveApply(
        Number(mockApplyId),
        getSubmitPayload(questions),
      );
      await requestAnalysis(Number(mockApplyId));
      const loadingSearchParams = new URLSearchParams();

      if (savedApply.sequence > 0) {
        loadingSearchParams.set("sequence", String(savedApply.sequence));
      }

      const loadingQuery = loadingSearchParams.size
        ? `?${loadingSearchParams.toString()}`
        : "";

      router.push(
        `/mockApply/${mockApplyId}/result/resume-analysis-loading${loadingQuery}`,
      );
    } catch (error) {
      setIsSubmitting(false);

      if (error instanceof CreditInsufficientError) {
        setIsCreditShortModalOpen(true);
        return;
      }

      console.error("제출 실패:", error);
      setToast({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : "채점 요청 중 오류가 발생했습니다.",
        variant: "normal",
      });
      window.setTimeout(
        () => setToast({ open: false, message: "", variant: "normal" }),
        3000,
      );
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

  // 현재 선택된 문항 폼 데이터
  const currentQ = questions.find((q) => q.id === selectedId);
  const mappedQuestionForForm = currentQ
    ? {
        title: currentQ.question,
        answer: currentQ.answer || "",
        maxLength: String(currentQ.maxLength || 1000),
      }
    : null;
  const isSubmitDisabled =
    !mappedQuestionForForm ||
    questions.some((question) => !(question.answer || "").trim());

  return (
    <MockApplyTemplate
      mockApplyId={Number(mockApplyId)}
      currentStep={4}
      companyName={jdData?.companyName ?? ""}
      jobTitle={jdData?.title ?? ""}
      lastSavedAt={lastSavedTime}
      onBackClick={() => setIsLeaveModalOpen(true)}
      onNextClick={() => setIsConfirmModalOpen(true)}
      isNextDisabled={isSubmitDisabled || isSubmitting}
    >
      <div className="flex h-full flex-col overflow-hidden bg-bg-default">
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
              ) : isQuestionsLoading ? (
                <div className="flex h-full items-center justify-center text-text-neutral-assistive">
                  문항을 불러오는 중입니다...
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-text-neutral-assistive">
                  {questionsErrorMessage}
                </div>
              )}
            </div>
          </div>
        </main>

        <JDSidePanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          onOpen={() => setIsPanelOpen(true)}
          data={jdData ?? undefined}
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
                router.push("/mockApply/job/review");
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
              onPrimaryClick={handleConfirm}
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
              onPrimaryClick={() => router.push("/credit")}
            />
          </ModalOverlay>
        )}
      </div>
    </MockApplyTemplate>
  );
}
