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

export function useLnbScrollMetrics(
  isEnabled: boolean,
  recalculationKey: number,
) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
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

    const trackHeight = Math.max(clientHeight - lnbScrollbarPadding, 0);
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
  }, []);

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
  className,
}: {
  metrics: LnbScrollbarMetrics;
  className?: string;
}) {
  if (!metrics.isScrollable) {
    return null;
  }

  return (
    <span
      aria-hidden="true"
      className={clsx(
        "pointer-events-none absolute inset-y-0 right-[-4px] flex w-3 flex-col items-end rounded-badge-round p-1",
        className,
      )}
    >
      <span className="relative flex w-1 flex-1 flex-col items-center gap-2.5">
        <span
          className="absolute right-0 flex w-1 flex-col items-start rounded-badge-round bg-icon-neutral-weak"
          style={{
            height: metrics.thumbHeight,
            transform: `translateY(${metrics.thumbTop}px)`,
          }}
        />
      </span>
    </span>
  );
}
