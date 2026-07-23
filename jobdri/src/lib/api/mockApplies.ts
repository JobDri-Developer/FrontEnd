import {
  API_BASE_URL,
  getAuthHeaders,
  parseApiResponse,
} from "@/lib/api/client";
import type { JobPostingProfileColor } from "@/lib/api/jobPostings";

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
  resumePath?: string | null;
  jobPostingId: number;
  status: MockApplyProgressStatus | string;
  companyName: string;
  profileColor?: JobPostingProfileColor | null;
  postingName?: string | null;
  detailClassificationName?: string | null;
  jobTitle?: string | null;
  createdAt: string;
  applyType: JobPostingApplyType;
  score?: number | null;
  version: number;
}

export interface MockApplyHomeList {
  inProgress: MockApplyHomeItem[];
  completed: MockApplyHomeItem[];
}

export const APPLY_TYPE_STORAGE_KEY = "jobdri.applyType";
const MOCK_APPLY_RESUME_STORAGE_KEY = "jobdri.mockApplyResumeRecords";

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
