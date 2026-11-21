"use client";

import { useQuery } from "@tanstack/react-query";
import type { SavedJobPosting } from "@/lib/api/jobPostings";
import { mockApplyJobPostingQueryOptions } from "@/lib/queries";

export interface JobPostingHeader {
  companyName: string;
  jobTitle: string;
}

const EMPTY_JOB_POSTING_HEADER: JobPostingHeader = {
  companyName: "",
  jobTitle: "",
};

function selectJobPostingHeader(jobPosting: SavedJobPosting): JobPostingHeader {
  return {
    companyName: jobPosting.companyName,
    jobTitle: jobPosting.jobTitle || jobPosting.detailClassificationName || "",
  };
}

/**
 * 모의 지원에 연결된 공고의 회사명/직무명을 조회합니다.
 * mockApplyId가 유효하지 않으면 요청하지 않고 빈 값을 유지합니다.
 * 작성 페이지와 같은 쿼리를 써서, 이미 받은 공고는 다시 요청하지 않습니다.
 */
export function useJobPostingHeader(mockApplyId?: number): JobPostingHeader {
  const isValidMockApplyId =
    typeof mockApplyId === "number" &&
    Number.isInteger(mockApplyId) &&
    mockApplyId > 0;

  const { data } = useQuery({
    ...mockApplyJobPostingQueryOptions(isValidMockApplyId ? mockApplyId : 0),
    select: selectJobPostingHeader,
  });

  return data ?? EMPTY_JOB_POSTING_HEADER;
}
