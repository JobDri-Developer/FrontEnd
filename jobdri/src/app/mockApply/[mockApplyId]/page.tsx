// "use client";
// import { useState, useEffect, use } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Header from "@/components/common/header/Header";
// import { QuestionList } from "@/components/mockApply/Question/QuestionList";
// import JDSidePanel from "@/components/mockApply/Question/SidePanel";
// import SideHeaderContainer from "@/components/common/header/SideHeaderContainer";
// import WritingForm from "@/components/mockApply/Question/WritingForm";
// import clsx from "clsx";
// import { scrollbarClass } from "@/components/common/scrollbar/scrollbarStyles";
// import {
//   fetchSelectedQuestions,
//   saveQuestions,
//   saveApply,
//   type QuestionItem,
// } from "@/lib/api/questions";
// import { ModalCard } from "@/components/common/modal/ModalCard";
// import { Toast, type ToastVariant } from "@/components/common/toast";
// import { CtaFooter } from "@/components/common/cta";
// import { fetchCreditBalance } from "@/lib/api/credit";
// import { formatApplicationSequenceLabel } from "@/lib/mockApply/applicationLabel";

// export default function MockApplyPage({
//   params,
// }: {
//   params: Promise<{ mockApplyId: string }>;
// }) {
//   const { mockApplyId } = use(params);

//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const isRetryMode = searchParams.get("retry") === "1";
//   const sequenceParam = Number(searchParams.get("sequence"));
//   const retrySequence =
//     Number.isFinite(sequenceParam) && sequenceParam > 0 ? sequenceParam : 2;
//   const applicationLabel = isRetryMode
//     ? formatApplicationSequenceLabel(retrySequence)
//     : undefined;
//   const [isPanelOpen, setIsPanelOpen] = useState(false);
//   const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
//   const [isCreditShortModalOpen, setIsCreditShortModalOpen] = useState(false);
//   const [questions, setQuestions] = useState<QuestionItem[]>([]);
//   const [selectedId, setSelectedId] = useState<string | null>(null);
//   const [toast, setToast] = useState<{
//     open: boolean;
//     message: string;
//     variant: ToastVariant;
//   }>(() => ({
//     open: isRetryMode,
//     message: isRetryMode
//       ? "기존 내용이 유지되었어요. 수정하고 다시 채점해 보세요!"
//       : "",
//     variant: isRetryMode ? "check" : "normal",
//   }));
//   const [modalTarget, setModalTarget] = useState<string | null>(null);
//   const [lastSavedTime, setLastSavedTime] = useState<string>("저장 전");

//   useEffect(() => {
//     if (!toast.open || toast.variant !== "check") return;

//     const retryToastTimer = window.setTimeout(() => {
//       setToast({ open: false, message: "", variant: "normal" });
//     }, 3000);

//     return () => window.clearTimeout(retryToastTimer);
//   }, [toast.open, toast.variant]);

//   useEffect(() => {
//     if (questions.length === 0) return;
//     const autoSaveTimer = setTimeout(async () => {
//       try {
//         const answersToSubmit = questions.map((q) => ({
//           questionId: q.questionId!,
//           answer: q.answer || "",
//         }));
//         await saveApply(Number(mockApplyId), answersToSubmit);
//         const now = new Date();
//         const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
//         setLastSavedTime(timeString);

//         console.log("✅ 자동 저장 완료!", timeString);
//       } catch (error) {
//         console.error("자동 저장 실패:", error);
//       }
//     }, 2000);
//     return () => clearTimeout(autoSaveTimer);
//   }, [questions, mockApplyId]);

//   const performDelete = (targetId: string) => {
//     setQuestions((prev) => {
//       const targetIndex = prev.findIndex((q) => q.id === targetId);
//       const newList = prev.filter((q) => q.id !== targetId);
//       if (selectedId === targetId && newList.length > 0) {
//         const newSelectedIndex = Math.max(0, targetIndex - 1);
//         setSelectedId(newList[newSelectedIndex].id);
//       }
//       return newList;
//     });

