import { fetchEventSource } from "@microsoft/fetch-event-source";
import { API_BASE_URL, getAuthHeaders } from "@/lib/auth";

export interface ApiNotificationItem {
  id: number;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  targetType?: string;
  targetId?: string;
  payload?: {
    mockApplyId?: number;
    taskId?: string;
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
  apiType?: string;
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

  const tokenOnly = headers.Authorization.replace("Bearer ", "");

  fetchEventSource(
    `${API_BASE_URL}/api/notifications/stream?accessToken=${tokenOnly}`,
    {
      method: "GET",
      headers: {
        ...headers,
        Accept: "text/event-stream",
      },
      signal: ctrl.signal,

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
        } catch (e: unknown) {
          console.error("SSE 데이터 파싱 실패:", e);
        }
      },

      onerror(err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("SSE 스트림 에러:", err);
        if (onError) onError(err);
      },
    },
  ).catch((err) => {
    if (err.name === "AbortError") {
      console.log("알림 스트림 연결이 정상적으로 해제되었습니다. (Abort)");
      return;
    }
    console.error("SSE 연결 중 예외 발생:", err);
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
