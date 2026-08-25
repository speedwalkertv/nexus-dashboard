"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";
import { entrar } from "@/lib/admin-actions";
import { business } from "@/lib/business";

const campo =
  "w-full rounded-xl border border-creme/15 bg-white/[0.04] py-3 pl-11 pr-4 text-creme placeholder:text-creme/35 transition focus:border-dourado/60";

export default function LoginAdmin() {
  const [estado, acao, emAndamento] = useActionState(entrar, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-5 py-12 text-creme">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/logo-monograma.jpg"
            alt=""
            width={64}
            height={64}
            className="h-16 w-16 rounded-full object-cover"
            priority
          />
          <p className="mt-5 rotulo">{business.nome}</p>
          <h1 className="mt-2 font-display text-3xl">Painel administrativo</h1>
        </div>

        <form action={acao} className="mt-8 space-y-4">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-creme/40" />
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="seu@email.com"
              className={campo}
            />
          </div>

          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-creme/40" />
            <input
              type="password"
              name="senha"
              autoComplete="current-password"
              required
              placeholder="Senha"
              className={campo}
            />
          </div>

          {estado?.erro && (
            <p className="rounded-lg border border-terracota/40 bg-terracota/10 px-3 py-2 text-sm text-terracota-soft">
              {estado.erro}
            </p>
          )}

          <button
            type="submit"
            disabled={emAndamento}
            className="w-full rounded-full bg-terracota py-3 font-medium text-creme transition hover:bg-terracota-dark disabled:opacity-60"
          >
            {emAndamento ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <Link href="/" className="mt-8 block text-center text-sm text-creme/40 transition hover:text-dourado">
          ← Voltar ao site
        </Link>
      </div>
    </main>
  );
}
