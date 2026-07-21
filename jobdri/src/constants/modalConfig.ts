export const LEAVE_MODAL_CONFIG = {
  JOB_CREATE: {
    title: "페이지를 나가시겠습니까?",
    description: "작성 중인 내용이 저장되지 않습니다.",
    secondaryBtn: "나가기",
    primaryBtn: "계속 작성",
  },
  JOB_LOADING: {
    title: "분석을 중단하시겠습니까?",
    description: "분석을 중단하고 공고 입력으로 돌아갑니다.",
    secondaryBtn: "중단하기",
    primaryBtn: "취소",
  },
  JOB_REVIEW_BACK: {
    title: "공고 입력으로 돌아갈까요?",
    description: "지금까지 작성한 내용이 모두 삭제돼요.",
    secondaryBtn: "돌아가기",
    primaryBtn: "계속 작성",
  },
  COMMON_HOME: {
    // 홈으로 모달
    title: "페이지를 나가시겠어요?",
    description: "자동 저장 이후 작성된 내용은 저장되지 않아요.",
    secondaryBtn: "홈으로",
    primaryBtn: "취소",
  },
} as const;
