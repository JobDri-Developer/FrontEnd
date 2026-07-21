import {
  API_BASE_URL,
  getAuthHeaders,
  parseApiResponse,
} from "@/lib/api/client";

export interface MissingKeyword {
  keyword: string;
  source: string;
}

export interface QuestionAnalysis {
  questionAnalysisId: number;

  sentence: string;
  statua: string;
  reason: string;
  improvement: string;
  stary: number;
  end: number;
}

export interface QuestionResult {
  questionId: number;
  questionContent: string;
  answer: string;
  analyses: QuestionAnalysis[];
}

export interface AnalysisResultResponse {
  mockApplyId: number;
  analysisId: number;
  status: string;
  sequence: number;
  score: number;
  jobFit: number;
  impact: number;
  completeness: number;
  feedback: string;
  missingKeywords: MissingKeyword[];
  questions: QuestionResult[];
}

export interface RequestAnalysisResponse {
  taskId: string;
  status: string;
  message: string;
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

  return await parseApiResponse<RequestAnalysisResponse>(
    response,
    "자소서 분석 요청에 실패했습니다.",
  );
}

// GET 요청 함수
export async function getAnalysisResult(
  mockApplyId: number,
): Promise<AnalysisResultResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/mock-applies/${mockApplyId}/analysis`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    if (errorData?.code === "ANALYSIS_4041") {
      throw new Error("ANALYSIS_PENDING");
    }

    throw new Error(errorData?.message || "결과를 불러오는데 실패했습니다.");
  }

  const data = await response.json();
  return data.result;
}
