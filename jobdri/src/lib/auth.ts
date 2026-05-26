const DEFAULT_API_BASE_URL = "https://api.jobdri.site";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL
).replace(/\/$/, "");

export const AUTH_STORAGE_KEYS = {
  accessToken: "jobdri.accessToken",
  refreshToken: "jobdri.refreshToken",
  userEmail: "jobdri.userEmail",
} as const;

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T | null;
  error: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name?: string | null;
  email: string;
  password: string;
}

export interface EmailVerificationRequest {
  email: string;
}

export interface EmailVerificationConfirmationRequest {
  email: string;
  code: string;
}

interface AuthApiErrorOptions {
  status?: number;
  code?: string;
  error?: string | null;
}

export class AuthApiError extends Error {
  status?: number;
  code?: string;
  errorDetail?: string | null;

  constructor(message: string, options: AuthApiErrorOptions = {}) {
    super(message);
    this.name = "AuthApiError";
    this.status = options.status;
    this.code = options.code;
    this.errorDetail = options.error;
  }
}

async function postAuth<T>(
  path: string,
  body: unknown,
  fallbackAction: string,
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  let data: ApiResponse<T> | null = null;

  try {
    data = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new AuthApiError(`${fallbackAction} 응답을 확인할 수 없습니다.`, {
      status: response.status,
    });
  }

  if (!data) {
    throw new AuthApiError(`${fallbackAction} 응답을 확인할 수 없습니다.`, {
      status: response.status,
    });
  }

  if (!response.ok || !data.isSuccess) {
    throw new AuthApiError(
      data.message || `${fallbackAction}에 실패했습니다.`,
      {
        status: response.status,
        code: data.code,
        error: data.error,
      },
    );
  }

  return data;
}

export async function loginWithEmail({
  email,
  password,
}: LoginRequest): Promise<AuthTokens> {
  const data = await postAuth<AuthTokens>(
    "/api/auth/login",
    { email, password },
    "로그인",
  );

  if (!data.result) {
    throw new AuthApiError("로그인 토큰을 확인할 수 없습니다.", {
      code: data.code,
      error: data.error,
    });
  }

  return data.result;
}

export async function sendEmailVerification({
  email,
}: EmailVerificationRequest) {
  await postAuth<null>(
    "/api/auth/email-verifications",
    { email },
    "인증번호 발송",
  );
}

export async function confirmEmailVerification({
  email,
  code,
}: EmailVerificationConfirmationRequest) {
  await postAuth<null>(
    "/api/auth/email-verifications/confirmations",
    { email, code },
    "이메일 인증",
  );
}

export async function signupWithEmail({
  name = null,
  email,
  password,
}: SignupRequest) {
  const fallbackName = email.split("@")[0] || "회원";

  await postAuth<null>(
    "/api/auth/signup",
    { name: name ?? fallbackName, email, password },
    "회원가입",
  );
}

export function saveAuthTokens(tokens: AuthTokens, email?: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    AUTH_STORAGE_KEYS.accessToken,
    tokens.accessToken,
  );
  window.localStorage.setItem(
    AUTH_STORAGE_KEYS.refreshToken,
    tokens.refreshToken,
  );

  if (email) {
    window.localStorage.setItem(AUTH_STORAGE_KEYS.userEmail, email);
  }
}

export function getStoredAuthEmail() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEYS.userEmail);
}

export function getEmailFromAccessToken(accessToken: string) {
  if (typeof window === "undefined") {
    return null;
  }

  const [, payload] = accessToken.split(".");

  if (!payload) {
    return null;
  }

  try {
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      Math.ceil(normalizedPayload.length / 4) * 4,
      "=",
    );
    const decodedPayload = JSON.parse(window.atob(paddedPayload)) as {
      email?: unknown;
      sub?: unknown;
    };

    if (typeof decodedPayload.email === "string") {
      return decodedPayload.email;
    }

    if (
      typeof decodedPayload.sub === "string" &&
      decodedPayload.sub.includes("@")
    ) {
      return decodedPayload.sub;
    }

    return null;
  } catch {
    return null;
  }
}

export function getGoogleAuthorizationUrl() {
  return `${API_BASE_URL}/oauth2/authorization/google`;
}

export function getAuthHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("jobdri.accessToken")
      : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
