"use client";

import { useRef } from "react";
import { MessageCircle } from "lucide-react";
import { classesBotao } from "@/components/ui/botao";
import { linkWhatsApp, mensagemWhatsApp } from "@/lib/booking";
import { cn } from "@/lib/cn";
import { registrarPedido } from "@/lib/agendamentos-registrar";
import type { Servico } from "@/lib/services";
import { useBooking } from "./booking-context";

type Props = { servico: Servico; dia: Date };

const campo =
  "w-full rounded-xl border border-creme/15 bg-white/[0.03] px-4 py-3 text-creme placeholder:text-creme/35 transition focus:border-dourado/60";

export function StepDados({ servico, dia }: Props) {
  const { nome, setNome, observacao, setObservacao, opcao, hora, diaIso } = useBooking();
  const jaRegistrado = useRef(false);

  const nomeValido = nome.trim().length >= 2;
  const pronto = nomeValido && Boolean(hora);

  const link = pronto
    ? linkWhatsApp(
        mensagemWhatsApp({
          servico,
          opcao: opcao ?? undefined,
          data: dia,
          hora: hora as string,
          nome: nome.trim(),
          observacao,
        }),
      )
    : "";

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="nome" className="mb-2 block text-sm text-creme/70">
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

      <div>
        <label htmlFor="observacao" className="mb-2 block text-sm text-creme/70">
          Quer avisar algo? <span className="text-creme/40">(opcional)</span>
        </label>
        <textarea
          id="observacao"
          name="observacao"
          rows={3}
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          placeholder="Alergia, referência de foto, se é a primeira vez..."
          className={cn(campo, "resize-none")}
        />
      </div>

      {pronto ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (jaRegistrado.current || !diaIso || !hora) return;
            jaRegistrado.current = true;
            registrarPedido({ servico, opcao: opcao ?? undefined, diaIso, hora, nome, observacao });
          }}
          className={classesBotao("primario", "lg", "w-full")}
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          Enviar pedido no WhatsApp
        </a>
      ) : (
        <button type="button" disabled className={classesBotao("primario", "lg", "w-full")}>
          <MessageCircle className="h-5 w-5" aria-hidden />
          Enviar pedido no WhatsApp
        </button>
      )}

      <p className="text-center text-sm text-creme/50">
        {nomeValido
          ? "Abre o WhatsApp com tudo preenchido. Você confere e envia — a confirmação vem na conversa."
          : "Preencha seu nome para liberar o envio."}
      </p>
    </div>
  );
}
