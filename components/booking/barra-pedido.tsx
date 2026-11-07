"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { classesBotao } from "@/components/ui/botao";
import { formatarReais, totaisDoPedido } from "@/lib/booking";
import { duracaoLabel, servicoPorId } from "@/lib/services";
import { useBooking } from "./booking-context";

/** No celular, mantém o pedido à mão enquanto a pessoa percorre a lista de serviços. */
export function BarraPedido() {
  const { selecionados, irPara } = useBooking();
  const [noFormulario, setNoFormulario] = useState(false);

  useEffect(() => {
    const alvo = document.getElementById("agendar");
    if (!alvo) return;
    const observador = new IntersectionObserver(([entrada]) => setNoFormulario(entrada.isIntersecting), {
      threshold: 0.15,
    });
    observador.observe(alvo);
    return () => observador.disconnect();
  }, []);

  const itens = selecionados.flatMap((item) => {
    const servico = servicoPorId(item.id);
    return servico ? [{ servico }] : [];
  });

  if (itens.length === 0 || noFormulario) return null;

  const { totalFechado, temFechado, emAberto, duracaoTotal } = totaisDoPedido(itens);
  const valor = temFechado ? `${emAberto > 0 ? "a partir de " : ""}${formatarReais(totalFechado)}` : "sob consulta";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-creme/15 bg-ink/95 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-between gap-4">
        <p className="min-w-0 text-sm leading-snug">
          <span className="block text-creme">
            {itens.length} serviço{itens.length === 1 ? "" : "s"} · {valor}
          </span>
          <span className="block text-creme/70">≈ {duracaoLabel(duracaoTotal)}</span>
        </p>
        <a
          href="#agendar"
          onClick={() => irPara("servico")}
          className={classesBotao("primario", "md", "shrink-0")}
        >
          Revisar pedido
          <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </div>
  );
}
