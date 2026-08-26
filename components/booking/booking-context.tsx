"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { servicoPorId } from "@/lib/services";

export type Etapa = "servico" | "dados";

export const etapas: { id: Etapa; titulo: string }[] = [
  { id: "servico", titulo: "Serviços" },
  { id: "dados", titulo: "Seus dados" },
];

export type ItemSelecionado = { id: string; opcao?: string };

type BookingState = {
  etapa: Etapa;
  selecionados: ItemSelecionado[];
  nome: string;
  observacao: string;
};

const inicial: BookingState = {
  etapa: "servico",
  selecionados: [],
  nome: "",
  observacao: "",
};

type BookingContextValue = BookingState & {
  irPara: (etapa: Etapa) => void;
  toggleServico: (id: string) => void;
  adicionarServico: (id: string) => void;
  removerServico: (id: string) => void;
  escolherOpcao: (id: string, opcao: string) => void;
  continuar: () => void;
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

  const adicionarServico = useCallback((id: string) => {
    setState((s) => {
      if (s.selecionados.some((item) => item.id === id)) return s;
      const servico = servicoPorId(id);
      return {
        ...s,
        selecionados: [...s.selecionados, { id, opcao: servico?.opcoes?.[0] }],
      };
    });
  }, []);

  const removerServico = useCallback((id: string) => {
    setState((s) => ({ ...s, selecionados: s.selecionados.filter((item) => item.id !== id) }));
  }, []);

  const toggleServico = useCallback(
    (id: string) => {
      setState((s) =>
        s.selecionados.some((item) => item.id === id)
          ? { ...s, selecionados: s.selecionados.filter((item) => item.id !== id) }
          : s,
      );
      adicionarServico(id);
    },
    [adicionarServico],
  );

  const escolherOpcao = useCallback((id: string, opcao: string) => {
    setState((s) => ({
      ...s,
      selecionados: s.selecionados.map((item) => (item.id === id ? { ...item, opcao } : item)),
    }));
  }, []);

  const continuar = useCallback(() => {
    setState((s) => (s.selecionados.length > 0 ? { ...s, etapa: "dados" } : s));
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
      toggleServico,
      adicionarServico,
      removerServico,
      escolherOpcao,
      continuar,
      setNome,
      setObservacao,
      recomecar,
    }),
    [
      state,
      irPara,
      toggleServico,
      adicionarServico,
      removerServico,
      escolherOpcao,
      continuar,
      setNome,
      setObservacao,
      recomecar,
    ],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking precisa estar dentro de <BookingProvider>");
  return ctx;
}

/** Adiciona o serviço à seleção e leva a pessoa até o bloco de agendamento. */
export function useAgendarServico() {
  const { adicionarServico } = useBooking();
  return useCallback(
    (id: string) => {
      adicionarServico(id);
      const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document
        .getElementById("agendar")
        ?.scrollIntoView({ behavior: reduzido ? "auto" : "smooth", block: "start" });
    },
    [adicionarServico],
  );
}
