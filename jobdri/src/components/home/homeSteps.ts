import Step1Image from "@/assets/img_basic_Step1.svg";
import Step2Image from "@/assets/img_basic_Step2.svg";
import Step3Image from "@/assets/img_basic_Step3.svg";

export const INTRO_STEPS = [
  {
    step: "STEP 01",
    title: "원하는 직무의 공고에 도전하세요",
    description:
      "텍스트 또는 이미지로 실제 공고를 등록하거나,\n원하는 직무의 모의 공고로 시작할 수 있습니다.",
    Image: Step1Image,
  },
  {
    step: "STEP 02",
    title: "AI가 자소서를 채점합니다",
    description:
      "문항별로 직무 적합도, 구체성, 완성도를 분석해\n현재 내 서류의 위치를 수치로 보여줍니다.",
    Image: Step2Image,
  },
  {
    step: "STEP 03",
    title: "개선안을 확인해보세요",
    description:
      "자소서에 대한 구체적인 개선 방향을 제시합니다.\n수정 후 다시 제출해 점수를 올려보세요.",
    Image: Step3Image,
  },
] as const;

export const PROGRESS_STEPS = [
  "유형 선택",
  "공고 생성",
  "공고 확인",
  "문항 선택",
  "자소서 입력",
  "결과 확인",
] as const;

export const completedStepCountByStatus: Record<string, number> = {
  APPLICATION_CREATED: 3,
  QUESTION_SELECT: 4,
  ANSWER_WRITE: 5,
  COMPLETED: 6,
};
