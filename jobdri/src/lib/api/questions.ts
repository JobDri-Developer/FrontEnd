import { API_BASE_URL, getAuthHeaders, parseApiResponse } from "@/lib/api/client";

export interface QuestionItem {
  id: string;
  questionId?: number;
  question: string;
  maxLength?: number;
  selected?: boolean;
  custom?: boolean;
  answer?: string;
}

interface QuestionApiItem {
  id?: number;
  content: string;
  charLimit?: number;
  selected?: boolean;
  questionId?: number;
  custom?: boolean;
  answer?: string;
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
    ({ id, content, charLimit, selected, questionId, custom }, index) => ({
      id: String(index),
      questionId: id ?? questionId,
      question: content,
      maxLength: charLimit,
      selected,
      custom,
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
    ({ id, questionId, content, charLimit, selected, custom, answer }, index) => ({
      id: String(index),
      questionId: id ?? questionId,
      question: content,
      maxLength: charLimit,
      selected,
      custom,
      answer,
    }),
  );
}

export interface SaveApplyResult {
  mockApplyId: number;
  status: string;
  sequence: number;
}

export async function saveApply(
  mockApplyId: number,
  answers: AnswerItem[],
): Promise<SaveApplyResult> {
  const response = await fetch(
    `${API_BASE_URL}/api/mock-applies/${mockApplyId}/questions/answers`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ answers }),
    },
  );

  const result = await parseApiResponse<SaveApplyResult>(
    response,
    "답변 제출에 실패했습니다.",
  );
  return result!;
}
