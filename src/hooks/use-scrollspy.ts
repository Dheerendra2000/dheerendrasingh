
'use client';

import { useState, useEffect, useRef } from 'react';

type UseScrollSpyOptions = IntersectionObserverInit & {
  enabled?: boolean;
};

export function useScrollSpy(
  ids: string[],
  options: UseScrollSpyOptions = { root: null, rootMargin: '0% 0% -50% 0%', threshold: 0, enabled: true }
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { root, rootMargin, threshold, enabled } = options;

  useEffect(() => {
    if (!enabled) {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { root, rootMargin, threshold }
    );

    observerRef.current = observer;

    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as Element[];
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [ids, root, rootMargin, threshold, enabled]); // Rerun observer if options change

  // Special handling for the very top of the page (home)
  // This runs separately from the observer to handle the edge case at the top
  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      // Check if the user is at the very top of the page.
      if (window.scrollY < 200) {
        setActiveId('home');
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled]);

  return activeId;
}
