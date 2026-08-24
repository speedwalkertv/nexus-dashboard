"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: React.ReactNode;
  /** Atraso em segundos — usado para escalonar itens de uma mesma seção. */
  delay?: number;
  className?: string;
};

/**
 * Entrada suave ao rolar. O conteúdo nasce visível: só é escondido depois da
 * montagem e apenas se estiver fora da tela — assim nada some se o JS falhar.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [oculto, setOculto] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight - 80) return;

    setOculto(true);
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        setOculto(false);
        observador.disconnect();
      },
      { rootMargin: "0px 0px -80px 0px" },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}s` }}
      className={cn(
        "transition duration-700 ease-entrada",
        oculto && "reveal-oculto translate-y-6 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
