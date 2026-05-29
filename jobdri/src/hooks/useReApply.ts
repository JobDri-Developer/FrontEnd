"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  retryMockApply,
  updateMockApplyResumeStatus,
  saveMockApplyResumeRecord,
} from "@/lib/api/mockApplies";

export function useReApply() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const reApply = async (mockApplyId: number) => {
    if (isSaving || !mockApplyId) return;
    setIsSaving(true);

    try {
      updateMockApplyResumeStatus(mockApplyId, "COMPLETED");
      const result = await retryMockApply(mockApplyId);
      saveMockApplyResumeRecord({
        jobPostingId: result.jobPostingId,
        mockApplyId: result.mockApplyId,
        status: "ANSWER_WRITE",
      });
      router.push(
        `/mockApply/actual/${result.mockApplyId}/write?jobPostingId=${result.jobPostingId}`,
      );
    } catch {
      setIsSaving(false);
    }
  };

  return { reApply, isSaving };
}
