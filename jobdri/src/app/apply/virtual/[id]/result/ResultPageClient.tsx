"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/header/Header";
import ApplyResult from "@/components/apply/result/ApplyResult";
import {
  getMockApplyResumeRecords,
  saveMockApplyResumeRecord,
  updateMockApplyResumeStatus,
} from "@/lib/api/mockApplies";
import { getJdReviewSavedStorageKey } from "@/components/mock-application/jdReviewSections";
import type { SavedJobPosting } from "@/lib/api/jobPostings";

interface ResultPageClientProps {
  id: string;
}

function getSavedJobPosting(applyId: string) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.sessionStorage.getItem(
      getJdReviewSavedStorageKey(applyId),
    );

    return rawValue ? (JSON.parse(rawValue) as SavedJobPosting) : null;
  } catch {
    return null;
  }
}

export default function ResultPageClient({ id }: ResultPageClientProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const applyId = Number(id);

  const handleSave = () => {
    if (isSaving) return;

    setIsSaving(true);

    const hasResumeRecord = getMockApplyResumeRecords().some(
      (record) => record.mockApplyId === applyId,
    );

    if (hasResumeRecord) {
      updateMockApplyResumeStatus(applyId, "COMPLETED");
    } else {
      const savedJobPosting = getSavedJobPosting(id);

      if (savedJobPosting?.jobPostingId) {
        saveMockApplyResumeRecord({
          jobPostingId: savedJobPosting.jobPostingId,
          mockApplyId: applyId,
          status: "COMPLETED",
        });
      }
    }

    router.push("/apply");
  };

  return (
    <div className="flex h-screen flex-col bg-bg-default">
      <Header
        currentStep={6}
        rightAction={{
          label: "저장하기",
          onClick: handleSave,
          disabled: isSaving,
        }}
      />
      <main className="mx-auto w-full flex-1 flex flex-col overflow-hidden">
        <ApplyResult applyId={applyId} />
      </main>
    </div>
  );
}
