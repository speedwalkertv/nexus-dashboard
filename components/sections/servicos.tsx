import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import {
  categorias,
  duracaoLabel,
  precoLabel,
  servicosPorCategoria,
} from "@/lib/services";
import { ArteCategoria } from "./arte-categoria";
import { BotaoAgendar } from "./botao-agendar";

export function Servicos() {
  return (
    <section id="servicos" className="scroll-mt-20 bg-ink py-20 sm:py-28">
      <div className="container-x">
        <header className="max-w-2xl">
          <h2 className="font-display text-4xl leading-tight text-creme sm:text-5xl">
            Tudo o que você pode agendar
          </h2>
          <p className="mt-4 text-creme/70">
            Os valores abaixo são os praticados no espaço. O tempo é uma
            estimativa de reserva na agenda — pode variar conforme o seu cabelo,
            unha ou pele.
          </p>
        </header>

        <div className="mt-12 space-y-12 sm:mt-14 sm:space-y-14">
          {categorias.map((categoria, i) => {
            const lista = servicosPorCategoria(categoria.id);
            if (lista.length === 0) return null;

            return (
              <Reveal key={categoria.id} delay={Math.min(i, 3) * 0.05}>
                <div className="grid gap-6 lg:grid-cols-[16rem_1fr] lg:gap-10">
                  <div>
                    <div className="filete" />
                    <h3 className="mt-4 font-display text-3xl text-creme">
                      {categoria.nome}
                    </h3>
                    <p className="mt-2 text-sm text-creme/70">
                      {categoria.resumo}
                    </p>
                  </div>

                  <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    {lista.map((servico) => (
                      <li
                        key={servico.id}
                        className="flex overflow-hidden rounded-2xl border border-creme/10 bg-white/[0.03] transition duration-200 ease-suave hover:border-terracota/50 sm:flex-col"
                      >
                        <div className="relative w-24 shrink-0 self-stretch sm:aspect-square sm:w-full sm:self-auto">
                          {servico.imagem ? (
                            <Image
                              src={servico.imagem}
                              alt={servico.nome}
                              fill
                              sizes="(max-width: 640px) 96px, (max-width: 1024px) 50vw, 25vw"
                              className="object-cover"
                            />
                          ) : (
                            <ArteCategoria categoria={servico.categoria} />
                          )}
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-4 sm:gap-3 sm:p-6">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                            <h4 className="font-medium leading-snug text-creme">
                              {servico.nome}
                            </h4>
                            <p className="whitespace-nowrap font-display text-xl text-dourado-claro">
                              {precoLabel(servico)}
                            </p>
                          </div>

                          {servico.descricao && (
                            <p className="text-sm leading-relaxed text-creme/70">
                              {servico.descricao}
                            </p>
                          )}

                          {(servico.inclui ?? servico.opcoes) && (
                            <ul className="flex flex-wrap gap-1.5">
                              {(servico.inclui ?? servico.opcoes)!.map(
                                (item) => (
                                  <li
                                    key={item}
                                    className="rounded-full bg-creme/10 px-2.5 py-1 text-xs text-creme/75"
                                  >
                                    {item}
                                  </li>
                                ),
                              )}
                            </ul>
                          )}

                          <div className="mt-auto flex items-center justify-between border-t border-creme/10 pt-4">
                            <span className="text-sm text-creme/70">
                              ≈ {duracaoLabel(servico.duracaoMin)}
                            </span>
                            <BotaoAgendar
                              servicoId={servico.id}
                              nomeServico={servico.nome}
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
