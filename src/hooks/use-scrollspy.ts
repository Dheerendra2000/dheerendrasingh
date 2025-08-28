
'use client';

import { useState, useEffect } from 'react';

type UseScrollSpyOptions = IntersectionObserverInit & {
  enabled?: boolean;
};

export function useScrollSpy(
  ids: string[],
  options: UseScrollSpyOptions = { root: null, rootMargin: '0% 0% -50% 0%', threshold: 0, enabled: true }
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { root, rootMargin, threshold, enabled } = options;

  useEffect(() => {
    if (!enabled) {
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

    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as Element[];
    elements.forEach((el) => observer.observe(el));

    // Special handling for the very top of the page (home)
    const handleScroll = () => {
        if (window.scrollY < 200) { // If very close to the top
            setActiveId('home');
        } else {
            // Re-evaluate if another section is in view when not at the top
            const visibleEntry = Array.from(observer.takeRecords()).find(e => e.isIntersecting);
            if (visibleEntry) {
                setActiveId(visibleEntry.target.id);
            }
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ids, root, rootMargin, threshold, enabled]);

  return activeId;
}
