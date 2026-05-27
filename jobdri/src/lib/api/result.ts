import { API_BASE_URL, getAuthHeaders } from "@/lib/auth";

export class CreditInsufficientError extends Error {
  constructor() {
    super("크레딧이 부족합니다.");
    this.name = "CreditInsufficientError";
  }
}

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
  improvement: string;
}

export interface AnalysisResult {
  mockApplyId: number;
  analysisId: number;
  status: string;
  sequence: number;
  score: number;
  jobFit: number;
  impact: number;
  completeness: number;
  feedback: string;
  questions: AnalysisQuestion[];
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T | null;
  error: string | null;
}

async function parseApiResponse<T>(
  response: Response,
  fallbackMessage: string,
) {
  if (response.status === 402) {
    throw new CreditInsufficientError();
  }

  let data: ApiResponse<T> | null = null;

  try {
    data = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error(`${fallbackMessage} 응답을 확인할 수 없습니다.`);
  }

  if (!response.ok || !data.isSuccess || !data.result) {
    throw new Error(data?.error || data?.message || fallbackMessage);
  }

  return data.result;
}

export async function fetchSequence(
  mockApplyId: number,
): Promise<SequenceResult> {
  const response = await fetch(
    `${API_BASE_URL}/api/mock-applies/${mockApplyId}/sequence`,
    { headers: getAuthHeaders() },
  );

  return parseApiResponse<SequenceResult>(
    response,
    "순번 조회에 실패했습니다.",
  );
}


export async function fetchAnalysisByJobPosting(
  jobPostingId: number,
  sequence: number,
  signal?: AbortSignal,
): Promise<AnalysisResult> {
  const url = new URL(
    `${API_BASE_URL}/api/job-postings/${jobPostingId}/analysis`,
  );
  url.searchParams.set("sequence", String(sequence));

  const response = await fetch(url.toString(), {
    headers: getAuthHeaders(),
    cache: "no-store",
    signal,
  });

  return parseApiResponse<AnalysisResult>(
    response,
    "자소서 분석에 실패했습니다.",
  );
}

export async function runAnalysis(
  mockApplyId: number,
): Promise<AnalysisResult> {
  const response = await fetch(
    `${API_BASE_URL}/api/mock-applies/${mockApplyId}/analysis`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    },
  );

  return parseApiResponse<AnalysisResult>(
    response,
    "자소서 분석 실행에 실패했습니다.",
  );
}