//     setToast({
//       open: true,
//       message: "문항이 삭제되었어요",
//       variant: "normal",
//     });
//     setTimeout(
//       () => setToast({ open: false, message: "", variant: "normal" }),
//       3000,
//     );
//   };

//   useEffect(() => {
//     const loadQuestions = async () => {
//       try {
//         const data = await fetchSelectedQuestions(Number(mockApplyId));
//         setQuestions(data);

//         if (data && data.length > 0) {
//           setSelectedId(data[0].id);
//         }
//       } catch (error) {
//         console.error("문항을 불러오지 못했습니다.", error);
//       }
//     };

//     loadQuestions();
//   }, [mockApplyId]);

//   const currentQ = questions.find((q) => q.id === selectedId);
//   const mappedQuestionForForm = currentQ
//     ? {
//         title: currentQ.question,
//         answer: currentQ.answer || "",
//         maxLength: String(currentQ.maxLength || 1000),
//       }
//     : null;

//   const handleUpdate = (field: string, value: string) => {
//     if (!selectedId) return;

//     setQuestions((prevQuestions) =>
//       prevQuestions.map((q) => {
//         if (q.id !== selectedId) return q;

//         if (field === "title") return { ...q, question: value };
//         if (field === "answer") return { ...q, answer: value };
//         if (field === "maxLength") return { ...q, maxLength: Number(value) };

//         return q;
//       }),
//     );
//   };

//   const handleConfirm = async () => {
//     const answersToSubmit = questions.map((q) => ({
//       questionId: q.questionId!,
//       answer: q.answer || "",
//     }));

//     const saveResult = await saveApply(Number(mockApplyId), answersToSubmit);

//     if (isRetryMode) {
//       const loadingParams = new URLSearchParams({
//         mockApplyId,
//         sequence: String(saveResult.sequence || retrySequence),
//       });

//       router.push(`/mockApply/resume-analysis-loading?${loadingParams}`);
//       return;
//     }

//     router.push(`/mockApply/${mockApplyId}/result/`);
//   };
//   const handleAddQuestion = async () => {
//     if (questions.length >= 5) return;

//     try {
//       const newQuestion: QuestionItem = {
//         id: `temp-${Date.now()}`,
//         questionId: 0,
//         question: "새 문항",
//         answer: "",
//         maxLength: 1000,
//         custom: true,
//       };

//       const updatedQuestions = [...questions, newQuestion];

//       await saveQuestions(Number(mockApplyId), updatedQuestions);

//       const refreshedQuestions = await fetchSelectedQuestions(
//         Number(mockApplyId),
//       );

//       setQuestions(refreshedQuestions);

//       const lastQuestion = refreshedQuestions[refreshedQuestions.length - 1];
//       if (lastQuestion) {
//         setSelectedId(lastQuestion.id);
//       }
//     } catch (error) {
//       console.error("문항 추가에 실패했습니다.", error);
//       setToast({
//         open: true,
//         message: "문항 추가에 실패했어요. 잠시 후 다시 시도해주세요.",
//         variant: "normal",
//       });
//     }
//   };

//   const handleDeleteQuestion = (targetId: string) => {
//     const targetQ = questions.find((q) => q.id === targetId);
//     const hasContent =
//       (targetQ?.question?.trim() || "") !== "" ||
//       (targetQ?.answer?.trim() || "") !== "";

//     if (hasContent) {
//       setModalTarget(targetId);
//     } else {
//       performDelete(targetId);
//     }
//   };

//   const handleTrySubmit = async () => {
//     let hasCredit = false;

//     try {
//       const currentCredit = await fetchCreditBalance();
//       hasCredit = currentCredit > 0;

//       if (!hasCredit) {
//         setIsCreditShortModalOpen(true);
//       }
//     } catch (error) {
//       console.error("크레딧 조회 실패:", error);
//       setToast({
//         open: true,
//         message: "크레딧 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.",
//         variant: "normal",
//       });
//       setTimeout(
//         () => setToast({ open: false, message: "", variant: "normal" }),
//         3000,
//       );
//     }

