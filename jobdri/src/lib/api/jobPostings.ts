import { API_BASE_URL, AUTH_STORAGE_KEYS } from "@/lib/auth";

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T | null;
  error: string | null;
}

export interface JobPostingExtracted {
  companyName: string;
  jobTitle: string;
  task: string;
  requirements: string;
  preferredQualifications: string;
  rawText: string;
  confidence: number;
}

export interface JobPostingCandidate {
  detailClassificationId: number;
  detailClassificationName: string;
  middleClassificationName: string;
  bigClassificationName: string;
  score: number;
}

export interface JobPostingClassification {
  detailClassificationId: number;
  detailClassificationName: string;
  middleClassificationName: string;
  bigClassificationName: string;
  reason: string;
  confidence: number;
}

export interface JobPostingGenerated {
  companyName: string;
  jobTitle: string;
  task: string;
  requirements: string;
  preferredQualifications: string;
  summary: string;
}

export interface SavedJobPosting {
  jobPostingId: number;
  userId: number;
  companyId: number;
  companyName: string;
  companySize: string;
  detailClassificationId: number;
  detailClassificationName: string;
  task: string;
  requirement: string;
  preferred: string;
}

export interface JobPostingSavePayload {
  companyName: string;
  companySize: string;
  detailClassificationId: number;
  task: string;
  requirement: string;
  preferred: string;
}

export interface JobPostingProcessedResult {
  savedToDatabase: boolean;
  message: string;
  extracted: JobPostingExtracted | null;
  candidates: JobPostingCandidate[];
  classification: JobPostingClassification | null;
  generated: JobPostingGenerated | null;
  saved: SavedJobPosting | null;
}

export interface JobPostingIngestAccepted {
  taskId: string;
  status: string;
  message: string;
}

export interface JobPostingIngestStatus {
  taskId: string;
  status: string;
  message: string;
  error: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  result: JobPostingProcessedResult | null;
}

interface JobPostingFormInput {
  rawText?: string;
  sourceUrl?: string;
  image?: File | null;
}

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)
      : null;

  return token ? { Authorization: `Bearer ${token}` } : {};
}

function createJobPostingFormData({
  rawText,
  sourceUrl,
  image,
}: JobPostingFormInput) {
  const formData = new FormData();
  const trimmedRawText = rawText?.trim();
  const trimmedSourceUrl = sourceUrl?.trim();

  if (trimmedRawText) {
    formData.append("rawText", trimmedRawText);
  }

  if (trimmedSourceUrl) {
    formData.append("sourceUrl", trimmedSourceUrl);
  }

  if (image) {
    formData.append("image", image);
  }

  if (!trimmedRawText && !trimmedSourceUrl && !image) {
    throw new Error("공고 내용, 링크 또는 이미지를 입력해주세요.");
  }

  return formData;
}

async function parseApiResponse<T>(response: Response, fallbackMessage: string) {
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

async function postJobPostingForm<T>(
  path: string,
  input: JobPostingFormInput,
  fallbackMessage: string,
) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: createJobPostingFormData(input),
  });

  return parseApiResponse<T>(response, fallbackMessage);
}

export function extractJobPosting(input: JobPostingFormInput) {
  return postJobPostingForm<JobPostingExtracted>(
    "/api/job-postings/extract",
    input,
    "채용 공고 정보를 추출하지 못했습니다.",
  );
}

export function ingestJobPosting(input: JobPostingFormInput) {
  return postJobPostingForm<JobPostingIngestAccepted>(
    "/api/job-postings/ingest",
    input,
    "채용 공고 비동기 작업 접수에 실패했습니다.",
  );
}

export async function saveJobPosting(payload: JobPostingSavePayload) {
  const response = await fetch(`${API_BASE_URL}/api/job-postings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  return parseApiResponse<SavedJobPosting>(
    response,
    "채용 공고 저장에 실패했습니다.",
  );
}

export async function fetchJobPostingIngestStatus(taskId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/job-postings/ingest/async/${taskId}`,
    {
      headers: getAuthHeaders(),
    },
  );

  return parseApiResponse<JobPostingIngestStatus>(
    response,
    "채용 공고 처리 상태를 조회하지 못했습니다.",
  );
}

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function isFailedStatus(status: string) {
  const normalizedStatus = status.toUpperCase();
  return (
    normalizedStatus.includes("FAIL") || normalizedStatus.includes("ERROR")
  );
}

function isCompletedStatus(status: string) {
  const normalizedStatus = status.toUpperCase();
  return (
    normalizedStatus.includes("COMPLETE") ||
    normalizedStatus.includes("SUCCESS") ||
    normalizedStatus.includes("DONE")
  );
}

export async function waitForJobPostingIngest(
  taskId: string,
  { intervalMs = 2000, maxAttempts = 30 } = {},
) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const status = await fetchJobPostingIngestStatus(taskId);

    if (status.result || isCompletedStatus(status.status)) {
      return status;
    }

    if (status.error || isFailedStatus(status.status)) {
      throw new Error(
        status.error || status.message || "채용 공고 처리에 실패했습니다.",
      );
    }

    await delay(intervalMs);
  }

  throw new Error("채용 공고 처리 시간이 초과되었습니다.");
}
