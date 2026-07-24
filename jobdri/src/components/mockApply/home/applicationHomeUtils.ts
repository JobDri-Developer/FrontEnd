import type { SavedJobPosting } from "@/lib/api/jobPostings";
import {
  getMockApplyResumeRecords,
  type MockApplyHomeItem,
} from "@/lib/api/mockApplies";
import {
  createJdReviewSectionsFromJobPosting,
  getJdReviewMetadataStorageKey,
  getJdReviewSavedStorageKey,
  getJdReviewStorageKey,
} from "@/components/mockApply/jd/jdReviewSections";
import type { ApplicationCardData } from "./types";

export const EMPTY_APPLICATION_TITLE = "아직 지원 내역이 없어요!";
export const EMPTY_APPLICATION_DESCRIPTION =
  "기업과 직무에 맞춰 자소서를 작성하고 점수를 확인하세요";
export const APPLICATION_FETCH_TIMEOUT_MS = 12000;

const HOME_APPLICATIONS_STORAGE_KEY = "jobdri.mockApplyHomeApplications";
const RESUME_ROUTE_SEGMENTS = new Set([
  "jd-input",
  "jd-review",
  "questions",
  "write",
  "result",
]);

function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replaceAll(". ", ". ")
    .trim();
}

function getCreatedAtTime(createdAt: string) {
  const date = new Date(createdAt);

  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

export function isCompletedStatus(status?: string) {
  return status === "COMPLETED";
}

function findLocalResumeStatus(item: MockApplyHomeItem) {
  const localRecord = getMockApplyResumeRecords().find(
    (record) =>
      record.mockApplyId === item.mockApplyId ||
      record.jobPostingId === item.jobPostingId,
  );

  return localRecord?.status;
}

export function mapMockApplyToApplication(
  item: MockApplyHomeItem,
  section: "inProgress" | "completed",
): ApplicationCardData {
  const companyName = item.companyName?.trim() ?? "";
  const status =
    section === "completed"
      ? "COMPLETED"
      : (findLocalResumeStatus(item) ?? item.status);
  const score =
    isCompletedStatus(status) && typeof item.score === "number"
      ? item.score
      : undefined;

  return {
    id: item.mockApplyId,
    jobPostingId: item.jobPostingId,
    company: companyName || "회사명 미입력",
    hasCompanyName: companyName.length > 0,
    profileColor: "DEFAULT",
    position: item.jobTitle || item.detailClassificationName || "직무 미분류",
    createdAt: formatCreatedAt(item.createdAt),
    createdAtTime: getCreatedAtTime(item.createdAt),
    score,
    mockApplyId: item.mockApplyId,
    resumePath: item.resumePath,
    status,
    applyType: item.applyType,
    version: item.sequence ?? 1,
  };
}

export function mergeApplications(applications: ApplicationCardData[]) {
  const applicationMap = new Map<number, ApplicationCardData>();

  applications.forEach((application) => {
    const currentApplication = applicationMap.get(application.mockApplyId);

    if (!currentApplication || isCompletedStatus(application.status)) {
      applicationMap.set(application.mockApplyId, application);
    }
  });

  return [...applicationMap.values()];
}

function isApplicationCardData(value: unknown): value is ApplicationCardData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const application = value as Partial<ApplicationCardData>;

  return (
    typeof application.id === "number" &&
    typeof application.jobPostingId === "number" &&
    typeof application.mockApplyId === "number" &&
    typeof application.company === "string" &&
    typeof application.position === "string" &&
    typeof application.createdAt === "string"
  );
}

export function readCachedApplications() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(
      window.sessionStorage.getItem(HOME_APPLICATIONS_STORAGE_KEY) ?? "[]",
    );

    return Array.isArray(parsed) ? parsed.filter(isApplicationCardData) : [];
  } catch {
    return [];
  }
}

export function cacheApplications(applications: ApplicationCardData[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    HOME_APPLICATIONS_STORAGE_KEY,
    JSON.stringify(applications),
  );
}

export function createRows<T>(items: T[], size: number) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size),
  );
}

