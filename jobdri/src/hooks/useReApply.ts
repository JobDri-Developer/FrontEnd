"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  type MockApplyRetryResult,
  retryMockApply,
  updateMockApplyResumeStatus,
  saveMockApplyResumeRecord,
} from "@/lib/api/mockApplies";

interface ReApplyOptions {
  getRedirectPath?: (result: MockApplyRetryResult) => string;
}

export function useReApply() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const reApply = async (mockApplyId: number, options?: ReApplyOptions) => {
    if (isSaving || !mockApplyId) return null;
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
        options?.getRedirectPath?.(result) ??
          `/mockApply/${result.mockApplyId}?retry=1&sequence=${result.sequence}`,
      );
      return result;
    } catch {
      setIsSaving(false);
      return null;
    }
  };

  return { reApply, isSaving };
}
