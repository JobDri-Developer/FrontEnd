"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/common/footer";
import SelectQuestion, {
  type Question,
} from "@/components/mockApply/SelectQuestion";
import Header from "@/components/common/header/Header";
import { saveQuestions } from "@/lib/api/questions";
import {
  getMockApplyResumeRecords,
  updateMockApplyResumeStatus,
} from "@/lib/api/mockApplies";

interface QuestionsPageClientProps {
  id: string;
}

export default function QuestionsPageClient({ id }: QuestionsPageClientProps) {
  const router = useRouter();
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

  const handleConfirm = async () => {
    const mockApplyId = Number(id);
    const jobPostingId = getMockApplyResumeRecords().find(
      (record) => record.mockApplyId === mockApplyId,
    )?.jobPostingId;

    await saveQuestions(Number(id), selectedQuestions);
    updateMockApplyResumeStatus(mockApplyId, "ANSWER_WRITE");
    router.push(
      `/mockApply/actual/${id}/write${
        jobPostingId ? `?jobPostingId=${jobPostingId}` : ""
      }`,
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg-default">
      <Header currentStep={4} />
      <main className="mx-auto w-full max-w-[1116px] flex-1">
        <SelectQuestion
          applyId={Number(id)}
          onSelectionChange={() => {}}
          onQuestionsChange={setSelectedQuestions}
        />
      </main>
      <Footer
        ctaLabel="확정하기"
        backAction={{ href: `/mockApply/actual/${id}/jd-review` }}
        ctaAction={{
          disabled: selectedQuestions.length === 0,
          onClick: handleConfirm,
        }}
      />
    </div>
  );
}