export function getLatestApplication(applications: ApplicationCardData[]) {
  return applications.reduce<ApplicationCardData | null>(
    (latest, application) => {
      if (!latest) {
        return application;
      }

      const applicationCreatedAtTime = application.createdAtTime ?? 0;
      const latestCreatedAtTime = latest.createdAtTime ?? 0;

      if (applicationCreatedAtTime !== latestCreatedAtTime) {
        return applicationCreatedAtTime > latestCreatedAtTime
          ? application
          : latest;
      }

      return application.mockApplyId > latest.mockApplyId
        ? application
        : latest;
    },
    null,
  );
}

export function isEmptyApplicationStateError(message: string) {
  return (
    message.includes("인증") ||
    message.includes("Unauthorized") ||
    message.includes("Failed to fetch") ||
    message.includes("NetworkError") ||
    message.includes("Load failed")
  );
}

function normalizeResumePath(
  resumePath: string | null | undefined,
  mockApplyId: number,
) {
  if (!resumePath || resumePath === "string") {
    return "";
  }

  const trimmedResumePath = resumePath.trim();
  const resumeStep = trimmedResumePath.replace(/^\/+/, "");

  if (RESUME_ROUTE_SEGMENTS.has(resumeStep)) {
    return `/mockApply/${mockApplyId}/${resumeStep}`;
  }

  let path = trimmedResumePath;

  if (trimmedResumePath.startsWith("http")) {
    try {
      const url = new URL(trimmedResumePath);
      path = `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return "";
    }
  }

  path = path.startsWith("/") ? path : `/${path}`;

  const routeMatch = path.match(
    /^\/(?:apply\/virtual|mockApply\/)\/[^/]+\/([^/?#]+)([?#].*)?$/,
  );
  const routeSegment = routeMatch?.[1];

  if (!routeSegment || !RESUME_ROUTE_SEGMENTS.has(routeSegment)) {
    return "";
  }

  return `/mockApply/${mockApplyId}/${routeSegment}${routeMatch[2] ?? ""}`;
}

export function getResumePath({
  mockApplyId,
  jobPostingId,
  resumePath,
}: Pick<
  ApplicationCardData,
  "mockApplyId" | "jobPostingId" | "resumePath" | "status"
>) {
  const normalizedResumePath = normalizeResumePath(resumePath, mockApplyId);

  if (normalizedResumePath.includes("/result")) {
    return normalizedResumePath;
  }

  return `/mockApply/${mockApplyId}?jobPostingId=${jobPostingId}`;
}

export function getResultPath({
  jobPostingId,
}: Pick<ApplicationCardData, "jobPostingId">) {
  return `/mockApply/result/${jobPostingId}`;
}

export function getRetryPath({
  mockApplyId,
  jobPostingId,
}: Pick<ApplicationCardData, "mockApplyId" | "jobPostingId">) {
  return `/mockApply/${mockApplyId}?jobPostingId=${jobPostingId}`;
}

export function saveJdReviewSessionFromJobPosting(
  jobPosting: SavedJobPosting,
  applyId: number,
) {
  const {
    companyName,
    companySize,
    profileColor,
    postingName,
    jobTitle,
    detailClassificationId,
    detailClassificationName,
    task,
    requirement,
    preferred,
  } = jobPosting;
  const storageApplyId = String(applyId);
  const sections = createJdReviewSectionsFromJobPosting({
    companyName,
    jobTitle: jobTitle || detailClassificationName,
    task,
    requirements: requirement,
    preferredQualifications: preferred,
  });

  window.sessionStorage.setItem(
    getJdReviewStorageKey(storageApplyId),
    JSON.stringify(sections),
  );
  window.sessionStorage.setItem(
    getJdReviewSavedStorageKey(storageApplyId),
    JSON.stringify(jobPosting),
  );
  window.sessionStorage.setItem(
    getJdReviewMetadataStorageKey(storageApplyId),
    JSON.stringify({
      companySize,
      detailClassificationId,
      profileColor,
      postingName,
      jobTitle,
    }),
  );
}
