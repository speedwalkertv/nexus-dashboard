import { business } from "./business";
import { duracaoLabel, precoLabel, type Servico } from "./services";

export type Agendamento = {
  servico: Servico;
  opcao?: string;
  nome: string;
  observacao?: string;
};

export function mensagemWhatsApp(a: Agendamento) {
  const linhas = [
    `Olá, ${business.nome}! Quero marcar um horário.`,
    "",
    `*Serviço:* ${a.servico.nome}${a.opcao ? ` (${a.opcao})` : ""}`,
    `*Valor:* ${precoLabel(a.servico)}`,
    `*Duração estimada:* ${duracaoLabel(a.servico.duracaoMin)}`,
    `*Nome:* ${a.nome}`,
  ];
  if (a.observacao?.trim()) linhas.push(`*Observação:* ${a.observacao.trim()}`);
  linhas.push("", "Qual dia e horário ficam bons pra você?", "", "Enviado pelo site.");
  return linhas.join("\n");
}

export function linkWhatsApp(texto: string) {
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(texto)}`;
}
