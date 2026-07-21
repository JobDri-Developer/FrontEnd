import {
  API_BASE_URL,
  getAuthHeaders,
  parseApiResponse,
  parseApiResponseAllowNull,
} from "@/lib/api/client";

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
  failureReason: string | null;
  workerId: string | null;
  retryCount: number;
  maxRetryCount: number;
  queueLatencyMillis: number;
  createdAt: string;
  submittedAt: string | null;
  lastAttemptAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  result: JobPostingProcessedResult | null;
}

export interface JobPostingRequestInput {
  rawText?: string;
  sourceUrl?: string;
  imageObjectKey?: string;
}

interface JobPostingImagePresignPayload {
  fileName: string;
  contentType: string;
}

interface JobPostingImagePresignResult {
  objectKey: string;
  uploadUrl: string;
  expiresInMinutes: number;
}

interface TimedRequestInit extends RequestInit {
  timeoutMs?: number;
  timeoutMessage?: string;
}

const DEFAULT_REQUEST_TIMEOUT_MS = 30000;


function getImageContentType(file: File) {
  if (file.type) {
    return file.type;
  }

  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "jpg" || extension === "jpeg") {
    return "image/jpeg";
  }

  if (extension === "png") {
    return "image/png";
  }

  return "application/octet-stream";
}

function createJobPostingRequestBody({
  rawText,
  sourceUrl,
  imageObjectKey,
}: JobPostingRequestInput) {
  const body: JobPostingRequestInput = {};
  const trimmedRawText = rawText?.trim();
  const trimmedSourceUrl = sourceUrl?.trim();
  const trimmedImageObjectKey = imageObjectKey?.trim();

  if (trimmedRawText) {
    body.rawText = trimmedRawText;
  }

  if (trimmedSourceUrl) {
    body.sourceUrl = trimmedSourceUrl;
  }

  if (trimmedImageObjectKey) {
    body.imageObjectKey = trimmedImageObjectKey;
  }

  if (!trimmedRawText && !trimmedSourceUrl && !trimmedImageObjectKey) {
    throw new Error("공고 내용, 링크 또는 이미지를 입력해주세요.");
  }

  return body;
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  {
    timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
    timeoutMessage = "요청 시간이 초과되었습니다.",
    ...init
  }: TimedRequestInit = {},
) {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(timeoutMessage);
    }

    throw error;
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}


async function postJobPosting<T>(
  path: string,
  input: JobPostingRequestInput,
  fallbackMessage: string,
) {
  const response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(createJobPostingRequestBody(input)),
  });

  return parseApiResponse<T>(response, fallbackMessage);
}

export function extractJobPosting(input: JobPostingRequestInput) {
  return postJobPosting<JobPostingExtracted>(
    "/api/job-postings/extract",
    input,
    "채용 공고 정보를 추출하지 못했습니다.",
  );
}

export function ingestJobPosting(input: JobPostingRequestInput) {
  return postJobPosting<JobPostingIngestAccepted>(
    "/api/job-postings/ingest",
    input,
    "채용 공고 비동기 작업 접수에 실패했습니다.",
  );
}

export async function createJobPostingImagePresignedUploadUrl(
  payload: JobPostingImagePresignPayload,
) {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/api/job-postings/images/presign-upload`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
      timeoutMessage: "채용 공고 이미지 업로드 URL 발급 시간이 초과되었습니다.",
    },
  );

  return parseApiResponse<JobPostingImagePresignResult>(
    response,
    "채용 공고 이미지 업로드 URL 발급에 실패했습니다.",
  );
}

async function uploadImageToPresignedUrl({
  file,
  uploadUrl,
  contentType,
}: {
  file: File;
  uploadUrl: string;
  contentType: string;
}) {
  const response = await fetchWithTimeout(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: file,
    timeoutMs: 60000,
    timeoutMessage: "채용 공고 이미지 업로드 시간이 초과되었습니다.",
  });

  if (!response.ok) {
    throw new Error("채용 공고 이미지 업로드에 실패했습니다.");
  }
}

export async function uploadJobPostingImage(file: File) {
  const contentType = getImageContentType(file);
  const { objectKey, uploadUrl } =
    await createJobPostingImagePresignedUploadUrl({
      fileName: file.name,
      contentType,
    });

  await uploadImageToPresignedUrl({
    file,
    uploadUrl,
    contentType,
  });

  return objectKey;
}

export async function ingestJobPostingImage(file: File) {
  const objectKey = await uploadJobPostingImage(file);

  return ingestJobPosting({ imageObjectKey: objectKey });
}

export async function saveJobPosting(payload: JobPostingSavePayload) {
  const response = await fetchWithTimeout(`${API_BASE_URL}/api/job-postings`, {
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

export async function fetchMyJobPostings() {
  const response = await fetchWithTimeout(`${API_BASE_URL}/api/job-postings/me`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  const result = await parseApiResponse<SavedJobPosting[]>(
    response,
    "내 지원 데이터를 불러오지 못했습니다.",
  );

  return result ?? [];
}

export async function fetchMyJobPosting(jobPostingId: number) {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/api/job-postings/me/${jobPostingId}`,
    {
      headers: getAuthHeaders(),
      cache: "no-store",
    },
  );

  return parseApiResponse<SavedJobPosting>(
    response,
    "내 지원 데이터를 불러오지 못했습니다.",
  );
}

export async function deleteJobPosting(jobPostingId: number) {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/api/job-postings/${jobPostingId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  return parseApiResponseAllowNull<unknown>(
    response,
    "채용 공고 삭제에 실패했습니다.",
  );
}

export async function fetchJobPostingIngestStatus(taskId: string) {
  const response = await fetchWithTimeout(
    `${API_BASE_URL}/api/job-postings/ingest/async/${taskId}`,
    {
      headers: getAuthHeaders(),
      timeoutMessage: "채용 공고 처리 상태 조회 시간이 초과되었습니다.",
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
  { intervalMs = 2000, maxAttempts = 60 } = {},
) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const status = await fetchJobPostingIngestStatus(taskId);

    if (status.result) {
      return status;
    }

    if (
      status.error ||
      status.failureReason ||
      isFailedStatus(status.status)
    ) {
      throw new Error(
        status.failureReason ||
          status.error ||
          status.message ||
          "채용 공고 처리에 실패했습니다.",
      );
    }

    if (isCompletedStatus(status.status)) {
      throw new Error(
        status.message || "완료된 채용 공고 처리 결과를 확인할 수 없습니다.",
      );
    }

    await delay(intervalMs);
  }

  throw new Error("채용 공고 처리 시간이 초과되었습니다.");
}