//     if (!hasCredit) {
//       return;
//     }

//     try {
//       await handleConfirm();
//     } catch {
//       alert("답변 저장에 실패했습니다.");
//     }
//   };

//   return (
//     <div className="flex flex-col h-dvh bg-bg-default overflow-hidden">
//       <Header
//         currentStep={4}
//         lastSavedAt={lastSavedTime}
//         applicationLabel={applicationLabel}
//       />

//       <main
//         className={clsx(
//           "flex-1 flex gap-6 transition-all duration-300 ease-in-out",
//           isPanelOpen ? "mr-[300px]" : "mr-0",
//         )}
//       >
//         <div className={clsx("flex flex-col shrink-0 ", scrollbarClass)}>
//           <SideHeaderContainer
//             leading={2}
//             title="자소서를 작성해주세요"
//             subtitle="공고의 문항을 추가하고, 각 문항에 답변을 입력해 주세요."
//             element={
//               <QuestionList
//                 questions={questions}
//                 selectedId={selectedId}
//                 onSelect={(id) => setSelectedId(id)}
//                 onAdd={handleAddQuestion}
//                 onDelete={handleDeleteQuestion}
//               />
//             }
//           />
//         </div>

//         <div
//           className={clsx(
//             "flex-1 overflow-y-auto flex flex-col pt-16 pl-16 pr-[40px]",
//             scrollbarClass,
//           )}
//         >
//           <div className="w-full min-w-[600px] max-w-[1000px]">
//             {mappedQuestionForForm ? (
//               <WritingForm
//                 question={mappedQuestionForForm}
//                 onChange={handleUpdate}
//               />
//             ) : (
//               <div className="flex h-full items-center justify-center text-text-neutral-assistive">
//                 문항을 불러오는 중입니다...
//               </div>
//             )}
//           </div>
//         </div>
//       </main>

//       <CtaFooter
//         backAction={{
//           onClick: () => setIsLeaveModalOpen(true),
//         }}
//         nextAction={{
//           label: isRetryMode ? "채점하기" : "제출하기",
//           onClick: handleTrySubmit,
//           disabled:
//             !mappedQuestionForForm ||
//             questions.some((q) => !(q.answer || "").trim()),
//           iconType: "SPARKLE",
//         }}
//       />

//       <JDSidePanel
//         isOpen={isPanelOpen}
//         onClose={() => setIsPanelOpen(false)}
//         onOpen={() => setIsPanelOpen(true)}
//       />

//       {modalTarget && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
//           <ModalCard
//             title="문항을 삭제할까요?"
//             description="작성한 내용이 모두 사라집니다."
//             secondaryBtn="취소"
//             errorBtn="삭제"
//             onSecondaryClick={() => setModalTarget(null)}
//             onErrorClick={() => {
//               performDelete(modalTarget);
//               setModalTarget(null);
//             }}
//           />
//         </div>
//       )}

//       {toast.open && (
//         <Toast
//           message={toast.message}
//           variant={toast.variant}
//           position="top"
//           onClose={() => setToast({ ...toast, open: false })}
//           className="absolute top-6"
//         />
//       )}

//       {isLeaveModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
//           <ModalCard
//             title="페이지를 나가시겠어요?"
//             description="자동 저장 이후 작성된 내용은 저장되지 않아요."
//             secondaryBtn="취소"
//             primaryBtn="나가기"
//             onSecondaryClick={() => setIsLeaveModalOpen(false)}
//             onPrimaryClick={() => {
//               setIsLeaveModalOpen(false);
//               router.push(`/mockApply/actual/${mockApplyId}/jd-review`);
//             }}
//           />
//         </div>
//       )}

//       {isCreditShortModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
//           <ModalCard
//             title="크레딧이 부족해요"
//             description="크레딧을 충전하고 다시 시도해주세요."
//             secondaryBtn="닫기"
//             primaryBtn="충전하기"
//             onSecondaryClick={() => setIsCreditShortModalOpen(false)}
//             onPrimaryClick={() => {
//               setIsCreditShortModalOpen(false);
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
