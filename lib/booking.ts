import { business } from "./business";
import { duracaoLabel, precoLabel, type Servico } from "./services";

/** Antecedência mínima para agendar no mesmo dia. */
const ANTECEDENCIA_MIN = 60;

export type Dia = {
  /** Chave local no formato AAAA-MM-DD. */
  iso: string;
  data: Date;
  aberto: boolean;
};

export function chaveDia(data: Date) {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

export function dataDeChave(iso: string) {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

function paraMinutos(hora: string) {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

function paraHora(minutos: number) {
  const h = String(Math.floor(minutos / 60)).padStart(2, "0");
  const m = String(minutos % 60).padStart(2, "0");
  return `${h}:${m}`;
}

export function proximosDias(hoje: Date): Dia[] {
  const dias: Dia[] = [];
  for (let i = 0; i < business.janelaDias; i++) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + i);
    dias.push({
      iso: chaveDia(data),
      data,
      aberto: business.expediente[data.getDay()] !== null,
    });
  }
  return dias;
}

/**
 * Horários livres de um dia. Um horário só aparece se o serviço couber
 * inteiro dentro do expediente.
 */
export function horariosDoDia(data: Date, duracaoMin: number, agora: Date): string[] {
  const expediente = business.expediente[data.getDay()];
  if (!expediente) return [];

  const abre = paraMinutos(expediente.abre);
  const fecha = paraMinutos(expediente.fecha);
  const ehHoje = chaveDia(data) === chaveDia(agora);
  const limiteHoje = agora.getHours() * 60 + agora.getMinutes() + ANTECEDENCIA_MIN;

  const horarios: string[] = [];
  for (let m = abre; m + duracaoMin <= fecha; m += business.intervaloMinutos) {
    if (ehHoje && m < limiteHoje) continue;
    horarios.push(paraHora(m));
  }
  return horarios;
}

export function diaSemanaCurto(data: Date) {
  return data.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
}

export function dataPorExtenso(data: Date) {
  return data.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

export type Agendamento = {
  servico: Servico;
  opcao?: string;
  data: Date;
  hora: string;
  nome: string;
  observacao?: string;
};

export function mensagemWhatsApp(a: Agendamento) {
  const linhas = [
    `Olá, ${business.nome}! Quero agendar um horário.`,
    "",
    `*Serviço:* ${a.servico.nome}${a.opcao ? ` (${a.opcao})` : ""}`,
    `*Valor:* ${precoLabel(a.servico)}`,
    `*Duração estimada:* ${duracaoLabel(a.servico.duracaoMin)}`,
    `*Data:* ${dataPorExtenso(a.data)}`,
    `*Horário:* ${a.hora}`,
    `*Nome:* ${a.nome}`,
  ];
  if (a.observacao?.trim()) linhas.push(`*Observação:* ${a.observacao.trim()}`);
  linhas.push("", "Enviado pelo site.");
  return linhas.join("\n");
}

export function linkWhatsApp(texto: string) {
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(texto)}`;
}
