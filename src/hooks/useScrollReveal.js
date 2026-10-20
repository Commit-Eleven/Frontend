import { useEffect } from 'react';

/** 스크롤 영역에 들어온 소개 요소를 한 번만 부드럽게 표시합니다. */
export function useScrollReveal(scrollRef) {
  useEffect(() => {
    const root = scrollRef.current;
    if (!root || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const elements = root.querySelectorAll(
      '.auth-feature > *, .auth-final-cta > *',
    );

    /** 화면에 들어온 요소를 표시한 뒤 관찰을 종료합니다. */
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root,
      threshold: 0.12,
      rootMargin: '0px 0px -24px 0px',
    });

    elements.forEach((element) => {
      element.classList.add('is-reveal-ready');
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      elements.forEach((element) =>
        element.classList.remove('is-reveal-ready', 'is-revealed'),
      );
    };
  }, [scrollRef]);
}
