export interface QuestionItem {
  id: string;
  question: string;
  maxLength?: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchQuestions(
  mockApplyId: string,
): Promise<QuestionItem[]> {
  const response = await fetch(
    `${BASE_URL}/api/mock-applies/${mockApplyId}/questions/candidates`,
  );
  if (!response.ok) throw new Error("문항 목록을 불러오지 못했습니다.");
  return response.json();

  // // 임시 mock 데이터
  // return [
  //   {
  //     id: "q1",
  //     question:
  //       "데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요.",
  //   },
  //   {
  //     id: "q2",
  //     question:
  //       "데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요.",
  //   },
  //   {
  //     id: "q3",
  //     question:
  //       "데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요.",
  //   },
  //   {
  //     id: "q4",
  //     question:
  //       "데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요.",
  //   },
  //   {
  //     id: "q5",
  //     question:
  //       "데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요.",
  //   },
  //   {
  //     id: "q6",
  //     question:
  //       "데이터를 기반으로 문제점을 파악하고 성과를 개선해 본 경험을 서술해 주세요.",
  //   },
  // ];
}
