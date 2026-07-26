import {
  EventStreamContentType,
  fetchEventSource,
} from "@microsoft/fetch-event-source";
import { API_BASE_URL, getAuthHeaders } from "@/lib/auth";

class NotificationStreamResponseError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly contentType: string | null,
  ) {
    super(message);
    this.name = "NotificationStreamResponseError";
  }
}

export interface ApiNotificationItem {
  id: number;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  readAt: string;
  createdAt: string;
  targetType?: string;
  targetId?: string;
  payload?: {
    mockApplyId?: number;
    taskId?: string;
    jobPostingId?: number | null;
    savedToDatabase?: boolean;
    status?: string;
  };
}

export interface LnbNotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type?: "normal" | "fail" | "complete";
  read?: boolean;
  targetType?: string;
  targetId?: string;
  mockApplyId?: string;
  jobPostingId?: string;
  taskId?: string;
  savedToDatabase?: boolean;
  apiType?: string;
  readAt?: string;
}

export interface NotificationResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ApiNotificationItem[];
}

export async function fetchNotifications(): Promise<NotificationResponse> {
  const headers = getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/api/notifications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`알림 목록 조회 실패: ${response.status}`);
  }

  return response.json();
}

export function subscribeToNotificationStream(
  onMessage: (data: ApiNotificationItem) => void,
  onError?: (error: unknown) => void,
) {
  const headers = getAuthHeaders();
  const ctrl = new AbortController();

  if (!headers.Authorization) {
    console.warn("로그인 토큰이 없어 실시간 알림을 연결하지 않습니다.");
    return () => ctrl.abort();
  }

  fetchEventSource(`${API_BASE_URL}/api/notifications/stream`, {
    method: "GET",
    headers: {
      ...headers,
      accept: EventStreamContentType,
    },
    cache: "no-store",
    signal: ctrl.signal,

    async onopen(response) {
      const contentType = response.headers.get("content-type");

      if (response.ok && contentType?.startsWith(EventStreamContentType)) {
        return;
      }

      const errorResponse = contentType?.includes("application/json")
        ? ((await response
            .clone()
            .json()
            .catch(() => null)) as {
            message?: string;
            error?: string;
          } | null)
        : null;

      throw new NotificationStreamResponseError(
        errorResponse?.message ||
          errorResponse?.error ||
          `알림 스트림 연결에 실패했습니다. (${response.status})`,
        response.status,
        contentType,
      );
    },

    onmessage(event) {
      if (!event.data || !event.data.trim().startsWith("{")) {
        return;
      }

      try {
        const parsedData = JSON.parse(event.data) as ApiNotificationItem;

        if (!parsedData.title || parsedData.title.trim() === "") {
          return;
        }

        onMessage(parsedData);
      } catch (error: unknown) {
        console.error("SSE 데이터 파싱 실패:", error);
      }
    },

    onerror(error: unknown) {
      if (
        (error instanceof Error && error.name === "AbortError") ||
        error instanceof NotificationStreamResponseError
      ) {
        throw error;
      }

      onError?.(error);
      return 5_000;
    },
  }).catch((error: unknown) => {
    if (error instanceof Error && error.name === "AbortError") {
      return;
    }

    if (error instanceof NotificationStreamResponseError) {
      console.warn(
        `실시간 알림 연결을 건너뜁니다: ${error.message}`,
        {
          status: error.status,
          contentType: error.contentType,
        },
      );
      return;
    }

    console.error("SSE 연결 중 예외 발생:", error);
  });

  return () => ctrl.abort();
}

export async function markNotificationAsRead(
  notificationId: string,
): Promise<void> {
  const headers = getAuthHeaders();

  if (!headers.Authorization) {
    console.warn("로그인 토큰이 없어 알림 읽음 처리를 수행할 수 없습니다.");
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/${notificationId}/read`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`알림 읽음 처리 실패: ${response.status}`);
    }
  } catch (error: unknown) {
    console.error("알림 읽음 처리 중 에러 발생:", error);
  }
}

// 전체 읽음
export async function markAllNotificationsAsRead(): Promise<void> {
  const headers = getAuthHeaders();

  if (!headers.Authorization) {
    console.warn("로그인 토큰이 없어 전체 읽음 처리를 수행할 수 없습니다.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...headers, // 토큰 헤더 포함
      },
    });

    if (!response.ok) {
      throw new Error(`전체 알림 읽음 처리 실패: ${response.status}`);
    }
  } catch (error: unknown) {
    console.error("전체 알림 읽음 처리 중 에러 발생:", error);
  }
}
