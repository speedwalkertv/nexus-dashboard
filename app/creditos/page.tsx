import type { Metadata } from "next";
import Link from "next/link";
import { creditosFotos } from "@/lib/fotos";
import { business } from "@/lib/business";

export const metadata: Metadata = {
  title: "Créditos das fotos",
  description: "Autoria e licença das fotos ilustrativas usadas no site.",
  robots: { index: false },
};

export default function Creditos() {
  return (
    <main className="bg-ink py-20 sm:py-28">
      <div className="container-x max-w-3xl">
        <Link href="/" className="text-sm text-dourado underline-offset-4 hover:underline">
          ← Voltar ao site
        </Link>

        <h1 className="mt-6 font-display text-4xl leading-tight text-creme sm:text-5xl">
          Créditos das fotos
        </h1>
        <p className="mt-4 text-creme/60">
          As fotos que ilustram os serviços vêm de bancos de imagem com licença livre. Elas foram
          cortadas e receberam ajuste de cor. <strong>Não são fotos do trabalho do espaço</strong> —
          servem de ilustração até entrarem as fotos reais de {business.profissional}.
        </p>

        <ul className="mt-10 divide-y divide-creme/10 border-y border-creme/10">
          {creditosFotos.map((credito) => (
            <li key={credito.arquivo} className="py-4 text-sm">
              <p className="font-medium text-creme">{credito.arquivo}</p>
              <p className="mt-1 text-creme/60">
                {credito.autor} ·{" "}
                <a
                  href={credito.licencaUrl}
                  target="_blank"
                  rel="noopener noreferrer license"
                  className="text-dourado underline underline-offset-4"
                >
                  {credito.licenca}
                </a>
                {credito.fonte && (
                  <>
                    {" · "}
                    <a
                      href={credito.fonte}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-dourado"
                    >
                      original
                    </a>
                  </>
                )}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
