export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNIN: "/signin",
  APPLY: "/apply",
  CREDIT: "/credit",
  APPLY_VIRTUAL:"/apply/virtual"
} as const;

// LNB + Header를 표시할 경로 목록
export const LAYOUT_ROUTES: string[] = [ROUTES.HOME, ROUTES.CREDIT];
