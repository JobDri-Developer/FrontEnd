import { clearAuthTokens, getAuthHeaders, API_BASE_URL } from "@/lib/auth";
// import { ROUTES } from "@/constants/routes";

export { API_BASE_URL, getAuthHeaders };

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T | null;
  error: string | null;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("인증이 만료되었습니다. 다시 로그인해주세요.");
    this.name = "UnauthorizedError";
  }
}

export function handleUnauthorized(): never {
  clearAuthTokens();

  if (typeof window !== "undefined") {
    const redirectPath = encodeURIComponent(window.location.pathname);
    window.location.replace(`/login?redirect=${redirectPath}`);
  }

  throw new UnauthorizedError();
}

export async function parseApiResponse<T>(
  response: Response,
  fallbackMessage: string,
  { redirectOnUnauthorized = true } = {},
): Promise<T> {
  if (response.status === 401 && redirectOnUnauthorized) {
    handleUnauthorized();
  }

  let data: ApiResponse<T> | null = null;

  try {
    data = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error(`${fallbackMessage} 응답을 확인할 수 없습니다.`);
  }

  if (!response.ok || !data.isSuccess || !data.result) {
    throw new Error(data?.error || data?.message || fallbackMessage);
  }

  return data.result;
}

export async function parseApiResponseAllowNull<T>(
  response: Response,
  fallbackMessage: string,
): Promise<T | null> {
  if (response.status === 401) {
    handleUnauthorized();
  }

  const responseText = await response.text();

  if (!responseText.trim()) {
    if (!response.ok) {
      throw new Error(fallbackMessage);
    }

    return null;
  }

  let data: ApiResponse<T> | null = null;

  try {
    data = JSON.parse(responseText) as ApiResponse<T>;
  } catch {
    throw new Error(`${fallbackMessage} 응답을 확인할 수 없습니다.`);
  }

  if (!response.ok || !data.isSuccess) {
    throw new Error(data?.error || data?.message || fallbackMessage);
  }

  return data.result;
}
