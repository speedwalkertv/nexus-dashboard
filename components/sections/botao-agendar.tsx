"use client";

import { Check, Plus } from "lucide-react";
import { useBooking } from "@/components/booking/booking-context";
import { cn } from "@/lib/cn";

type Props = { servicoId: string; nomeServico: string; className?: string };

/** Marca ou desmarca o serviço no pedido, sem tirar a pessoa da lista. */
export function BotaoAgendar({ servicoId, nomeServico, className }: Props) {
  const { selecionados, toggleServico } = useBooking();
  const ativo = selecionados.some((item) => item.id === servicoId);

  return (
    <button
      type="button"
      onClick={() => toggleServico(servicoId)}
      aria-pressed={ativo}
      aria-label={`${ativo ? "Tirar do pedido" : "Adicionar ao pedido"}: ${nomeServico}`}
      className={cn(
        "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition duration-200 ease-suave active:scale-[0.97]",
        ativo
          ? "border-dourado bg-dourado/15 text-dourado-claro"
          : "border-terracota text-terracota-soft hover:bg-terracota hover:text-ink",
        className,
      )}
    >
      {ativo ? <Check className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
      {ativo ? "No pedido" : "Adicionar"}
    </button>
  );
}
