import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { LnbNotificationItem } from "@/components/common/lnb";

export function useNotifications() {
  const queryClient = useQueryClient();

  const { data: items = [] } = useQuery<LnbNotificationItem[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      return res.json();
    },
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unread-count"],
    queryFn: async () => {
      const res = await fetch("/api/notifications/unread-count");
      const data = await res.json();
      return data.count;
    },
  });

  useEffect(() => {
    const eventSource = new EventSource("/api/notifications/stream");

    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      queryClient.setQueryData(
        ["notifications"],
        (old: LnbNotificationItem[]) => [newNotification, ...old],
      );
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    };

    return () => eventSource.close();
  }, [queryClient]);

  const readMutation = useMutation({
    mutationFn: async (id?: string) => {
      const url = id
        ? `/api/notifications/${id}/read`
        : "/api/notifications/read-all";
      return fetch(url, { method: "PATCH" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  return { items, unreadCount, readMutation };
}
