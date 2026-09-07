/**
 * 실제 경로(/mockApply/12345)를 라우트 패턴(/mockApply/[mockApplyId])으로 정규화한다.
 *
 * 정규화하지 않으면 지원 건 수만큼 page_path 값이 늘어나서
 * "공고 입력 화면을 몇 명이 봤는가" 같은 집계 자체가 불가능해진다.
 */

/** 구체적인 경로가 먼저 오도록 정렬한다. 먼저 매칭되는 패턴이 이긴다. */
const ROUTE_PATTERNS = [
  "/mockApply/job/create",
  "/mockApply/job/loading",
  "/mockApply/job/[jobPostingId]/review",
  "/mockApply/[mockApplyId]/result/resume-analysis-loading",
  "/mockApply/[mockApplyId]/result",
  "/mockApply/[mockApplyId]",
  "/credit/payment-cancel",
  "/credit/payment-result",
  "/credit",
  "/oauth2/redirect",
  "/desktop-required",
  "/policy",
  "/login",
  "/",
] as const;

const DYNAMIC_SEGMENT = /^\[.+\]$/;
const NUMERIC_SEGMENT = /^\d+$/;

function toSegments(path: string) {
  return path.split("/").filter(Boolean);
}

function matches(patternSegments: string[], pathSegments: string[]) {
  if (patternSegments.length !== pathSegments.length) {
    return false;
  }

  return patternSegments.every((patternSegment, index) => {
    const pathSegment = pathSegments[index];

    // 동적 세그먼트는 숫자 ID만 허용한다.
    // 이렇게 해야 /mockApply/job/create가 /mockApply/[mockApplyId]로 잘못 매칭되지 않는다.
    if (DYNAMIC_SEGMENT.test(patternSegment)) {
      return NUMERIC_SEGMENT.test(pathSegment);
    }

    return patternSegment === pathSegment;
  });
}

export function normalizeRoute(pathname: string): string {
  const pathSegments = toSegments(pathname);

  for (const pattern of ROUTE_PATTERNS) {
    if (matches(toSegments(pattern), pathSegments)) {
      return pattern;
    }
  }

  // 등록되지 않은 새 라우트라도 숫자 세그먼트는 치환해서 내보낸다.
  // 택소노미 갱신을 깜빡해도 카디널리티가 폭발하지 않게 하는 안전장치.
  const fallback = pathSegments.map((segment) =>
    NUMERIC_SEGMENT.test(segment) ? "[id]" : segment,
  );

  return fallback.length > 0 ? `/${fallback.join("/")}` : "/";
}
