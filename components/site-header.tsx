"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { classesBotao } from "@/components/ui/botao";
import { business } from "@/lib/business";
import { cn } from "@/lib/cn";

const links = [
  { href: "#servicos", rotulo: "Serviços" },
  { href: "#como-funciona", rotulo: "Como funciona" },
  { href: "#sobre", rotulo: "Sobre" },
  { href: "#contato", rotulo: "Contato" },
];

export function SiteHeader() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 text-creme transition duration-300 ease-suave",
        rolou || aberto ? "border-b border-creme/10 bg-ink/95 backdrop-blur-md" : "",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4 sm:h-20">
        <a href="#topo" className="flex items-center gap-3" onClick={() => setAberto(false)}>
          <Image
            src="/logo-monograma.jpg"
            alt=""
            width={44}
            height={44}
            className="h-10 w-10 rounded-full object-cover sm:h-11 sm:w-11"
            priority
          />
          <span className="leading-tight">
            <span className="block font-display text-lg tracking-wide sm:text-xl">
              {business.nome}
            </span>
            <span className="block text-[0.6rem] uppercase tracking-[0.25em] text-creme/60">
              {business.assinatura}
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-creme/80 transition hover:text-dourado"
            >
              {link.rotulo}
            </a>
          ))}
          <a href="#agendar" className={classesBotao("primario", "md")}>
            Agendar horário
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="menu-mobile"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          className="md:hidden"
        >
          {aberto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {aberto && (
        <nav
          id="menu-mobile"
          className="container-x border-t border-creme/10 bg-ink/95 pb-6 pt-4 md:hidden"
        >
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setAberto(false)}
                  className="block py-2.5 text-creme/80"
                >
                  {link.rotulo}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#agendar"
            onClick={() => setAberto(false)}
            className={classesBotao("primario", "lg", "mt-4 w-full")}
          >
            Agendar horário
          </a>
        </nav>
      )}
    </header>
  );
}
