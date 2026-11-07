import Image from "next/image";
import Link from "next/link";
import { Instagram } from "lucide-react";
import { business } from "@/lib/business";
import { creditosFotos } from "@/lib/fotos";

const links = [
  { href: "#servicos", rotulo: "Serviços" },
  { href: "#agendar", rotulo: "Agendar" },
  { href: "#sobre", rotulo: "Sobre" },
  { href: "#contato", rotulo: "Contato" },
];

export function SiteFooter() {
  return (
    <footer className="dark-section bg-ink py-14 text-creme">
      <div className="container-x">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/logo-monograma.jpg"
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <p className="font-display text-2xl">{business.nome}</p>
              <p className="text-[0.7rem] uppercase tracking-[0.2em] text-creme/70">
                {business.assinatura}
              </p>
            </div>
          </div>

          <nav>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-creme/60">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition hover:text-dourado">
                    {link.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex gap-3">
            <a
              href={business.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-creme/20 transition hover:border-dourado hover:text-dourado"
            >
              <Instagram className="h-5 w-5" aria-hidden />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-creme/10 pt-6 text-xs text-creme/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {business.nome} — {business.assinatura}. Todos os
            direitos reservados.
          </p>
          {creditosFotos.length > 0 && (
            <Link href="/creditos" className="transition hover:text-dourado">
              Créditos das fotos
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
