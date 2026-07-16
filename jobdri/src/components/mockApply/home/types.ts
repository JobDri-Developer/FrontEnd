import type { JobPostingApplyType } from "@/lib/api/mockApplies";

export interface ApplicationCardData {
  id: number;
  jobPostingId: number;
  company: string;
  hasCompanyName?: boolean;
  position: string;
  createdAt: string;
  createdAtTime?: number;
  score?: number;
  mockApplyId: number;
  resumePath?: string | null;
  status?: string;
  applyType?: JobPostingApplyType;
  version: number;
}

// types.ts (또는 해당 파일 상단)
export interface DraftData {
  id: string;
  companyName: string;
  position: string;
  currentStep: number;
  updatedAt: string;
  // logoUrl?: string; // 실제 API에서는 로고 이미지 URL을 받을 수 있습니다.
}
