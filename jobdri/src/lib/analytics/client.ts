import * as amplitude from "@amplitude/analytics-browser";
import { Identify, Types } from "@amplitude/analytics-browser";

import { getAnalyticsIdentity, getStoredAccessToken } from "@/lib/auth";
import { normalizeRoute } from "@/lib/analytics/routes";

const API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
const IS_DEV = process.env.NODE_ENV !== "production";

/*
 * 개발 환경에서는 전송을 기본 차단한다. 로컬 테스트 이벤트가 실서비스 지표에
 * 섞이면 나중에 걸러낼 방법이 없다. 계측을 검증할 때만 dev 전용 프로젝트 키와
 * 함께 명시적으로 켠다.
 */
const DEV_TRACKING_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_DEV === "true";

/*
 * Amplitude는 user_id 최소 길이를 5자로 검증한다(minIdLength 기본값). 접두사를 붙여 길이를 확보한다.
 */
const USER_ID_PREFIX = "usr_";

export function toAnalyticsUserId(userId: number | string) {
  return `${USER_ID_PREFIX}${userId}`;
}

let initialized = false;
/* 마지막으로 Amplitude에 반영한 user id. 중복 호출을 막는 용도. */
let syncedUserId: string | null = null;

export function isAnalyticsReady() {
  return initialized;
}

/*
 * 모든 이벤트에 공통 속성을 주입하는 enrichment 플러그인.
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

  if (IS_DEV && !DEV_TRACKING_ENABLED) {
    console.info(
      "[analytics] 개발 환경이라 전송을 건너뜁니다. " +
        "검증이 필요하면 NEXT_PUBLIC_ANALYTICS_DEV=true로 켜세요(dev 전용 키 사용).",
    );
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
      sessions: true,
      attribution: true,
      pageViews: false,
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

/*
 * 저장된 토큰을 읽어 Amplitude의 유저 식별 상태를 맞춘다.
 */
export function syncAnalyticsUser() {
  if (!initialized) {
    return;
  }

  const accessToken = getStoredAccessToken();
  const identity = accessToken ? getAnalyticsIdentity(accessToken) : null;

  if (!identity) {
    // 로그아웃 또는 토큰 만료. device id까지 새로 발급해 이전 유저와 분리한다.
    //
    // 모듈 변수(syncedUserId)가 아니라 SDK의 실제 상태를 본다. Amplitude는
    // user id를 쿠키에 유지하는데, 401 자동 로그아웃은 window.location.replace로
    // 페이지를 새로 띄워서 모듈 변수만 null로 초기화된다. 모듈 변수를 기준으로
    // 하면 이 경우 reset이 불려야 하는데 건너뛰고, 로그아웃한 유저에게 이후
    // 익명 이벤트가 계속 붙는다.
    if (amplitude.getUserId() !== undefined) {
      amplitude.reset();
    }
    syncedUserId = null;
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
