import { business } from "./business";
import { duracaoLabel, precoLabel, type Servico } from "./services";

export type ItemAgendamento = { servico: Servico; opcao?: string };

export type Agendamento = {
  itens: ItemAgendamento[];
  nome: string;
  observacao?: string;
};

function formatarReais(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  });
}

export function mensagemWhatsApp(a: Agendamento) {
  const linhas = [`Olá, ${business.nome}! Quero marcar um horário.`, ""];

  if (a.itens.length === 1) {
    const item = a.itens[0];
    linhas.push(`*Serviço:* ${item.servico.nome}${item.opcao ? ` (${item.opcao})` : ""}`);
    linhas.push(`*Valor:* ${precoLabel(item.servico)}`);
  } else {
    linhas.push("*Serviços:*");
    for (const item of a.itens) {
      linhas.push(`• ${item.servico.nome}${item.opcao ? ` (${item.opcao})` : ""} — ${precoLabel(item.servico)}`);
    }

    const fechados = a.itens.filter((item) => item.servico.preco !== null && !item.servico.aPartirDe);
    const emAberto = a.itens.length - fechados.length;
    if (fechados.length > 0) {
      const total = fechados.reduce((soma, item) => soma + (item.servico.preco ?? 0), 0);
      const rotulo = emAberto > 0 ? "*Valor parcial:*" : "*Valor total:*";
      linhas.push(`${rotulo} ${formatarReais(total)}${emAberto > 0 ? " + itens combinados na conversa" : ""}`);
    }
  }

  const duracaoTotal = a.itens.reduce((soma, item) => soma + item.servico.duracaoMin, 0);
  linhas.push(`*Duração estimada:* ${duracaoLabel(duracaoTotal)}`);
  linhas.push(`*Nome:* ${a.nome}`);
  if (a.observacao?.trim()) linhas.push(`*Observação:* ${a.observacao.trim()}`);
  linhas.push("", "Qual dia e horário ficam bons pra você?", "", "Enviado pelo site.");
  return linhas.join("\n");
}

export function linkWhatsApp(texto: string) {
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(texto)}`;
}
