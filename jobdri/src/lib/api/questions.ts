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

interface QuestionApiResponse {
  result: QuestionApiItem[];
  error: string | null;
}

interface SelectedQuestionsApiResponse {
  result: {
    mockApplyId: number;
    status: string;
    questions: QuestionApiItem[];
  };
  error: string | null;
}

export interface AnswerItem {
  questionId: number;
  answer: string;
}

// interface AnswerApiResponse {
//   result: AnswerItem[];
//   error: string | null;
// }

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("jobdri.accessToken")
      : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchQuestions(
  mockApplyId: number,
): Promise<QuestionItem[]> {
  const response = await fetch(
    `${BASE_URL}/api/mock-applies/${mockApplyId}/questions/candidates`,
    { headers: getAuthHeaders() },
  );
  if (!response.ok) throw new Error("문항 목록을 불러오지 못했습니다.");
  const { result }: QuestionApiResponse = await response.json();
  return result.map(({ content, charLimit, selected, questionId }, index) => ({
    id: String(index),
    question: content,
    maxLength: charLimit,
    selected,
    custom: false,
    questionId: questionId,
  }));
}

export async function saveQuestions(
  mockApplyId: number,
  questions: QuestionItem[],
): Promise<void> {
  const response = await fetch(
    `${BASE_URL}/api/mock-applies/${mockApplyId}/questions`,
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
  if (!response.ok) throw new Error("문항 저장에 실패했습니다.");
}

export async function fetchSelectedQuestions(
  mockApplyId: number,
): Promise<QuestionItem[]> {
  const response = await fetch(
    `${BASE_URL}/api/mock-applies/${mockApplyId}/questions`,
    { headers: getAuthHeaders() },
  );
  if (!response.ok) throw new Error("선택 문항 조회에 실패했습니다.");
  const { result }: SelectedQuestionsApiResponse = await response.json();
  return result.questions.map(
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
    `${BASE_URL}/api/mock-applies/${mockApplyId}/questions/answers`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ answers }),
    },
  );
  if (!response.ok) throw new Error("답변 제출에 실패했습니다.");
}
