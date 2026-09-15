import { trackEvent } from "@/lib/analytics/client";
import type { EventName, EventPropertiesMap } from "@/lib/analytics/events";

/** 프로퍼티가 없는 이벤트(값이 Record<string, never>인 것)만 골라낸다. */
type EventWithoutProperties = {
  [K in EventName]: EventPropertiesMap[K] extends Record<string, never>
    ? K
    : never;
}[EventName];

type EventWithProperties = Exclude<EventName, EventWithoutProperties>;

/*
 * 타입 세이프 이벤트 전송.
 */
export function track<K extends EventWithoutProperties>(event: K): void;
export function track<K extends EventWithProperties>(
  event: K,
  properties: EventPropertiesMap[K],
): void;
export function track(event: EventName, properties?: Record<string, unknown>) {
  trackEvent(event, properties);
}
