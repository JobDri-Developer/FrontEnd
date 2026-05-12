export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNIN: "/signin",
  MOCK_APPLY: "/mock_apply",
  APPLY: "/apply",
  CREDIT: "/credit",
} as const;

// LNB + Header를 표시할 경로 목록
export const LAYOUT_ROUTES: string[] = [
  ROUTES.HOME,
  ROUTES.MOCK_APPLY,
  ROUTES.APPLY,
  ROUTES.CREDIT,
];
