"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/common/footer";
import Header from "@/components/common/header/Header";
import { HeaderPanel } from "@/components/common/header/HeaderPanel";
import { QuestionList } from "@/components/mockApply/Question/QuestionList";
import JDSidePanel from "@/components/mockApply/Question/SidePanel";
import SideHeaderContainer from "@/components/common/header/SideHeaderContainer";
import WritingForm from "@/components/mockApply/Question/WritingForm";
import clsx from "clsx";
import { scrollbarClass } from "@/components/common/scrollbar/scrollbarStyles";
interface QuestionsPageClientProps {
  id: string;
}

export default function QuestionsPageClient({ id }: QuestionsPageClientProps) {
  const router = useRouter();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState({
    title: "",
    answer: "",
    maxLength: "1000",
  });

  const handleUpdate = (field: string, value: string) => {
    setSelectedQuestion((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-bg-default overflow-hidden">
      <Header currentStep={4} />

      <main
        className={clsx(
          "flex-1 flex p-6 gap-6 transition-all duration-300 ease-in-out",
          isPanelOpen ? "mr-[300px]" : "mr-0",
        )}
      >
        <div className={clsx("flex flex-col shrink-0 py-16 pl-18 w-80")}>
          <SideHeaderContainer
            leading={2}
            title="자소서를 작성해주세요"
            subtitle="공고의 문항을 추가하고, 각 문항에 답변을 입력해 주세요."
            element={
              <QuestionList
                onSelect={(q) =>
                  setSelectedQuestion({
                    title: q.title,
                    answer: q.content || "",
                    maxLength: "1000",
                  })
                }
              />
            }
          />
        </div>

        <div
          className={clsx(
            "flex-1 h-fit flex flex-col items-start pt-16 pl-16 pb-30 mr-10",
          )}
        >
          <div className="w-[clamp(600px,100%,1000px)]">
            <WritingForm question={selectedQuestion} onChange={handleUpdate} />
          </div>
        </div>
      </main>

      <Footer
        ctaLabel="확정하기"
        backAction={{ href: `/mockApply/actual/${id}/jd-review` }}
        ctaAction={{
          disabled: selectedQuestion.answer.length === 0,
        }}
      />

      <JDSidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onOpen={() => setIsPanelOpen(true)}
      />
    </div>
  );
}
