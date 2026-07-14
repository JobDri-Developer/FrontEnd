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
}
