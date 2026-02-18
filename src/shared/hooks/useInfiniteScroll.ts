// ===============================================
// useInfiniteScroll - Custom Hook לגלילה אינסופית
// ===============================================

import { useRef, useCallback } from 'react';

/**
 * Hook לגלילה אינסופית - טוען עוד תוכן כשמגיעים לתחתית
 * @param callback - פונקציה שתופעל כשמגיעים לתחתית
 * @param hasMore - האם יש עוד תוכן לטעון
 * @param loading - האם כרגע טוען
 * @returns ref להוסיף לאלמנט האחרון ברשימה
 * 
 * @example
 * const [page, setPage] = useState(1);
 * const [loading, setLoading] = useState(false);
 * const [hasMore, setHasMore] = useState(true);
 * 
 * const loadMore = useCallback(() => {
 *   setLoading(true);
 *   // טען עוד מתכונים...
 *   setPage(p => p + 1);
 * }, []);
 * 
 * const lastRecipeRef = useInfiniteScroll(loadMore, hasMore, loading);
 * 
 * return (
 *   <div>
 *     {recipes.map((recipe, index) => (
 *       <div 
 *         key={recipe.id}
 *         ref={index === recipes.length - 1 ? lastRecipeRef : null}
 *       >
 *         {recipe.name}
 *       </div>
 *     ))}
 *   </div>
 * );
 */
export function useInfiniteScroll(
  callback: () => void,
  hasMore: boolean,
  loading: boolean
) {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      
      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          callback();
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, callback]
  );

  return lastElementRef;
}