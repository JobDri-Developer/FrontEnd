import { API_BASE_URL, AUTH_STORAGE_KEYS } from "@/lib/auth";

export interface QuestionItem {
  id: string;
  questionId?: number;
  question: string;
  maxLength?: number;
  selected?: boolean;
  custom?: boolean;
}

interface QuestionApiItem {
  id?: number;
  content: string;
  charLimit?: number;
  selected?: boolean;
  questionId?: number;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T | null;
  error: string | null;
}

interface SelectedQuestionsApiResponse {
  mockApplyId: number;
  status: string;
  questions: QuestionApiItem[];
}

export interface AnswerItem {
  questionId: number;
  answer: string;
}

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)
      : null;

  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseApiResponse<T>(
  response: Response,
  fallbackMessage: string,
) {
  let data: ApiResponse<T> | null = null;

  try {
    data = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error(`${fallbackMessage} 응답을 확인할 수 없습니다.`);
  }

  if (!response.ok || !data.isSuccess) {
    throw new Error(data?.error || data?.message || fallbackMessage);
  }

  return data.result;
}

export async function fetchQuestions(
  mockApplyId: number,
): Promise<QuestionItem[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/mock-applies/${mockApplyId}/questions/candidates`,
    {
      headers: getAuthHeaders(),
      cache: "no-store",
    },
  );
  const result = await parseApiResponse<QuestionApiItem[]>(
    response,
    "문항 목록을 불러오지 못했습니다.",
  );

  return (result ?? []).map(
    ({ id, content, charLimit, selected, questionId }, index) => ({
      id: String(index),
      questionId: id ?? questionId,
      question: content,
      maxLength: charLimit,
      selected,
      custom: false,
    }),
  );
}

export async function saveQuestions(
  mockApplyId: number,
  questions: QuestionItem[],
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/mock-applies/${mockApplyId}/questions`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({
        questions: questions.map((q) => ({
          content: q.question,
          charLimit: q.maxLength ?? 1000,
          custom: q.custom ?? false,
        })),
      }),
    },
  );

  await parseApiResponse<unknown>(response, "문항 저장에 실패했습니다.");
}

export async function fetchSelectedQuestions(
  mockApplyId: number,
): Promise<QuestionItem[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/mock-applies/${mockApplyId}/questions`,
    {
      headers: getAuthHeaders(),
      cache: "no-store",
    },
  );
  const result = await parseApiResponse<SelectedQuestionsApiResponse>(
    response,
    "선택 문항 조회에 실패했습니다.",
  );

  return (result?.questions ?? []).map(
    ({ id, questionId, content, charLimit, selected }, index) => ({
      id: String(index),
      questionId: id ?? questionId,
      question: content,
      maxLength: charLimit,
      selected,
      custom: false,
    }),
  );
}

export async function saveApply(
  mockApplyId: number,
  answers: AnswerItem[],
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/mock-applies/${mockApplyId}/questions/answers`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ answers }),
    },
  );

  await parseApiResponse<unknown>(response, "답변 제출에 실패했습니다.");
}
