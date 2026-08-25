/**
 * Créditos das fotos ilustrativas dos serviços.
 *
 * São fotos de banco com licença livre, não são do trabalho do espaço.
 * Ao substituir por foto própria, apague a entrada correspondente aqui.
 */
export type CreditoFoto = {
  arquivo: string;
  autor: string;
  licenca: string;
  licencaUrl: string;
  fonte: string;
};

export const creditosFotos: CreditoFoto[] = [
  { arquivo: "cachos.jpg", autor: "Jonas Svidras", licenca: "CC0 / domínio público", licencaUrl: "https://creativecommons.org/publicdomain/zero/1.0/", fonte: "https://stocksnap.io/photo/girl-autumn-KVJUCEE9JY" },
  { arquivo: "cilios.jpg", autor: "eiashimine1015", licenca: "CC BY 2.0", licencaUrl: "https://creativecommons.org/licenses/by/2.0/", fonte: "https://www.flickr.com/photos/200463550@N07/53706016732" },
  { arquivo: "maquiagem.jpg", autor: "Matthew Henry", licenca: "CC0 / domínio público", licencaUrl: "https://creativecommons.org/publicdomain/zero/1.0/", fonte: "https://stocksnap.io/photo/face-makeup-TNAA2L3GTI" },
  { arquivo: "penteados.jpg", autor: "nparekhcards", licenca: "CC BY-SA 2.0", licencaUrl: "https://creativecommons.org/licenses/by-sa/2.0/", fonte: "https://www.flickr.com/photos/125349110@N05/23496850251" },
  { arquivo: "sobrancelhas.jpg", autor: "Luca Iaconelli", licenca: "CC0 / domínio público", licencaUrl: "https://creativecommons.org/publicdomain/zero/1.0/", fonte: "https://stocksnap.io/photo/people-girl-VCRXKU9GLE" },
  { arquivo: "spa-pes.jpg", autor: "autor não informado", licenca: "CC0 / domínio público", licencaUrl: "https://creativecommons.org/publicdomain/zero/1.0/", fonte: "https://www.rawpixel.com/image/5960380/free-public-domain-cc0-photo" },
  { arquivo: "trancas-fibras.jpg", autor: "mkorcuska", licenca: "CC BY-SA 2.0", licencaUrl: "https://creativecommons.org/licenses/by-sa/2.0/", fonte: "https://www.flickr.com/photos/53859752@N00/4382719811" },
  { arquivo: "trancas.jpg", autor: "Candace McDaniel", licenca: "CC0 / domínio público", licencaUrl: "https://creativecommons.org/publicdomain/zero/1.0/", fonte: "https://stocksnap.io/photo/braided-hair-Z0RZUNHVBR" },
  { arquivo: "unhas-gel.jpg", autor: "Freestocks.org", licenca: "CC0 / domínio público", licencaUrl: "https://creativecommons.org/publicdomain/zero/1.0/", fonte: "https://stocksnap.io/photo/people-hands-XX356Q6EI4" },
  { arquivo: "unhas-molde.jpg", autor: "Freestocks.org", licenca: "CC0 / domínio público", licencaUrl: "https://creativecommons.org/publicdomain/zero/1.0/", fonte: "https://stocksnap.io/photo/people-hands-5M4DNCN8ZW" },
  { arquivo: "unhas-simples.jpg", autor: "autor não informado", licenca: "CC0 / domínio público", licencaUrl: "https://creativecommons.org/publicdomain/zero/1.0/", fonte: "https://www.rawpixel.com/image/5913229/free-manicure-image-public-domain-cc0-photo" },
];

/** true quando alguma foto exige crédito visível (tudo que não é CC0/domínio público). */
export const exigeCredito = creditosFotos.some((c) => c.licenca.startsWith("CC BY"));
