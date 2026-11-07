"use client";

import { useMemo } from "react";
import { MessageCircle } from "lucide-react";
import { classesBotao } from "@/components/ui/botao";
import {
  linkWhatsApp,
  mensagemWhatsApp,
  periodos,
  proximosDias,
  type ItemAgendamento,
  type PeriodoId,
} from "@/lib/booking";
import { cn } from "@/lib/cn";
import { servicoPorId } from "@/lib/services";
import { useBooking } from "./booking-context";

const campo =
  "w-full rounded-xl border border-creme/20 bg-white/[0.04] px-4 py-3 text-creme placeholder:text-creme/50 transition focus:border-dourado/70 [color-scheme:dark]";

export function StepDados() {
  const { selecionados, nome, setNome, observacao, setObservacao, dia, setDia, periodo, setPeriodo } =
    useBooking();

  const dias = useMemo(() => proximosDias(), []);

  const itens: ItemAgendamento[] = [];
  for (const item of selecionados) {
    const servico = servicoPorId(item.id);
    if (servico) itens.push({ servico, opcao: item.opcao });
  }

  const nomeValido = nome.trim().length >= 2;
  const pronto = nomeValido && itens.length > 0;

  const link = pronto
    ? linkWhatsApp(
        mensagemWhatsApp({
          itens,
          nome: nome.trim(),
          observacao,
          dia: dia || undefined,
          periodo: periodo || undefined,
        }),
      )
    : "";

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="nome" className="mb-2 block text-sm text-creme/80">
          Seu nome <span className="text-terracota-soft">*</span>
        </label>
        <input
          id="nome"
          name="nome"
          autoComplete="name"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Como você quer ser chamada"
          className={campo}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="dia" className="mb-2 block text-sm text-creme/80">
            Melhor dia <span className="text-creme/60">(opcional)</span>
          </label>
          <select id="dia" value={dia} onChange={(e) => setDia(e.target.value)} className={campo}>
            <option value="">Qualquer dia</option>
            {dias.map((d) => (
              <option key={d.valor} value={d.valor}>
                {d.rotulo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="periodo" className="mb-2 block text-sm text-creme/80">
            Período <span className="text-creme/60">(opcional)</span>
          </label>
          <select
            id="periodo"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value as PeriodoId | "")}
            className={campo}
          >
            <option value="">Qualquer horário</option>
            {periodos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.rotulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="observacao" className="mb-2 block text-sm text-creme/80">
          Quer avisar algo? <span className="text-creme/60">(opcional)</span>
        </label>
        <textarea
          id="observacao"
          name="observacao"
          rows={3}
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          placeholder="Alergia, referência de foto, comprimento do cabelo..."
          className={cn(campo, "resize-none")}
        />
      </div>

      {pronto ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={classesBotao("primario", "lg", "w-full")}
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          Enviar pedido pelo WhatsApp
        </a>
      ) : (
        <button type="button" disabled className={classesBotao("primario", "lg", "w-full")}>
          <MessageCircle className="h-5 w-5" aria-hidden />
          Enviar pedido pelo WhatsApp
        </button>
      )}

      <p className="text-center text-sm text-creme/70">
        {nomeValido
          ? "O WhatsApp abre com o pedido pronto. A Geovana confirma o horário exato por lá."
          : "Preencha seu nome para liberar o envio."}
      </p>
    </div>
  );
}
