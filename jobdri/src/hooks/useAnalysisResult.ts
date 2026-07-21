import { useQuery } from "@tanstack/react-query";
import { fetchAnalysisResult, type AnalysisResult } from "@/lib/api/result";

export const useAnalysisResult = (mockApplyId?: number) => {
  return useQuery<AnalysisResult, Error>({
    queryKey: ["analysisResult", mockApplyId],

    queryFn: async ({ signal }) => {
      if (!mockApplyId) throw new Error("mockApplyId가 없습니다.");
      return fetchAnalysisResult(mockApplyId, signal);
    },

    // mockApplyId가 있을 때만 쿼리가 실행되도록 설정 (조건부 페칭)
    enabled: !!mockApplyId,

    // 데이터 캐싱 시간 설정 (필요에 따라 조절)
    staleTime: 1000 * 60 * 5, // 5분 동안은 캐시된 데이터 사용
  });
};
