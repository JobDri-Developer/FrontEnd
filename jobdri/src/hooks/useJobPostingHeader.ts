"use client";

import { useEffect, useState } from "react";
import { fetchMockApplyJobPosting } from "@/lib/api/mockApplies";

export interface JobPostingHeader {
  companyName: string;
  jobTitle: string;
}

const EMPTY_JOB_POSTING_HEADER: JobPostingHeader = {
  companyName: "",
  jobTitle: "",
};

/**
 * 모의 지원에 연결된 공고의 회사명/직무명을 조회합니다.
 * mockApplyId가 유효하지 않으면 요청하지 않고 빈 값을 유지합니다.
 */
export function useJobPostingHeader(mockApplyId?: number): JobPostingHeader {
  const [jobPostingHeader, setJobPostingHeader] = useState(
    EMPTY_JOB_POSTING_HEADER,
  );
  const isValidMockApplyId =
    typeof mockApplyId === "number" &&
    Number.isInteger(mockApplyId) &&
    mockApplyId > 0;

  useEffect(() => {
    if (!isValidMockApplyId) {
      return;
    }

    let ignore = false;

    const loadJobPostingHeader = async () => {
      try {
        const jobPosting = await fetchMockApplyJobPosting(mockApplyId);

        if (!ignore) {
          setJobPostingHeader({
            companyName: jobPosting.companyName,
            jobTitle:
              jobPosting.jobTitle || jobPosting.detailClassificationName || "",
          });
        }
      } catch (error) {
        if (!ignore) {
          console.error("채용 공고 정보를 불러오지 못했습니다.", error);
        }
      }
    };

    void loadJobPostingHeader();

    return () => {
      ignore = true;
    };
  }, [isValidMockApplyId, mockApplyId]);

  return jobPostingHeader;
}
