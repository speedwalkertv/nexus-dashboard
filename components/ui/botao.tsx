import { cn } from "@/lib/cn";

type Variante = "primario" | "secundario" | "fantasma";
type Tamanho = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-wide transition duration-200 ease-suave disabled:cursor-not-allowed disabled:opacity-40";

const variantes: Record<Variante, string> = {
  primario:
    "bg-terracota text-creme shadow-sm hover:bg-terracota-dark hover:shadow-md active:scale-[0.98]",
  secundario:
    "border border-creme/25 bg-transparent text-creme hover:border-dourado hover:bg-creme/5 active:scale-[0.98]",
  fantasma: "text-creme/70 hover:text-dourado",
};

const tamanhos: Record<Tamanho, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function classesBotao(variante: Variante = "primario", tamanho: Tamanho = "md", extra?: string) {
  return cn(base, variantes[variante], tamanhos[tamanho], extra);
}

type BotaoProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante;
  tamanho?: Tamanho;
};

export function Botao({ variante, tamanho, className, ...props }: BotaoProps) {
  return <button className={classesBotao(variante, tamanho, className)} {...props} />;
}

type LinkBotaoProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variante?: Variante;
  tamanho?: Tamanho;
};

export function LinkBotao({ variante, tamanho, className, ...props }: LinkBotaoProps) {
  return <a className={classesBotao(variante, tamanho, className)} {...props} />;
}
