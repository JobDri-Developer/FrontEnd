import {
  API_BASE_URL,
  getAuthHeaders,
  parseApiResponse,
} from "@/lib/api/client";

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

function mapQuestionItems(
  questions: QuestionApiItem[] | undefined,
): QuestionItem[] {
  return (questions ?? []).map((question, index) => {
    const questionId = question.questionId ?? question.id;

    return {
      id:
        questionId !== undefined
          ? String(questionId)
          : `question-${index}`,
      questionId,
      question: question.content,
      maxLength: question.charLimit,
      selected: question.selected,
      custom: question.custom,
      answer: question.answer,
    };
  });
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

interface SaveAnswerItem {
  questionId?: number;
  answer: string;
  content?: string;
  charLimit?: number;
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

  return mapQuestionItems(result);
}

export async function saveQuestions(
  mockApplyId: number,
  questions: QuestionItem[],
): Promise<QuestionItem[]> {
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

  const result = await parseApiResponse<SelectedQuestionsApiResponse>(
    response,
    "문항 저장에 실패했습니다.",
  );

  return mapQuestionItems(result?.questions);
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

  return mapQuestionItems(result?.questions);
}

export interface SaveApplyResult {
  mockApplyId: number;
  status: string;
  sequence: number;
  questions: QuestionItem[];
}

interface SaveApplyApiResult {
  mockApplyId: number;
  status: string;
  sequence: number;
  questions?: QuestionApiItem[];
}

export async function saveApply(
  mockApplyId: number,
  questionsData: SaveAnswerItem[],
): Promise<SaveApplyResult> {
  const response = await fetch(
    `${API_BASE_URL}/api/mock-applies/${mockApplyId}/questions/answers`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({
        questions: questionsData,
      }),
    },
  );

  const result = await parseApiResponse<SaveApplyApiResult>(
    response,
    "답변 제출에 실패했습니다.",
  );

  return {
    mockApplyId: result!.mockApplyId,
    status: result!.status,
    sequence: result!.sequence,
    questions: mapQuestionItems(result!.questions),
  };
}

export async function createCustomQuestionCandidate(
  mockApplyId: number,
  content: string = "",
  charLimit: number = 1000,
): Promise<number> {
  const response = await fetch(
    `${API_BASE_URL}/api/mock-applies/${mockApplyId}/questions/candidates`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ content, charLimit }),
    },
  );

  const result = await parseApiResponse<QuestionApiItem>(
    response,
    "커스텀 문항 후보 생성에 실패했습니다.",
  );

  return result!.questionId!;
}
