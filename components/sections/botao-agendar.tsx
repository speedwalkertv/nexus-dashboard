"use client";

import { ArrowRight } from "lucide-react";
import { useAgendarServico } from "@/components/booking/booking-context";
import { cn } from "@/lib/cn";

type Props = { servicoId: string; nomeServico: string; className?: string };

export function BotaoAgendar({ servicoId, nomeServico, className }: Props) {
  const agendar = useAgendarServico();

  return (
    <button
      type="button"
      onClick={() => agendar(servicoId)}
      aria-label={`Agendar ${nomeServico}`}
      className={cn(
        "group inline-flex items-center gap-1.5 text-sm font-medium text-terracota transition hover:text-terracota-dark",
        className,
      )}
    >
      Agendar
      <ArrowRight
        className="h-4 w-4 transition-transform duration-200 ease-suave group-hover:translate-x-0.5"
        aria-hidden
      />
    </button>
  );
}
