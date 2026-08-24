/**
 * Dados do negócio.
 * Este é o único arquivo que precisa ser editado para colocar o site no ar
 * com as informações reais do espaço.
 */
export const business = {
  nome: "Geovana Santos",
  assinatura: "Espaço de Beleza",
  profissional: "Geovana Santos",

  // Formato internacional, só dígitos: 55 + DDD + número.
  whatsapp: "558888781086",
  whatsappExibicao: "(88) 8878-1086",

  instagram: "geovanasantosespacodebeleza",
  instagramUrl: "https://instagram.com/geovanasantosespacodebeleza",

  endereco: {
    linha1: "Rua José Cipriano, 235",
    linha2: "Centro — Quixeramobim, CE",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Rua+Jose+Cipriano+235+Centro+Quixeramobim+CE",
  },

  /**
   * Horário de funcionamento por dia da semana (0 = domingo).
   * `null` = fechado. Os horários disponíveis no agendamento são gerados a
   * partir daqui, em intervalos de `intervaloMinutos`.
   */
  expediente: {
    0: null,
    1: { abre: "09:00", fecha: "21:00" },
    2: { abre: "09:00", fecha: "21:00" },
    3: { abre: "09:00", fecha: "21:00" },
    4: { abre: "09:00", fecha: "21:00" },
    5: { abre: "09:00", fecha: "21:00" },
    6: { abre: "09:00", fecha: "21:00" },
  } as Record<number, { abre: string; fecha: string } | null>,

  intervaloMinutos: 30,

  /** Quantos dias para frente a agenda fica aberta. */
  janelaDias: 30,
} as const;

export const horarioResumo = [
  { dias: "Segunda a sábado", horas: "09h — 21h" },
  { dias: "Domingo", horas: "Fechado" },
];
