import { fetchEventSource } from "@microsoft/fetch-event-source";
import { API_BASE_URL, getAuthHeaders } from "@/lib/auth";

export interface ApiNotificationItem {
  id: number;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
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
          console.log("JSON이 아닌 데이터 무시됨:", event.data);
          return;
        }

        try {
          const parsedData = JSON.parse(event.data) as ApiNotificationItem;
          onMessage(parsedData);
        } catch (e: unknown) {
          console.error(
            "SSE 데이터 파싱 실패:",
            e,
            "들어온 데이터:",
            event.data,
          );
        }
      },

      onerror(err: unknown) {
        console.error("SSE 스트림 에러:", err);
        if (onError) onError(err);
      },
    },
  );

  return () => ctrl.abort();
}
