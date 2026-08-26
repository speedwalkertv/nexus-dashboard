"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { servicoPorId } from "@/lib/services";

export type Etapa = "servico" | "dados";

export const etapas: { id: Etapa; titulo: string }[] = [
  { id: "servico", titulo: "Serviço" },
  { id: "dados", titulo: "Seus dados" },
];

type BookingState = {
  etapa: Etapa;
  servicoId: string | null;
  opcao: string | null;
  nome: string;
  observacao: string;
};

const inicial: BookingState = {
  etapa: "servico",
  servicoId: null,
  opcao: null,
  nome: "",
  observacao: "",
};

type BookingContextValue = BookingState & {
  irPara: (etapa: Etapa) => void;
  escolherServico: (id: string, opcao?: string) => void;
  escolherOpcao: (opcao: string) => void;
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

  const escolherServico = useCallback((id: string, opcao?: string) => {
    const servico = servicoPorId(id);
    setState((s) => ({
      ...s,
      servicoId: id,
      opcao: opcao ?? servico?.opcoes?.[0] ?? null,
      etapa: "dados",
    }));
  }, []);

  const escolherOpcao = useCallback((opcao: string) => {
    setState((s) => ({ ...s, opcao }));
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
      setNome,
      setObservacao,
      recomecar,
    }),
    [state, irPara, escolherServico, escolherOpcao, setNome, setObservacao, recomecar],
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
