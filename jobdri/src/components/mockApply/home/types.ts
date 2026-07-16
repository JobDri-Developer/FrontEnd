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
  totalSteps: number;
  stepLabel: string;
  updatedAt: string;
  // logoUrl?: string; // 실제 API에서는 로고 이미지 URL을 받을 수 있습니다.
}

export const MOCK_API_DATA: DraftData[] = [
  {
    id: "1",
    companyName: "당근마켓",
    position: "그로스 프로덕트 디자이너",
    currentStep: 1,
    totalSteps: 3,
    stepLabel: "공고 확인",
    updatedAt: "오늘",
  },
  {
    id: "2",
    companyName: "당근마켓",
    position: "그로스 프로덕트 디자이너",
    currentStep: 1,
    totalSteps: 3,
    stepLabel: "공고 확인",
    updatedAt: "오늘",
  },
  {
    id: "3",
    companyName: "당근마켓",
    position: "그로스 프로덕트 디자이너",
    currentStep: 1,
    totalSteps: 3,
    stepLabel: "공고 확인",
    updatedAt: "오늘",
  },
];
