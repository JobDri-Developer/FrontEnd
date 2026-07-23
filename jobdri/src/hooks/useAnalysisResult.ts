import { useQuery } from "@tanstack/react-query";
import {
  fetchAnalysisByJobPosting,
  fetchAnalysisResult,
  type AnalysisResult,
} from "@/lib/api/result";

export const useAnalysisResult = (
  mockApplyId?: number,
  jobPostingId?: number,
  sequence?: number,
) => {
  return useQuery<AnalysisResult, Error>({
    queryKey: [
      "analysisResult",
      mockApplyId,
      jobPostingId ?? null,
      sequence ?? null,
    ],

    queryFn: async ({ signal }) => {
      if (!mockApplyId) throw new Error("mockApplyId가 없습니다.");

      if (jobPostingId && sequence) {
        const result = await fetchAnalysisByJobPosting(
          jobPostingId,
          sequence,
          signal,
        );

        if (
          result.mockApplyId > 0 &&
          result.mockApplyId !== mockApplyId
        ) {
          throw new Error(
            "요청한 지원서와 분석 결과 정보가 일치하지 않습니다.",
          );
        }

        return result;
      }

      return fetchAnalysisResult(mockApplyId, signal);
    },

    enabled: !!mockApplyId,

    staleTime: 1000 * 60 * 5,
  });
};
