"use client";

import { MessageCircle } from "lucide-react";
import { classesBotao } from "@/components/ui/botao";
import { linkWhatsApp, mensagemWhatsApp, type ItemAgendamento } from "@/lib/booking";
import { cn } from "@/lib/cn";
import { servicoPorId } from "@/lib/services";
import { useBooking } from "./booking-context";

const campo =
  "w-full rounded-xl border border-creme/15 bg-white/[0.03] px-4 py-3 text-creme placeholder:text-creme/35 transition focus:border-dourado/60";

export function StepDados() {
  const { selecionados, nome, setNome, observacao, setObservacao } = useBooking();

  const itens: ItemAgendamento[] = [];
  for (const item of selecionados) {
    const servico = servicoPorId(item.id);
    if (servico) itens.push({ servico, opcao: item.opcao });
  }

  const nomeValido = nome.trim().length >= 2;
  const pronto = nomeValido && itens.length > 0;

  const link = pronto
    ? linkWhatsApp(mensagemWhatsApp({ itens, nome: nome.trim(), observacao }))
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
          placeholder="Dia e horário de preferência, alergia, referência de foto..."
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
          Marcar horário no WhatsApp
        </a>
      ) : (
        <button type="button" disabled className={classesBotao("primario", "lg", "w-full")}>
          <MessageCircle className="h-5 w-5" aria-hidden />
          Marcar horário no WhatsApp
        </button>
      )}

      <p className="text-center text-sm text-creme/50">
        {nomeValido
          ? "Abre o WhatsApp com tudo preenchido. O dia e o horário são combinados na conversa."
          : "Preencha seu nome para liberar o envio."}
      </p>
    </div>
  );
}
