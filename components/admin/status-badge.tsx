import { cn } from "@/lib/cn";
import { rotuloStatus, type StatusAgendamento } from "@/lib/agendamentos-tipos";

const CORES: Record<StatusAgendamento, string> = {
  pendente: "bg-amber-100 text-amber-800",
  confirmado: "bg-sky-100 text-sky-800",
  concluido: "bg-emerald-100 text-emerald-800",
  cancelado: "bg-rose-100 text-rose-800",
  faltou: "bg-zinc-200 text-zinc-700",
};

export function StatusBadge({ status }: { status: StatusAgendamento }) {
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", CORES[status])}>
      {rotuloStatus[status]}
    </span>
  );
}
