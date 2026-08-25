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
    <section id="servicos" className="scroll-mt-20 bg-creme py-20 sm:py-28">
      <div className="container-x">
        <header className="max-w-2xl">
          <p className="rotulo">Serviços e preços</p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-ink sm:text-5xl">
            Tudo o que você pode agendar
          </h2>
          <p className="mt-4 text-ink/60">
            Os valores abaixo são os praticados no espaço. O tempo é uma
            estimativa de reserva na agenda — pode variar conforme o seu cabelo,
            unha ou pele.
          </p>
        </header>

        <div className="mt-14 space-y-14">
          {categorias.map((categoria, i) => {
            const lista = servicosPorCategoria(categoria.id);
            if (lista.length === 0) return null;

            return (
              <Reveal key={categoria.id} delay={Math.min(i, 3) * 0.05}>
                <div className="grid gap-6 lg:grid-cols-[16rem_1fr] lg:gap-10">
                  <div>
                    <div className="filete" />
                    <h3 className="mt-4 font-display text-3xl text-ink">
                      {categoria.nome}
                    </h3>
                    <p className="mt-2 text-sm text-ink/50">
                      {categoria.resumo}
                    </p>
                  </div>

                  <ul className="grid gap-4 sm:grid-cols-2">
                    {lista.map((servico) => (
                      <li
                        key={servico.id}
                        className="flex flex-col overflow-hidden rounded-2xl border border-creme-300/70 bg-white/60 transition duration-200 ease-suave hover:border-terracota/40 hover:shadow-[0_12px_40px_-24px_rgba(23,16,13,0.5)]"
                      >
                        <div className="relative aspect-square w-full">
                          {servico.imagem ? (
                            <Image
                              src={servico.imagem}
                              alt={servico.nome}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              className="object-cover"
                            />
                          ) : (
                            <ArteCategoria categoria={servico.categoria} />
                          )}
                        </div>

                        <div className="flex flex-1 flex-col gap-3 p-6">
                          <div className="flex items-start justify-between gap-4">
                            <h4 className="font-medium text-ink">
                              {servico.nome}
                            </h4>
                            <p className="whitespace-nowrap font-display text-xl text-terracota">
                              {precoLabel(servico)}
                            </p>
                          </div>

                          {servico.descricao && (
                            <p className="text-sm leading-relaxed text-ink/60">
                              {servico.descricao}
                            </p>
                          )}

                          {(servico.inclui ?? servico.opcoes) && (
                            <ul className="flex flex-wrap gap-1.5">
                              {(servico.inclui ?? servico.opcoes)!.map(
                                (item) => (
                                  <li
                                    key={item}
                                    className="rounded-full bg-creme-200 px-2.5 py-1 text-xs text-ink/60"
                                  >
                                    {item}
                                  </li>
                                ),
                              )}
                            </ul>
                          )}

                          <div className="mt-auto flex items-center justify-between border-t border-creme-300/70 pt-4">
                            <span className="text-xs tracking-wider text-ink/40">
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
