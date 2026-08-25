export type CategoriaId =
  | "sobrancelhas"
  | "cilios"
  | "maquiagem"
  | "unhas"
  | "pes"
  | "cabelo"
  | "penteados"
  | "trancas";

export type Servico = {
  id: string;
  nome: string;
  categoria: CategoriaId;
  /** Valor em reais. `null` quando o preço é fechado no atendimento. */
  preco: number | null;
  /** Quando true, o valor é exibido como "a partir de". */
  aPartirDe?: boolean;
  /** Texto no lugar do valor, para serviços sem preço fixo. */
  precoTexto?: string;
  /** Estimativa de reserva na agenda — ajuste conforme sua rotina. */
  duracaoMin: number;
  descricao?: string;
  inclui?: string[];
  opcoes?: string[];
  /**
   * Foto do serviço, em /public/servicos. Ex.: "/servicos/cilios.jpg".
   * Sem foto, o card mostra a arte de marca da categoria.
   */
  imagem?: string;
};

export const categorias: { id: CategoriaId; nome: string; resumo: string }[] = [
  { id: "sobrancelhas", nome: "Sobrancelhas", resumo: "Design que respeita o seu traço natural" },
  { id: "cilios", nome: "Cílios", resumo: "Extensão em tufinho, do discreto ao volumoso" },
  { id: "maquiagem", nome: "Maquiagem", resumo: "Para festa, ensaio, formatura ou o dia a dia" },
  { id: "unhas", nome: "Unhas", resumo: "Alongamento com acabamento impecável" },
  { id: "pes", nome: "Pés", resumo: "Cuidado completo, do calo à esmaltação" },
  { id: "cabelo", nome: "Cabelo", resumo: "Lavagem, hidratação e cuidado com cachos" },
  { id: "penteados", nome: "Penteados", resumo: "Montado na hora, do preso ao solto" },
  { id: "trancas", nome: "Tranças", resumo: "Nagô e fibras orgânicas aplicadas com técnica" },
];

export const servicos: Servico[] = [
  {
    id: "sobrancelha-henna",
    nome: "Design de sobrancelhas com henna",
    categoria: "sobrancelhas",
    preco: 30,
    duracaoMin: 40,
    descricao: "Design personalizado com preenchimento em henna para marcar as falhas.",
    imagem: "/servicos/sobrancelha-henna.jpg",
  },
  {
    id: "sobrancelha-simples",
    nome: "Design de sobrancelhas sem henna",
    categoria: "sobrancelhas",
    preco: 20,
    duracaoMin: 30,
    descricao: "Correção do formato com medição de proporção do rosto.",
    imagem: "/servicos/sobrancelha-sem-henna.jpg",
  },
  {
    id: "cilios-extensao",
    nome: "Extensão de cílios",
    categoria: "cilios",
    preco: 30,
    aPartirDe: true,
    duracaoMin: 90,
    descricao: "Técnica escolhida na consulta, conforme o efeito que você quer.",
    opcoes: ["Tufinho", "Volume russo", "Fox", "Brasileiro"],
    imagem: "/servicos/cilios.jpg",
  },
  {
    id: "maquiagem",
    nome: "Maquiagem para qualquer ocasião",
    categoria: "maquiagem",
    preco: 65,
    duracaoMin: 60,
    descricao: "Pele preparada, olhos alinhados com a produção e fixação para o dia inteiro.",
    imagem: "/servicos/maquiagem.jpg",
  },
  {
    id: "unhas-gel-tips",
    nome: "Alongamento em gel na tips",
    categoria: "unhas",
    preco: 130,
    duracaoMin: 150,
    descricao: "Alongamento estruturado em gel com acabamento e esmaltação.",
    imagem: "/servicos/unhas-gel.jpg",
  },
  {
    id: "unhas-molde-f1",
    nome: "Alongamento molde F1",
    categoria: "unhas",
    preco: 100,
    duracaoMin: 120,
    descricao: "Construção no molde F1 com curvatura desenhada mão a mão.",
    imagem: "/servicos/unhas-molde.jpg",
  },
  {
    id: "unhas-banho-gel",
    nome: "Banho em gel na unha natural",
    categoria: "unhas",
    preco: 65,
    duracaoMin: 90,
    descricao: "Cobertura em gel sobre a unha natural, com brilho e resistência de alongamento.",
    imagem: "/servicos/unhas-banho-gel.jpg",
  },
  {
    id: "unhas-simples",
    nome: "Unhas naturais da mão",
    categoria: "unhas",
    preco: 20,
    duracaoMin: 60,
    descricao: "Cutilagem, lixamento e esmaltação na unha natural.",
    imagem: "/servicos/unhas-naturais.jpg",
  },
  {
    id: "spa-pes",
    nome: "Spa dos pés completo",
    categoria: "pes",
    preco: 45,
    duracaoMin: 60,
    descricao: "Cinco etapas em um único atendimento.",
    inclui: ["Hidratação", "Esfoliação", "Lixamento de calos", "Cutilagem", "Esmaltação"],
    imagem: "/servicos/spa-pes.jpg",
  },
  {
    id: "escova-hidratacao",
    nome: "Escova + lavagem + hidratação",
    categoria: "cabelo",
    preco: 70,
    duracaoMin: 90,
    descricao: "Lavagem, máscara de hidratação e finalização em escova.",
    imagem: "/servicos/escova.jpg",
  },
  {
    id: "cachos",
    nome: "Tratamento em cachos naturais",
    categoria: "cabelo",
    preco: 80,
    aPartirDe: true,
    duracaoMin: 120,
    descricao: "O valor varia conforme o comprimento e o volume do cabelo.",
    imagem: "/servicos/cachos.jpg",
  },
  {
    id: "penteados",
    nome: "Penteados",
    categoria: "penteados",
    preco: null,
    precoTexto: "Depende do modelo",
    duracaoMin: 60,
    descricao: "O valor é fechado no WhatsApp, conforme o modelo que você escolher.",
    imagem: "/servicos/penteados.jpg",
  },
  {
    id: "trancas-nago",
    nome: "Tranças nagô",
    categoria: "trancas",
    preco: null,
    precoTexto: "Depende do modelo",
    duracaoMin: 240,
    descricao: "Desenho combinado antes de começar. O valor é fechado no WhatsApp.",
    imagem: "/servicos/trancas-nago.jpg",
  },
  {
    id: "trancas-fibras",
    nome: "Aplicação de fibras orgânicas",
    categoria: "trancas",
    preco: 400,
    duracaoMin: 300,
    descricao: "Valor único para qualquer uma das técnicas.",
    opcoes: ["Twist Braids", "Crochet Braids", "Box Braids", "Ghana Braids"],
    imagem: "/servicos/fibras.jpg",
  },
];

export function servicoPorId(id: string) {
  return servicos.find((s) => s.id === id);
}

export function servicosPorCategoria(categoria: CategoriaId) {
  return servicos.filter((s) => s.categoria === categoria);
}

export function precoLabel(servico: Servico) {
  if (servico.precoTexto) return servico.precoTexto;
  if (servico.preco === null) return "Sob consulta";
  const valor = servico.preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  });
  return servico.aPartirDe ? `a partir de ${valor}` : valor;
}

export function duracaoLabel(minutos: number) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h === 0) return `${m}min`;
  return m === 0 ? `${h}h` : `${h}h${m}`;
}
