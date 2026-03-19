import { useRef, useCallback } from 'react';

export function useInfiniteScroll(
  callback: () => void,
  hasMore: boolean,
  loading: boolean
) {
  const observer = useRef<IntersectionObserver | null>(null);

  return useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;

      observer.current?.disconnect();

      observer.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && hasMore) callback();
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, callback]
  );
}