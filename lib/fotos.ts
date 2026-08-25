/**
 * Créditos das fotos que ainda são de banco de imagem.
 *
 * As demais são do trabalho do próprio espaço e não entram aqui. Quando esta
 * lista ficar vazia, o link no rodapé some sozinho e a página /creditos pode
 * ser apagada.
 */
export type CreditoFoto = {
  arquivo: string;
  autor: string;
  licenca: string;
  licencaUrl: string;
  fonte: string;
};

export const creditosFotos: CreditoFoto[] = [
  { arquivo: "spa-pes.jpg", autor: "autor não informado", licenca: "CC0 / domínio público", licencaUrl: "https://creativecommons.org/publicdomain/zero/1.0/", fonte: "https://www.rawpixel.com/image/5960380/free-public-domain-cc0-photo" },
];
