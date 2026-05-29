export interface ApplyStep {
  label: string;
  /** 해당 스텝에 해당하는 경로. 정확히 일치(exact) 또는 접두사(startsWith)로 매칭 */
  path: string;
  exact?: boolean;
}

/**
 * 모의 서류 지원 플로우 스텝 정의
 * - path: 해당 스텝의 URL 경로
 * - exact: true이면 정확히 일치, false/없으면 경로가 path로 시작하면 매칭
 */
export const APPLY_STEPS: ApplyStep[] = [
  { label: "유형 선택", path: "/mockApply", exact: true },
  { label: "공고 생성", path: "/mockApply/job/create" },
  { label: "공고 확인", path: "/mockApply/job/confirm" },
  { label: "문항 선택", path: "/mockApply/actual" },
  { label: "자소서 입력", path: "/mockApply/write" },
  { label: "결과 확인", path: "/mockApply/result" },
];

/** 현재 pathname으로부터 currentStep(1-based)을 반환 */
export function getStepFromPath(pathname: string): number {
  // 뒤에서부터 순회해서 가장 구체적으로 매칭되는 스텝 반환
  for (let i = APPLY_STEPS.length - 1; i >= 0; i--) {
    const step = APPLY_STEPS[i];
    const matched = step.exact
      ? pathname === step.path
      : pathname.startsWith(step.path);
    if (matched) return i + 1;
  }
  return 1;
}
