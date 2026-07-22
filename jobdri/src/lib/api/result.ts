import {
  type ApiResponse,
  API_BASE_URL,
  getAuthHeaders,
  handleUnauthorized,
  parseApiResponse as parseApiResponseBase,
} from "@/lib/api/client";

export class CreditInsufficientError extends Error {
  constructor() {
    super("크레딧이 부족합니다.");
    this.name = "CreditInsufficientError";
  }
}

export class AnalysisPendingError extends Error {
  constructor() {
    super("자소서 분석이 진행 중입니다.");
    this.name = "AnalysisPendingError";
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
  keyStrengths: KeyEvaluation[];
  keyWeaknesses: KeyEvaluation[];
  missingKeywords: MissingKeyword[];
  questions: AnalysisQuestion[];
}

export interface RequestAnalysisResponse {
  taskId: string;
  status: string;
  message: string;
}

export function normalizeAnalysisResult(result: AnalysisResult) {
  return {
    ...result,
    keyStrengths: result.keyStrengths ?? [],
    keyWeaknesses: result.keyWeaknesses ?? [],
    missingKeywords: result.missingKeywords ?? [],
    questions: (result.questions ?? []).map((question) => ({
      ...question,
      analyses: (question.analyses ?? []).map((analysis) => ({
        ...analysis,
        status: analysis.status.trim().toLowerCase(),
      })),
    })),
  } satisfies AnalysisResult;
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

  return normalizeAnalysisResult(
    await parseApiResponse<AnalysisResult>(
      response,
      "자소서 분석에 실패했습니다.",
    ),
  );
}

export async function requestAnalysis(mockApplyId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/mock-applies/${mockApplyId}/analysis`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    },
  );

  return parseApiResponse<RequestAnalysisResponse>(
    response,
    "자소서 분석 요청에 실패했습니다.",
  );
}

async function parseAnalysisResultResponse(response: Response) {
  if (response.status === 401) {
    handleUnauthorized();
  }

  let data: ApiResponse<AnalysisResult> | null = null;

  try {
    data = (await response.json()) as ApiResponse<AnalysisResult>;
  } catch {
    throw new Error("자소서 분석 결과 응답을 확인할 수 없습니다.");
  }

  if (data.code === "ANALYSIS_4041") {
    throw new AnalysisPendingError();
  }

  if (!response.ok || !data.isSuccess || !data.result) {
    throw new Error(
      data.error || data.message || "자소서 분석 결과를 불러오지 못했습니다.",
    );
  }

  return normalizeAnalysisResult(data.result);
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
      cache: "no-store",
      signal,
    },
  );

  return parseAnalysisResultResponse(response);
}
