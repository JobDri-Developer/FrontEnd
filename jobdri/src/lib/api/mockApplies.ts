import { API_BASE_URL, AUTH_STORAGE_KEYS } from "@/lib/auth";

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T | null;
  error: string | null;
}

export type JobPostingApplyType = "MOCK" | "ACTUAL";

export interface MockApplyFromJobPosting {
  jobPostingId: number;
  mockApplyId: number;
  applyType: JobPostingApplyType;
}

export const APPLY_TYPE_STORAGE_KEY = "jobdri.applyType";

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)
      : null;

  return token ? { Authorization: `Bearer ${token}` } : {};
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

async function postMockApplyFromJobPosting(
  path: string,
  jobPostingId: number,
  fallbackMessage: string,
) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ jobPostingId }),
  });

  return parseApiResponse<MockApplyFromJobPosting>(response, fallbackMessage);
}

export function createMockApplyFromJobPosting(jobPostingId: number) {
  return postMockApplyFromJobPosting(
    "/api/mock-applies/mock/from-job-posting",
    jobPostingId,
    "모의 서류 지원 생성에 실패했습니다.",
  );
}

export function createActualApplyFromJobPosting(jobPostingId: number) {
  return postMockApplyFromJobPosting(
    "/api/mock-applies/actual",
    jobPostingId,
    "실제 공고 기반 서류 지원 생성에 실패했습니다.",
  );
}

export function createApplyFromJobPosting({
  jobPostingId,
  applyType,
}: {
  jobPostingId: number;
  applyType: JobPostingApplyType;
}) {
  return applyType === "MOCK"
    ? createMockApplyFromJobPosting(jobPostingId)
    : createActualApplyFromJobPosting(jobPostingId);
}

export function saveSelectedApplyType(applyType: JobPostingApplyType) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(APPLY_TYPE_STORAGE_KEY, applyType);
}

export function getSelectedApplyType(): JobPostingApplyType {
  if (typeof window === "undefined") {
    return "ACTUAL";
  }

  return window.sessionStorage.getItem(APPLY_TYPE_STORAGE_KEY) === "MOCK"
    ? "MOCK"
    : "ACTUAL";
}
