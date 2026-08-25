import type { CategoriaId } from "@/lib/services";

/**
 * Arte de marca usada enquanto o serviço não tem foto real.
 * Traço dourado sobre fundo quente — decoração assumida, nunca uma promessa
 * de resultado. Assim que `imagem` for preenchida em lib/services.ts, a foto
 * entra no lugar.
 */
const desenhos: Record<CategoriaId, React.ReactNode> = {
  sobrancelhas: (
    <>
      <path d="M8 30c6-9 14-13 22-12 4 .5 8 2 10 4" />
      <path d="M12 25.5c5-5 12-7 18-6" opacity=".55" />
      <path d="M16 22v-4M22 19.5v-4.5M28 19v-4M34 20.5v-4" opacity=".8" />
    </>
  ),
  cilios: (
    <>
      <path d="M6 26c8-9 16-13 24-13s16 4 18 13c-8 6-13 8-19 8S13 31 6 26z" />
      <circle cx="26" cy="26" r="5" />
      <path d="M12 15l-3-5M20 11l-2-6M29 10l1-6M38 12l3-5" opacity=".8" />
    </>
  ),
  maquiagem: (
    <>
      <path d="M30 8l10 10-16 16-10-10z" opacity=".55" />
      <path d="M14 24l10 10-6 6c-3 3-8 3-11 0s-3-8 0-11z" />
      <path d="M9 39h.02" />
    </>
  ),
  unhas: (
    <>
      <path d="M18 14c0-4 3-6 6-6s6 2 6 6v14c0 4-3 7-6 7s-6-3-6-7z" />
      <path d="M18 22c4-2 8-2 12 0" opacity=".55" />
      <path d="M14 40c3-2 7-3 10-3s7 1 10 3" opacity=".8" />
    </>
  ),
  pes: (
    <>
      <path d="M17 40c-3-4-4-9-3-15 1-5 4-8 8-8s7 3 7 8c0 6-2 11-4 15z" />
      <circle cx="33" cy="16" r="2.5" opacity=".8" />
      <circle cx="37" cy="21" r="2.2" opacity=".8" />
      <circle cx="39" cy="27" r="2" opacity=".8" />
      <path d="M12 12c3 1 4 4 3 7" opacity=".55" />
    </>
  ),
  cabelo: (
    <>
      <path d="M12 10c6 6 6 14 2 20s-4 12 2 16" />
      <path d="M24 8c6 7 6 15 2 21s-4 11 2 15" opacity=".8" />
      <path d="M36 10c6 6 6 14 2 20s-4 12 2 16" opacity=".55" />
    </>
  ),
  penteados: (
    <>
      <circle cx="24" cy="14" r="7" />
      <path d="M11 42c1-9 6-14 13-14s12 5 13 14" />
      <path d="M31 9c4-2 8 0 8 4s-4 6-7 5" opacity=".7" />
    </>
  ),
  trancas: (
    <>
      <path d="M18 8c6 4 6 8 0 12s-6 8 0 12 6 8 0 12" />
      <path d="M30 8c-6 4-6 8 0 12s6 8 0 12-6 8 0 12" />
      <path d="M24 14v20" opacity=".45" />
    </>
  ),
};

export function ArteCategoria({ categoria }: { categoria: CategoriaId }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-ink via-ink-700 to-terracota-dark">
      <div
        aria-hidden
        className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-dourado/15 blur-2xl"
      />
      <svg
        viewBox="0 0 48 48"
        className="relative h-16 w-16 stroke-dourado-claro"
        fill="none"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {desenhos[categoria]}
      </svg>
    </div>
  );
}
