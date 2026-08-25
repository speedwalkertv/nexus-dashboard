import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { sair } from "@/lib/admin-actions";
import { business } from "@/lib/business";

const links = [
  { href: "/admin", rotulo: "Painel" },
  { href: "/admin/agendamentos", rotulo: "Agendamentos" },
];

export default function LayoutPainel({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-creme-200">
      <header className="border-b border-creme-300 bg-creme">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/logo-monograma.jpg"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
            <span className="hidden font-display text-lg text-ink sm:inline">{business.nome}</span>
          </Link>

          <nav className="flex items-center gap-1 rounded-full border border-creme-300 bg-creme-200/60 p-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-1.5 text-sm text-ink/70 transition hover:bg-white hover:text-ink"
              >
                {link.rotulo}
              </Link>
            ))}
          </nav>

          <form action={sair}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-sm text-ink/50 transition hover:text-terracota"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </form>
        </div>
      </header>

      <main className="container-x py-8 sm:py-10">{children}</main>
    </div>
  );
}
