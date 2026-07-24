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
import { ModalOverlay } from "@/components/common/modal/ModalOverlay";

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
  }>({ open: false, message: "", variant: "normal" });

  const [modalTarget, setModalTarget] = useState<string | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCreditShortModalOpen, setIsCreditShortModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getSubmitPayload = (questionsData: QuestionItem[]) => {
    return questionsData.map((q) => ({
      questionId: q.questionId,
      content: q.question,
      charLimit: q.maxLength ?? 1000,
      answer: q.answer || "",
    }));
  };

  // 1. 초기 데이터 불러오기
  useEffect(() => {
    let ignore = false;

    const loadQuestions = async () => {
      try {
        setIsQuestionsLoading(true);
        setQuestionsErrorMessage("");

        let data = await fetchSelectedQuestions(Number(mockApplyId));

        if (data.length > 5) {
          data = data.slice(0, 5);
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

  // 2. 공고 시퀀스 불러오기
  useEffect(() => {
    if (hasRequestedJobPostingId) return;
    let ignore = false;
    fetchSequence(Number(mockApplyId))
      .then((sequence) => {
        if (!ignore) setSequenceJobPostingId(sequence.jobPostingId);
      })
      .catch((error) => {
        if (!ignore)
          console.error("연결된 채용 공고를 확인하지 못했습니다.", error);
      });
    return () => {
      ignore = true;
    };
  }, [hasRequestedJobPostingId, mockApplyId]);

  // 3. JD 데이터 불러오기
  useEffect(() => {
    if (!jobPostingId) return;
    let ignore = false;
    fetchMyJobPosting(jobPostingId)
      .then((jobPosting) => {
        if (ignore) return;
        setJdData({
          companyName: jobPosting.companyName,
          profileColor: jobPosting.profileColor,
          title:
            jobPosting.jobTitle ||
            jobPosting.detailClassificationName ||
            "채용 공고",
          sections: [
            {
              subtitle: "직무",
              content:
                jobPosting.jobTitle || jobPosting.detailClassificationName,
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
        if (!ignore) console.error("채용 공고를 불러오지 못했습니다.", error);
      });
    return () => {
      ignore = true;
    };
  }, [jobPostingId]);

  // 4. 토스트 타이머
  useEffect(() => {
    if (!toast.open || toast.variant !== "check") return;
    const retryToastTimer = window.setTimeout(() => {
      setToast({ open: false, message: "", variant: "normal" });
    }, 3000);
    return () => window.clearTimeout(retryToastTimer);
  }, [toast.open, toast.variant]);

  // --- 이벤트 핸들러 모음 ---

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsConfirmModalOpen(false);

    try {
      const savedApply = await saveApply(
        Number(mockApplyId),
        getSubmitPayload(questions),
      );
      const acceptedAnalysis = await requestAnalysis(Number(mockApplyId));
      const analysisTaskId = acceptedAnalysis.taskId?.trim();

      if (!analysisTaskId)
        throw new Error("자소서 분석 작업 번호를 확인할 수 없습니다.");

      let resolvedJobPostingId = jobPostingId;
      if (!resolvedJobPostingId || resolvedJobPostingId <= 0) {
        try {
          const sequenceResult = await fetchSequence(Number(mockApplyId));
          resolvedJobPostingId = sequenceResult.jobPostingId;
        } catch (error) {
          console.warn(
            "분석 결과에 연결할 채용 공고를 확인하지 못했습니다.",
            error,
          );
        }
      }

      const loadingSearchParams = new URLSearchParams();
      loadingSearchParams.set("taskId", analysisTaskId);
      if (savedApply.sequence > 0)
        loadingSearchParams.set("sequence", String(savedApply.sequence));
      if (resolvedJobPostingId && resolvedJobPostingId > 0)
        loadingSearchParams.set("jobPostingId", String(resolvedJobPostingId));

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

  const performDelete = async (targetId: string) => {
    setQuestions(questions.filter((q) => q.id !== targetId));
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
    try {
      const newQuestion: QuestionItem = {
        id: `temp-${Date.now()}`, // 임시 ID
        questionId: 0,
        question: "",
        answer: "",
        maxLength: 1000,
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
      nextLabel="채점하기"
      nextIconType="SPARKLE"
    >
      <div
        className={clsx(
          "flex h-full flex-col overflow-hidden bg-bg-defaul",
          scrollbarClassS,
        )}
      >
        <main
          className={clsx(
            "flex-1 flex gap-6 transition-all duration-300 ease-in-out",
            isPanelOpen ? "mr-[300px]" : "mr-0",
          )}
        >
          <div className="flex min-h-0 flex-1 items-center justify-between self-stretch w-full">
            <aside className="flex min-h-0 w-[360px] shrink-0 flex-col items-start justify-between self-stretch pt-20 pr-0 pb-16 pl-20">
              <div className="flex w-full flex-col items-start gap-8">
                <div className="flex flex-col items-start gap-5">
                  <h1 className="whitespace-pre-line text-h24-bold text-text-neutral-title [font-feature-settings:'liga'_off,'clig'_off]">
                    {"지원한 회사 기준으로\n채점하고 있어요"}
                  </h1>
                </div>

                <QuestionList
                  questions={questions}
                  selectedId={selectedId}
                  onSelect={(id) => setSelectedId(id)}
                  onDelete={handleDeleteQuestion}
                  onAdd={handleAddQuestion}
                />
              </div>
            </aside>

            <div
              className={clsx(
                "flex-1 overflow-y-auto flex flex-col pt-16 pl-16 pr-[40px] items-center",
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
              title="공고 확인으로 돌아갈까요?"
              description="지금까지 작성한 내용이 모두 삭제돼요."
              secondaryBtn="돌아가기"
              primaryBtn="계속 작성"
              onSecondaryClick={() => {
                setIsLeaveModalOpen(false);
                router.push("/mockApply/job/review");
              }}
              onPrimaryClick={() => setIsLeaveModalOpen(false)}
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
