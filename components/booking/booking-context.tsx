"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { servicoPorId } from "@/lib/services";

export type Etapa = "servico" | "data" | "horario" | "dados";

export const etapas: { id: Etapa; titulo: string }[] = [
  { id: "servico", titulo: "Serviço" },
  { id: "data", titulo: "Dia" },
  { id: "horario", titulo: "Horário" },
  { id: "dados", titulo: "Seus dados" },
];

type BookingState = {
  etapa: Etapa;
  servicoId: string | null;
  opcao: string | null;
  diaIso: string | null;
  hora: string | null;
  nome: string;
  observacao: string;
};

const inicial: BookingState = {
  etapa: "servico",
  servicoId: null,
  opcao: null,
  diaIso: null,
  hora: null,
  nome: "",
  observacao: "",
};

type BookingContextValue = BookingState & {
  irPara: (etapa: Etapa) => void;
  escolherServico: (id: string, opcao?: string) => void;
  escolherOpcao: (opcao: string) => void;
  escolherDia: (iso: string) => void;
  escolherHora: (hora: string) => void;
  setNome: (nome: string) => void;
  setObservacao: (texto: string) => void;
  recomecar: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BookingState>(inicial);

  const irPara = useCallback((etapa: Etapa) => {
    setState((s) => ({ ...s, etapa }));
  }, []);

  // Trocar de serviço invalida dia e horário: a duração muda os slots livres.
  const escolherServico = useCallback((id: string, opcao?: string) => {
    const servico = servicoPorId(id);
    setState((s) => ({
      ...s,
      servicoId: id,
      opcao: opcao ?? servico?.opcoes?.[0] ?? null,
      diaIso: null,
      hora: null,
      etapa: "data",
    }));
  }, []);

  const escolherOpcao = useCallback((opcao: string) => {
    setState((s) => ({ ...s, opcao }));
  }, []);

  const escolherDia = useCallback((iso: string) => {
    setState((s) => ({ ...s, diaIso: iso, hora: null, etapa: "horario" }));
  }, []);

  const escolherHora = useCallback((hora: string) => {
    setState((s) => ({ ...s, hora, etapa: "dados" }));
  }, []);

  const setNome = useCallback((nome: string) => setState((s) => ({ ...s, nome })), []);
  const setObservacao = useCallback(
    (observacao: string) => setState((s) => ({ ...s, observacao })),
    [],
  );
  const recomecar = useCallback(() => setState(inicial), []);

  const value = useMemo(
    () => ({
      ...state,
      irPara,
      escolherServico,
      escolherOpcao,
      escolherDia,
      escolherHora,
      setNome,
      setObservacao,
      recomecar,
    }),
    [state, irPara, escolherServico, escolherOpcao, escolherDia, escolherHora, setNome, setObservacao, recomecar],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking precisa estar dentro de <BookingProvider>");
  return ctx;
}

/** Seleciona o serviço e leva a pessoa até o bloco de agendamento. */
export function useAgendarServico() {
  const { escolherServico } = useBooking();
  return useCallback(
    (id: string, opcao?: string) => {
      escolherServico(id, opcao);
      const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document
        .getElementById("agendar")
        ?.scrollIntoView({ behavior: reduzido ? "auto" : "smooth", block: "start" });
    },
    [escolherServico],
  );
}
