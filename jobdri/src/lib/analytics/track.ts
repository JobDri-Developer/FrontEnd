import { trackEvent } from "@/lib/analytics/client";
import type { EventName, EventPropertiesMap } from "@/lib/analytics/events";

/** 프로퍼티가 없는 이벤트(값이 Record<string, never>인 것)만 골라낸다. */
type EventWithoutProperties = {
  [K in EventName]: EventPropertiesMap[K] extends Record<string, never>
    ? K
    : never;
}[EventName];

type EventWithProperties = Exclude<EventName, EventWithoutProperties>;

/**
 * 타입 세이프 이벤트 전송.
 *
 * - 레지스트리에 없는 이벤트명 → 컴파일 에러
 * - 프로퍼티 누락/오타/타입 불일치 → 컴파일 에러
 *
 * 택소노미와 코드가 어긋나는 것을 런타임이 아니라 빌드에서 잡는 게 목적이다.
 */
export function track<K extends EventWithoutProperties>(event: K): void;
export function track<K extends EventWithProperties>(
  event: K,
  properties: EventPropertiesMap[K],
): void;
export function track(event: EventName, properties?: Record<string, unknown>) {
  trackEvent(event, properties);
}
