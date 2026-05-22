const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("jobdri.accessToken")
      : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface SequenceResult {
  jobPostingId: number;
  mockApplyId: number;
  totalCount: number;
  sequence: number;
}

interface SequenceApiResponse {
  result: SequenceResult;
  error: string | null;
}

export async function fetchSequence(
  mockApplyId: number,
): Promise<SequenceResult> {
  const response = await fetch(
    `${BASE_URL}/api/mock-applies/${mockApplyId}/sequence`,
    { headers: getAuthHeaders() },
  );
  if (!response.ok) throw new Error("순번 조회에 실패했습니다.");
  const { result }: SequenceApiResponse = await response.json();
  return result;
}
