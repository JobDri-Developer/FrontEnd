export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNIN: "/signin",
  OAUTH_REDIRECT: "/oauth2/redirect",
  APPLY: "/mockApply",
  CREDIT: "/credit",
  APPLY_VIRTUAL:"/mockApply/actual"
} as const;

// LNB + Header를 표시할 경로 목록
export const LAYOUT_ROUTES: string[] = [ROUTES.HOME, ROUTES.CREDIT];
