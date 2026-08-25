import { cn } from "@/lib/cn";
import { BLOCOS_HORA_ROTULO, DIAS_SEMANA_ROTULO } from "@/lib/agendamentos-consultas";

/** Intensidade da cor por quantidade de pedidos no bloco — 5 degraus fixos. */
function classeIntensidade(qtd: number, maximo: number) {
  if (qtd === 0) return "bg-creme-200";
  const proporcao = qtd / maximo;
  if (proporcao > 0.75) return "bg-terracota";
  if (proporcao > 0.5) return "bg-terracota/70";
  if (proporcao > 0.25) return "bg-terracota/45";
  return "bg-terracota/25";
}

export function MapaCalor({ dados }: { dados: number[][] }) {
  const maximo = Math.max(1, ...dados.flat());
  // Segunda a sábado primeiro (dias em que o espaço abre), domingo por último.
  const ordem = [1, 2, 3, 4, 5, 6, 0];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-separate border-spacing-1 text-center text-xs">
        <thead>
          <tr>
            <th />
            {BLOCOS_HORA_ROTULO.map((b) => (
              <th key={b} className="pb-1 font-normal text-ink/40">
                {b}h
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ordem.map((dia) => (
            <tr key={dia}>
              <td className="pr-2 text-right font-medium text-ink/50">{DIAS_SEMANA_ROTULO[dia]}</td>
              {dados[dia].map((qtd, bloco) => (
                <td key={bloco}>
                  <div
                    title={`${qtd} pedido${qtd === 1 ? "" : "s"}`}
                    className={cn(
                      "flex h-8 w-full min-w-8 items-center justify-center rounded-md font-medium tabular-nums",
                      classeIntensidade(qtd, maximo),
                      qtd / maximo > 0.5 ? "text-white" : "text-ink/60",
                    )}
                  >
                    {qtd > 0 ? qtd : ""}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
