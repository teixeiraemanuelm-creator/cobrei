import { useEffect, useRef } from "react";

// Singleton IntersectionObserver para toda a aplicação
let globalObserver: IntersectionObserver | null = null;

function getGlobalObserver(): IntersectionObserver {
  if (!globalObserver) {
    globalObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            globalObserver?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px",
      }
    );
  }
  return globalObserver;
}

/**
 * Hook para revelar elementos ao fazer scroll
 * Usa um IntersectionObserver compartilhado globalmente para melhor performance
 */
export function useScrollReveal() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = getGlobalObserver();
    observer.observe(ref.current);

    return () => {
      observer.unobserve(ref.current!);
    };
  }, []);

  return ref;
}
