import {
  API_BASE_URL,
  getAuthHeaders,
  parseApiResponse,
  parseApiResponseAllowNull,
} from "@/lib/api/client";
import type { SavedJobPosting } from "@/lib/api/jobPostings";

export type JobPostingApplyType = "MOCK" | "ACTUAL";
export type MockApplyProgressStatus =
  | "APPLICATION_CREATED"
  | "QUESTION_SELECT"
  | "ANSWER_WRITE"
  | "COMPLETED";

export interface MockApplyFromJobPosting {
  jobPostingId: number;
  mockApplyId: number;
  applyType: JobPostingApplyType;
  sequence: number;
}

export interface MockApplyFromJobPostingPayload {
  jobPostingId: number;
  sequence?: number;
}

export interface MockApplyRetryResult {
  sourceMockApplyId: number;
  jobPostingId: number;
  mockApplyId: number;
  applyType: JobPostingApplyType;
  status: MockApplyProgressStatus;
  sequence: number;
}

export interface MockApplyResumeRecord {
  jobPostingId: number;
  mockApplyId: number;
  status: MockApplyProgressStatus;
  updatedAt: string;
}

export interface MockApplyHomeItem {
  mockApplyId: number;
  resumePath: string;
  jobPostingId: number;
  sequence: number;
  status: MockApplyProgressStatus | string;
  companyName: string;
  detailClassificationName: string;
  jobTitle: string;
  createdAt: string;
  applyType: JobPostingApplyType;
  score: number;
}

export interface MockApplyHomeList {
  inProgress: MockApplyHomeItem[];
  completed: MockApplyHomeItem[];
}

export const APPLY_TYPE_STORAGE_KEY = "jobdri.applyType";
export const MOCK_APPLY_DELETED_EVENT = "jobdri:mock-apply-deleted";
const MOCK_APPLY_RESUME_STORAGE_KEY = "jobdri.mockApplyResumeRecords";

async function postMockApplyFromJobPosting(
  path: string,
  payload: MockApplyFromJobPostingPayload,
  fallbackMessage: string,
) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  return parseApiResponse<MockApplyFromJobPosting>(response, fallbackMessage);
}

export function createMockApplyFromJobPosting(
  payload: MockApplyFromJobPostingPayload,
) {
  return postMockApplyFromJobPosting(
    "/api/mock-applies/mock/from-job-posting",
    payload,
    "모의 서류 지원 생성에 실패했습니다.",
  );
}

export function createActualApplyFromJobPosting(
  payload: MockApplyFromJobPostingPayload,
) {
  return postMockApplyFromJobPosting(
    "/api/mock-applies/actual",
    payload,
    "실제 공고 기반 서류 지원 생성에 실패했습니다.",
  );
}

export function createApplyFromJobPosting({
  jobPostingId,
  applyType,
  sequence,
}: {
  jobPostingId: number;
  applyType: JobPostingApplyType;
  sequence?: number;
}) {
  return applyType === "MOCK"
    ? createMockApplyFromJobPosting({ jobPostingId, sequence })
    : createActualApplyFromJobPosting({ jobPostingId, sequence });
}

export async function fetchMyMockApplies({
  signal,
  redirectOnUnauthorized = true,
}: {
  signal?: AbortSignal;
  redirectOnUnauthorized?: boolean;
} = {}) {
  const response = await fetch(`${API_BASE_URL}/api/mock-applies/me`, {
    headers: getAuthHeaders(),
    cache: "no-store",
    signal,
  });

  const result = await parseApiResponse<MockApplyHomeList>(
    response,
    "내 지원 데이터를 불러오지 못했습니다.",
    { redirectOnUnauthorized },
  );

  return {
    inProgress: result.inProgress ?? [],
    completed: result.completed ?? [],
  };
}

export async function deleteMockApply(mockApplyId: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/mock-applies/${mockApplyId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );
  const result = await parseApiResponseAllowNull<unknown>(
    response,
    "모의 서류 지원 삭제에 실패했습니다.",
  );

  removeMockApplyResumeRecord(mockApplyId);

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent<number>(MOCK_APPLY_DELETED_EVENT, {
        detail: mockApplyId,
      }),
    );
  }

  return result;
}

export async function fetchMockApplyJobPosting(
  mockApplyId: number,
): Promise<SavedJobPosting> {
  const response = await fetch(
    `${API_BASE_URL}/api/mock-applies/${mockApplyId}/job-posting`,
    {
      headers: getAuthHeaders(),
      cache: "no-store",
    },
  );

  return parseApiResponse<SavedJobPosting>(
    response,
    "연결된 채용 공고를 불러오지 못했습니다.",
  );
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

function isResumeRecord(value: unknown): value is MockApplyResumeRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Partial<MockApplyResumeRecord>;

  return (
    typeof record.jobPostingId === "number" &&
    typeof record.mockApplyId === "number" &&
    typeof record.status === "string"
  );
}

export function getMockApplyResumeRecords(): MockApplyResumeRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(MOCK_APPLY_RESUME_STORAGE_KEY) ?? "[]",
    );

    return Array.isArray(parsed) ? parsed.filter(isResumeRecord) : [];
  } catch {
    return [];
  }
}

export function getMockApplyResumeRecord(jobPostingId: number) {
  return getMockApplyResumeRecords().find(
    (record) => record.jobPostingId === jobPostingId,
  );
}

export function saveMockApplyResumeRecord({
  jobPostingId,
  mockApplyId,
  status,
  updatedAt = new Date().toISOString(),
}: {
  jobPostingId: number;
  mockApplyId: number;
  status: MockApplyProgressStatus;
  updatedAt?: string;
}) {
  if (typeof window === "undefined") {
    return;
  }

  const records = getMockApplyResumeRecords();
  const nextRecord: MockApplyResumeRecord = {
    jobPostingId,
    mockApplyId,
    status,
    updatedAt,
  };
  const nextRecords = [
    nextRecord,
    ...records.filter(
      (record) =>
        record.jobPostingId !== jobPostingId &&
        record.mockApplyId !== mockApplyId,
    ),
  ];

  window.localStorage.setItem(
    MOCK_APPLY_RESUME_STORAGE_KEY,
    JSON.stringify(nextRecords),
  );
}

export function removeMockApplyResumeRecord(mockApplyId: number) {
  if (typeof window === "undefined") {
    return;
  }

  const nextRecords = getMockApplyResumeRecords().filter(
    (record) => record.mockApplyId !== mockApplyId,
  );

  if (nextRecords.length === 0) {
    window.localStorage.removeItem(MOCK_APPLY_RESUME_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(
    MOCK_APPLY_RESUME_STORAGE_KEY,
    JSON.stringify(nextRecords),
  );
}

export function updateMockApplyResumeStatus(
  mockApplyId: number,
  status: MockApplyProgressStatus,
) {
  if (typeof window === "undefined") {
    return;
  }

  const records = getMockApplyResumeRecords();
  const targetRecord = records.find(
    (record) => record.mockApplyId === mockApplyId,
  );

  if (!targetRecord) {
    return;
  }

  saveMockApplyResumeRecord({
    ...targetRecord,
    status,
  });
}

export async function retryMockApply(
  mockApplyId: number,
): Promise<MockApplyRetryResult> {
  const response = await fetch(
    `${API_BASE_URL}/api/mock-applies/${mockApplyId}/retry`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    },
  );

  return parseApiResponse<MockApplyRetryResult>(
    response,
    "재도전 모의 서류 지원 생성에 실패했습니다.",
  );
}
