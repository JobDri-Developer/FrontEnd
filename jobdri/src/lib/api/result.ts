import {
  API_BASE_URL,
  getAuthHeaders,
  parseApiResponse as parseApiResponseBase,
} from "@/lib/api/client";

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

export interface MissingKeyword {
  keyword: string;
  source: string; // 'mainTask', 'qualification', 'preference' 등 Enum 값
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

export interface KeyEvaluation {
  title: string;
  quote: string;
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
  keyStrengths?: KeyEvaluation[];
  keyWeaknesses?: KeyEvaluation[];
  missingKeywords: MissingKeyword[];
  questions: AnalysisQuestion[];
}

async function parseApiResponse<T>(
  response: Response,
  fallbackMessage: string,
) {
  if (response.status === 402) {
    throw new CreditInsufficientError();
  }

  return parseApiResponseBase<T>(response, fallbackMessage);
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

export async function fetchAnalysisResult(
  mockApplyId: number,
  signal?: AbortSignal,
): Promise<AnalysisResult> {
  const response = await fetch(
    `${API_BASE_URL}/api/mock-applies/${mockApplyId}/analysis`,
    {
      method: "GET",
      headers: getAuthHeaders(),
      signal,
    },
  );

  return parseApiResponse<AnalysisResult>(
    response,
    "자소서 분석 결과를 불러오는데 실패했습니다.",
  );
}
