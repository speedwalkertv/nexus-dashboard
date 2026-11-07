import { hojeISO } from "./agendamentos-tipos";
import { business } from "./business";
import { duracaoLabel, precoLabel, type Servico } from "./services";

export type ItemAgendamento = { servico: Servico; opcao?: string };

export type Agendamento = {
  itens: ItemAgendamento[];
  nome: string;
  observacao?: string;
  /** AAAA-MM-DD do dia de preferência, quando a cliente informou. */
  dia?: string;
  periodo?: PeriodoId;
};

export const periodos = [
  { id: "manha", rotulo: "Manhã (9h às 12h)" },
  { id: "tarde", rotulo: "Tarde (12h às 18h)" },
  { id: "noite", rotulo: "Noite (18h às 21h)" },
] as const;

export type PeriodoId = (typeof periodos)[number]["id"];

const formatoDia = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "UTC",
  weekday: "long",
  day: "2-digit",
  month: "2-digit",
});

export function rotuloDia(dataISO: string) {
  return formatoDia.format(new Date(`${dataISO}T12:00:00Z`));
}

/** Próximos dias em que o espaço abre, a partir de hoje no fuso do espaço. */
export function proximosDias(quantidade = 12) {
  const base = new Date(`${hojeISO()}T12:00:00Z`);
  const dias: { valor: string; rotulo: string }[] = [];
  for (let i = 0; dias.length < quantidade && i < quantidade * 2; i++) {
    const dia = new Date(base.getTime() + i * 86_400_000);
    if (business.expediente[dia.getUTCDay()] === null) continue;
    const valor = dia.toISOString().slice(0,10);
    const prefixo = i === 0 ? "hoje, " : i === 1 ? "amanhã, " : "";
    dias.push({ valor, rotulo: prefixo + rotuloDia(valor) });
  }
  return dias;
}

export function totaisDoPedido(itens: { servico: Servico }[]) {
  const fechados = itens.filter(({ servico }) => servico.preco !== null && !servico.aPartirDe);
  return {
    duracaoTotal: itens.reduce((soma, { servico }) => soma + servico.duracaoMin, 0),
    emAberto: itens.length - fechados.length,
    totalFechado: fechados.reduce((soma, { servico }) => soma + (servico.preco ?? 0), 0),
    temFechado: fechados.length > 0,
  };
}

export function formatarReais(valor: number) {
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
  if (a.dia) linhas.push(`*Dia de preferência:* ${rotuloDia(a.dia)}`);
  if (a.periodo) {
    linhas.push(`*Período:* ${periodos.find((p) => p.id === a.periodo)?.rotulo ?? a.periodo}`);
  }
  linhas.push(`*Nome:* ${a.nome}`);
  if (a.observacao?.trim()) linhas.push(`*Observação:* ${a.observacao.trim()}`);
  linhas.push("", a.dia ? "Pode confirmar o horário exato?" : "Qual dia e horário ficam bons pra você?", "", "Enviado pelo site.");
  return linhas.join("\n");
}

export function linkWhatsApp(texto: string) {
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(texto)}`;
}
