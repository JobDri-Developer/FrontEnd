import { useState, useEffect, useRef, useCallback } from "react";

export function useScrollGradient<T extends HTMLElement>(
  deps: React.DependencyList = [],
) {
  const scrollRef = useRef<T>(null);
  const [showGradient, setShowGradient] = useState(false);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = scrollRef.current;
      const isScrollable = scrollHeight - clientHeight > 2;
      const isNotAtBottom =
        Math.ceil(scrollTop + clientHeight) < scrollHeight - 2;

      setShowGradient(isScrollable && isNotAtBottom);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(checkScroll, 50);
    let observer: ResizeObserver | null = null;

    if (scrollRef.current) {
      observer = new ResizeObserver(() => checkScroll());
      observer.observe(scrollRef.current);
    }

    window.addEventListener("resize", checkScroll);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, ...deps]);

  return {
    scrollRef,
    showGradient,
    checkScroll,
  };
}
