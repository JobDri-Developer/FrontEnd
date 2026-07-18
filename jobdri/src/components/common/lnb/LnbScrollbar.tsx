"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";

export const lnbHiddenScrollbarClass =
  "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const lnbScrollbarPadding = 8;
const lnbScrollbarMinThumbHeight = 24;

interface LnbScrollbarMetrics {
  isScrollable: boolean;
  thumbHeight: number;
  thumbTop: number;
}

type LnbScrollbarSize = "s" | "l";

export function useLnbScrollMetrics<T extends HTMLElement = HTMLDivElement>(
  isEnabled: boolean,
  recalculationKey: unknown,
  options?: {
    trackPadding?: number;
  },
) {
  const scrollAreaRef = useRef<T>(null);
  const trackPadding = options?.trackPadding ?? lnbScrollbarPadding;
  const [scrollbarMetrics, setScrollbarMetrics] =
    useState<LnbScrollbarMetrics>({
      isScrollable: false,
      thumbHeight: 0,
      thumbTop: 0,
    });
  const updateScrollbarMetrics = useCallback(() => {
    const scrollAreaElement = scrollAreaRef.current;

    if (!scrollAreaElement) {
      return;
    }

    const { clientHeight, scrollHeight, scrollTop } = scrollAreaElement;
    const isScrollable = scrollHeight > clientHeight + 1;

    if (!isScrollable) {
      setScrollbarMetrics({
        isScrollable: false,
        thumbHeight: 0,
        thumbTop: 0,
      });
      return;
    }

    const trackHeight = Math.max(clientHeight - trackPadding, 0);
    const thumbHeight = Math.min(
      Math.max(
        (clientHeight / scrollHeight) * trackHeight,
        lnbScrollbarMinThumbHeight,
      ),
      trackHeight,
    );
    const maxScrollTop = scrollHeight - clientHeight;
    const maxThumbTop = trackHeight - thumbHeight;
    const thumbTop =
      maxScrollTop > 0 ? (scrollTop / maxScrollTop) * maxThumbTop : 0;

    setScrollbarMetrics({
      isScrollable: true,
      thumbHeight,
      thumbTop,
    });
  }, [trackPadding]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const scrollAreaElement = scrollAreaRef.current;

    if (!scrollAreaElement) {
      return;
    }

    const animationFrameId = window.requestAnimationFrame(
      updateScrollbarMetrics,
    );

    const contentElement = scrollAreaElement.firstElementChild;
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateScrollbarMetrics);

    resizeObserver?.observe(scrollAreaElement);

    if (contentElement instanceof HTMLElement) {
      resizeObserver?.observe(contentElement);
    }

    window.addEventListener("resize", updateScrollbarMetrics);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateScrollbarMetrics);
    };
  }, [isEnabled, recalculationKey, updateScrollbarMetrics]);

  return {
    scrollAreaRef,
    scrollbarMetrics,
    updateScrollbarMetrics,
  };
}

export function LnbScrollbar({
  metrics,
  size = "s",
  className,
}: {
  metrics: LnbScrollbarMetrics;
  size?: LnbScrollbarSize;
  className?: string;
}) {
  if (!metrics.isScrollable) {
    return null;
  }

  const isLarge = size === "l";

  return (
    <span
      aria-hidden="true"
      className={clsx(
        "pointer-events-none absolute flex flex-col items-center rounded-badge-round p-1",
        isLarge ? "w-4" : "w-3",
        !className && "inset-y-0 right-[-4px] items-end",
        className,
      )}
    >
      <span
        className={clsx(
          "relative flex flex-1 flex-col items-center gap-2.5",
          isLarge ? "w-2" : "w-1",
        )}
      >
        <span
          className={clsx(
            "absolute right-0 flex flex-col items-start rounded-badge-round bg-icon-neutral-weak",
            isLarge ? "w-2" : "w-1",
          )}
          style={{
            height: metrics.thumbHeight,
            transform: `translateY(${metrics.thumbTop}px)`,
          }}
        />
      </span>
    </span>
  );
}
