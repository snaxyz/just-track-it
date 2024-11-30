import { useCallback, useRef } from "react";

export function useScrollToBottom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollEnabled = useRef(false);
  const lastScrollTop = useRef(0);

  const scrollToBottom = useCallback((force?: boolean, instant?: boolean) => {
    if (force) {
      autoScrollEnabled.current = true;
    }
    if (containerRef.current && autoScrollEnabled.current === true) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: instant ? "instant" : "smooth",
      });
    }
  }, []);

  const onScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const atBottom = scrollHeight - scrollTop === clientHeight;

      if (scrollTop > lastScrollTop.current || atBottom) {
        autoScrollEnabled.current = true;
      } else if (scrollTop < lastScrollTop.current) {
        autoScrollEnabled.current = false;
      }

      lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
    }
  }, []);

  return {
    containerRef,
    scrollToBottom,
    onScroll,
  };
}
