import * as amplitude from "@amplitude/analytics-browser";
import { Identify, Types } from "@amplitude/analytics-browser";

import { getAnalyticsIdentity, getStoredAccessToken } from "@/lib/auth";
import { normalizeRoute } from "@/lib/analytics/routes";

const API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
const IS_DEV = process.env.NODE_ENV !== "production";

/**
 * Amplitude는 user_id 최소 길이를 5자로 검증한다(minIdLength 기본값).
 * 우리 userId는 1, 2 같은 작은 정수라서 그대로 넣으면
 * 에러도 없이 이벤트가 서버에서 버려진다. 접두사를 붙여 길이를 확보한다.
 */
const USER_ID_PREFIX = "usr_";

export function toAnalyticsUserId(userId: number | string) {
  return `${USER_ID_PREFIX}${userId}`;
}

let initialized = false;
/** 마지막으로 Amplitude에 반영한 user id. 중복 호출을 막는 용도. */
let syncedUserId: string | null = null;

export function isAnalyticsReady() {
  return initialized;
}

/**
 * 모든 이벤트에 공통 속성을 주입하는 enrichment 플러그인.
 *
 * 이벤트마다 page_path를 손으로 넣으면 반드시 빠뜨리는 곳이 생긴다.
 * 파이프라인 한 곳에서 붙이면 누락이 구조적으로 불가능해진다.
 */
function commonPropertiesPlugin(): Types.EnrichmentPlugin {
  return {
    name: "jobdri-common-properties",
    type: "enrichment",
    execute: async (event) => {
      event.event_properties = {
        page_path: normalizeRoute(window.location.pathname),
        ...event.event_properties,
      };

      return event;
    },
  };
}

export function initAnalytics() {
  if (initialized || typeof window === "undefined") {
    return;
  }

  if (!API_KEY) {
    if (IS_DEV) {
      console.warn(
        "[analytics] NEXT_PUBLIC_AMPLITUDE_API_KEY가 없어 추적을 건너뜁니다.",
      );
    }
    return;
  }

  amplitude.init(API_KEY, {
    autocapture: {
      // 세션과 유입 경로(UTM/referrer)는 직접 만들 이유가 없다.
      sessions: true,
      attribution: true,
      // 페이지뷰는 직접 보낸다. 자동 수집은 /mockApply/12345 같은 원본 URL을
      // 그대로 실어서 지원 건 수만큼 값이 쪼개진다.
      pageViews: false,
      // 아래 자동 수집은 Tailwind 클래스명 기반이라 노이즈만 만든다.
      elementInteractions: false,
      formInteractions: false,
      fileDownloads: false,
    },
    logLevel: IS_DEV ? Types.LogLevel.Debug : Types.LogLevel.Warn,
  });

  amplitude.add(commonPropertiesPlugin());

  initialized = true;
  syncAnalyticsUser();
}

/**
 * 저장된 토큰을 읽어 Amplitude의 유저 식별 상태를 맞춘다.
 *
 * 로그인 직후뿐 아니라 새로고침·재방문에도 필요해서(토큰 만료 1시간,
 * setUserId는 메모리에만 남는다) 화면 전환마다 호출한다. 멱등이다.
 */
export function syncAnalyticsUser() {
  if (!initialized) {
    return;
  }

  const accessToken = getStoredAccessToken();
  const identity = accessToken ? getAnalyticsIdentity(accessToken) : null;

  if (!identity) {
    // 로그아웃 또는 토큰 만료. device id까지 새로 발급해 이전 유저와 분리한다.
    if (syncedUserId !== null) {
      amplitude.reset();
      syncedUserId = null;
    }
    return;
  }

  const nextUserId = toAnalyticsUserId(identity.userId);

  if (nextUserId === syncedUserId) {
    return;
  }

  amplitude.setUserId(nextUserId);

  const identify = new Identify();
  if (identity.role) {
    // 내부 계정(ADMIN) 이벤트를 차트에서 걸러내기 위한 필수 속성.
    // 계측 초기 데이터는 대부분 팀원 테스트라 이게 없으면 지표를 믿을 수 없다.
    identify.set("role", identity.role);
  }
  amplitude.identify(identify);

  syncedUserId = nextUserId;
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>,
) {
  if (!initialized) {
    if (IS_DEV) {
      console.debug("[analytics] (미초기화)", eventName, properties ?? {});
    }
    return;
  }

  amplitude.track(eventName, properties);
}
