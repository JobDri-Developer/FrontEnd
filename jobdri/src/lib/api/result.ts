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
  cached: boolean;
  resultAvailable: boolean;
}

export function isCachedAnalysisResultAvailable({
  status,
  cached,
  resultAvailable,
}: RequestAnalysisResponse) {
  return (
    status.trim().toUpperCase() === "SUCCEEDED" &&
    cached === true &&
    resultAvailable === true
  );
}

export interface AnalysisTaskStep {
  code: string;
  label: string;
  status: string;
}

export interface AnalysisTaskStatus {
  taskId: string;
  mockApplyId: number;
  status: string;
  message: string;
  error: string | null;
  failureReason: string | null;
  workerId: string | null;
  retryCount: number;
  maxRetryCount: number;
  queueLatencyMillis: number;
  createdAt: string | null;
  submittedAt: string | null;
  lastAttemptAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  cancelRequested: boolean;
  cancelledAt: string | null;
  currentStep: string | null;
  progressPercent: number;
  estimatedRemainingSeconds: number;
  steps: AnalysisTaskStep[];
  result: AnalysisResult | null;
}

export interface AnalysisTaskStreamEvent {
  event?: string;
  id?: string;
  retry?: number;
  data: string;
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

export async function fetchAnalysisTaskStatus(
  mockApplyId: number,
  taskId: string,
  signal?: AbortSignal,
): Promise<AnalysisTaskStatus> {
  const response = await fetch(
    `${API_BASE_URL}/api/mock-applies/${mockApplyId}/analysis/async/${encodeURIComponent(taskId)}`,
    {
      headers: getAuthHeaders(),
      cache: "no-store",
      signal,
    },
  );
  const task = await parseApiResponse<AnalysisTaskStatus>(
    response,
    "자소서 분석 상태를 조회하지 못했습니다.",
  );

  return {
    ...task,
    result: task.result ? normalizeAnalysisResult(task.result) : null,
  };
}

function parseAnalysisTaskStreamEvent(
  eventBlock: string,
): AnalysisTaskStreamEvent | null {
  const dataLines: string[] = [];
  let event: string | undefined;
  let id: string | undefined;
  let retry: number | undefined;

  eventBlock
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .forEach((line) => {
      if (!line || line.startsWith(":")) {
        return;
      }

      const separatorIndex = line.indexOf(":");
      const field =
        separatorIndex === -1 ? line : line.slice(0, separatorIndex);
      const rawValue =
        separatorIndex === -1 ? "" : line.slice(separatorIndex + 1);
      const value = rawValue.startsWith(" ") ? rawValue.slice(1) : rawValue;

      if (field === "data") {
        dataLines.push(value);
      } else if (field === "event") {
        event = value;
      } else if (field === "id") {
        id = value;
      } else if (field === "retry") {
        const parsedRetry = Number(value);
        if (Number.isFinite(parsedRetry)) {
          retry = parsedRetry;
        }
      }
    });

  if (dataLines.length === 0 && !event && !id) {
    return null;
  }

  return {
    event,
    id,
    retry,
    data: dataLines.join("\n"),
  };
}

function findAnalysisTaskStreamEventBoundary(value: string) {
  const separators = ["\r\n\r\n", "\n\n", "\r\r"];
  let firstMatch: { index: number; length: number } | null = null;

  for (const separator of separators) {
    const index = value.indexOf(separator);

    if (index === -1 || (firstMatch && index >= firstMatch.index)) {
      continue;
    }

    firstMatch = { index, length: separator.length };
  }

  return firstMatch;
}

export async function subscribeAnalysisTaskStream(
  mockApplyId: number,
  taskId: string,
  {
    signal,
    onEvent,
  }: {
    signal?: AbortSignal;
    onEvent: (event: AnalysisTaskStreamEvent) => void;
  },
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/mock-applies/${mockApplyId}/analysis/async/${encodeURIComponent(taskId)}/stream`,
    {
      headers: {
        Accept: "text/event-stream",
        ...getAuthHeaders(),
      },
      cache: "no-store",
      signal,
    },
  );

  if (response.status === 401) {
    handleUnauthorized();
  }

  if (!response.ok) {
    throw new Error("자소서 분석 실시간 상태 연결에 실패했습니다.");
  }

  if (!response.body) {
    throw new Error("자소서 분석 실시간 상태 응답을 확인할 수 없습니다.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const emitBufferedEvents = (flush = false) => {
    let boundary = findAnalysisTaskStreamEventBoundary(buffer);

    while (boundary) {
      const eventBlock = buffer.slice(0, boundary.index);
      buffer = buffer.slice(boundary.index + boundary.length);
      const event = parseAnalysisTaskStreamEvent(eventBlock);

      if (event) {
        onEvent(event);
      }

      boundary = findAnalysisTaskStreamEventBoundary(buffer);
    }

    if (flush && buffer.trim()) {
      const event = parseAnalysisTaskStreamEvent(buffer);
      if (event) {
        onEvent(event);
      }
      buffer = "";
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        buffer += decoder.decode();
        emitBufferedEvents(true);
        return;
      }

      buffer += decoder.decode(value, { stream: true });
      emitBufferedEvents();
    }
  } finally {
    reader.releaseLock();
  }
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
