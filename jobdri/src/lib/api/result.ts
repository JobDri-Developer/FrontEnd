import { getAuthHeaders } from "../auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface SequenceResult {
  jobPostingId: number;
  mockApplyId: number;
  totalCount: number;
  sequence: number;
}

export interface QuestionAnalysis {
  questionAnalysisId: number;
  sentence: string;
  status: string;
  reason: string;
  improvement: string;
  start: number;
  end: number;
}

export interface AnalysisQuestion {
  questionId: number;
  questionContent: string;
  answer: string;
  analyses: QuestionAnalysis[];
}

export interface AnalysisResult {
  mockApplyId: number;
  analysisId: number;
  status: string;
  score: number;
  jobFit: number;
  impact: number;
  completeness: number;
  feedback: string;
  questions: AnalysisQuestion[];
}

interface ApiResponse<T> {
  result: T;
  error: string | null;
}

export async function fetchSequence(
  mockApplyId: number,
): Promise<SequenceResult> {
  const response = await fetch(
    `${BASE_URL}/api/mock-applies/${mockApplyId}/sequence`,
    { headers: getAuthHeaders() },
  );
  if (!response.ok) throw new Error("순번 조회에 실패했습니다.");
  const { result }: ApiResponse<SequenceResult> = await response.json();
  return result;
}

export async function fetchAnalysis(
  mockApplyId: number,
): Promise<AnalysisResult> {
  const response = await fetch(
    `${BASE_URL}/api/mock-applies/${mockApplyId}/analysis`,
    { headers: getAuthHeaders() },
  );
  if (!response.ok) throw new Error("자소서 분석에 실패했습니다.");
  const { result }: ApiResponse<AnalysisResult> = await response.json();
  return result;
}
