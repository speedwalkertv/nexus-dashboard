/**
 * Gera uma versão do site em UM arquivo HTML, com as fotos embutidas.
 * Serve para publicar um link de visualização sem servidor.
 *
 * Uso: node --experimental-strip-types scripts/preview.mjs [saida.html]
 *
 * Os dados vêm de lib/business.ts e lib/services.ts — os mesmos que o site
 * usa — então preço, serviço e expediente nunca divergem. A regra de horários
 * é reescrita aqui em JS de navegador; se mudar lib/booking.ts, atualize
 * `regrasDeAgenda` abaixo.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { business, horarioResumo } from "../lib/business.ts";
import { categorias, servicos, duracaoLabel, precoLabel } from "../lib/services.ts";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const saida = resolve(process.argv[2] ?? `${raiz}/preview/index.html`);

const foto = (arquivo) =>
  `data:image/jpeg;base64,${readFileSync(`${raiz}/public/${arquivo}`).toString("base64")}`;

const escapar = (texto) =>
  String(texto).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const dados = {
  business: { ...business, expediente: business.expediente },
  servicos: servicos.map((s) => ({ ...s, precoLabel: precoLabel(s), duracaoLabel: duracaoLabel(s.duracaoMin) })),
};

const cardsPorCategoria = categorias
  .map((categoria) => {
    const lista = dados.servicos.filter((s) => s.categoria === categoria.id);
    if (lista.length === 0) return "";

    const cards = lista
      .map((servico) => {
        const etiquetas = servico.inclui ?? servico.opcoes;
        return `
          <li class="card">
            <div class="card-topo">
              <h4>${escapar(servico.nome)}</h4>
              <p class="preco">${escapar(servico.precoLabel)}</p>
            </div>
            ${servico.descricao ? `<p class="card-desc">${escapar(servico.descricao)}</p>` : ""}
            ${
              etiquetas
                ? `<ul class="etiquetas">${etiquetas
                    .map((item) => `<li>${escapar(item)}</li>`)
                    .join("")}</ul>`
                : ""
            }
            <div class="card-rodape">
              <span class="duracao">&asymp; ${escapar(servico.duracaoLabel)}</span>
              <button type="button" class="link-agendar" data-servico="${servico.id}">
                Agendar <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </li>`;
      })
      .join("");

    return `
      <div class="categoria">
        <div class="categoria-titulo">
          <span class="filete"></span>
          <h3>${escapar(categoria.nome)}</h3>
          <p>${escapar(categoria.resumo)}</p>
        </div>
        <ul class="cards">${cards}</ul>
      </div>`;
  })
  .join("");

const duvidas = [
  [
    "O horário que eu escolho já fica garantido?",
    "O site envia o seu pedido com dia, horário e serviço prontos. A reserva é confirmada na resposta do WhatsApp — normalmente em poucos minutos, dentro do horário de funcionamento.",
  ],
  [
    "Posso remarcar ou cancelar?",
    "Pode. Avise pelo WhatsApp com a maior antecedência possível: assim o horário fica livre para outra pessoa e eu consigo encaixar você em outro dia.",
  ],
  [
    "Por que alguns horários não aparecem?",
    "A agenda só mostra horários em que o serviço cabe inteiro antes do fechamento. Serviços mais longos, como tranças, aparecem em menos horários por causa disso.",
  ],
  [
    "O preço pode mudar?",
    "Os valores da tabela são fixos. Em cachos e serviços com 'a partir de', o valor final depende do comprimento e do volume do cabelo — isso é combinado antes de começar.",
  ],
  [
    "É a primeira vez que vou. Preciso levar algo?",
    "Só as referências que você gostou, se tiver. Se houver alergia ou algum cuidado especial, escreva no campo de observação do agendamento.",
  ],
];

const passos = [
  ["Escolha o serviço", "Com o valor e a duração na tela, sem precisar perguntar antes."],
  ["Escolha dia e horário", "A agenda mostra só os horários em que o serviço cabe inteiro."],
  ["Confirme no WhatsApp", "O pedido sai pronto na conversa. A confirmação vem por lá."],
];

/** Mesma regra de lib/booking.ts, em JS de navegador. */
const regrasDeAgenda = String.raw`
  const ANTECEDENCIA_MIN = 60;
  const INTERVALO = DADOS.business.intervaloMinutos;

  const chaveDia = (d) =>
    d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const paraMinutos = (h) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3, 5));
  const paraHora = (m) =>
    String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");

  function horariosDoDia(data, duracaoMin, agora) {
    const exp = DADOS.business.expediente[data.getDay()];
    if (!exp) return [];
    const abre = paraMinutos(exp.abre);
    const fecha = paraMinutos(exp.fecha);
    const ehHoje = chaveDia(data) === chaveDia(agora);
    const limite = agora.getHours() * 60 + agora.getMinutes() + ANTECEDENCIA_MIN;
    const lista = [];
    for (let m = abre; m + duracaoMin <= fecha; m += INTERVALO) {
      if (ehHoje && m < limite) continue;
      lista.push(paraHora(m));
    }
    return lista;
  }

  function diasDisponiveis(duracaoMin, agora) {
    const dias = [];
    for (let i = 0; i < DADOS.business.janelaDias; i++) {
      const data = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + i);
      if (horariosDoDia(data, duracaoMin, agora).length > 0) dias.push(data);
    }
    return dias;
  }
`;

const html = `<title>Geovana Santos Espaço de Beleza</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500&display=swap">

<style>
:root {
  --ink: #17100D;
  --ink-800: #241812;
  --creme: #FBF5EF;
  --creme-200: #F4EAE0;
  --creme-300: #E5D3C2;
  --terracota: #C85A2E;
  --terracota-dark: #A44420;
  --dourado: #C79445;
  --dourado-claro: #E8C889;
  --display: "Cormorant Garamond", Georgia, serif;
  --sans: "Jost", system-ui, sans-serif;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--creme);
  color: var(--ink);
  font-family: var(--sans);
  font-weight: 300;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 { font-family: var(--display); font-weight: 500; text-wrap: balance; margin: 0; }
p { margin: 0; }
ul, ol { margin: 0; padding: 0; list-style: none; }

a, button { font-family: inherit; }
:focus-visible { outline: 2px solid var(--terracota); outline-offset: 3px; }
.escuro :focus-visible { outline-color: var(--dourado); }

.container { width: 100%; max-width: 72rem; margin: 0 auto; padding: 0 1.25rem; }
@media (min-width: 640px) { .container { padding: 0 2rem; } }

.rotulo {
  font-size: .72rem; font-weight: 500; letter-spacing: .2em;
  text-transform: uppercase; color: var(--terracota); margin: 0;
}
.escuro .rotulo { color: var(--dourado); }

.filete { display: block; width: 3rem; height: 1px; background: linear-gradient(90deg, var(--dourado), transparent); }

.botao {
  display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
  border: 0; border-radius: 999px; cursor: pointer; white-space: nowrap;
  font-size: 1rem; font-weight: 500; letter-spacing: .02em;
  padding: .9rem 1.75rem; text-decoration: none;
  background: var(--terracota); color: var(--creme);
  transition: background .2s cubic-bezier(.4,0,.2,1), transform .2s;
}
.botao:hover { background: var(--terracota-dark); }
.botao:active { transform: scale(.98); }
.botao[disabled] { opacity: .4; cursor: not-allowed; }
.botao.contorno {
  background: transparent; color: var(--creme);
  border: 1px solid rgba(251,245,239,.25);
}
.botao.contorno:hover { border-color: var(--dourado); background: rgba(251,245,239,.06); }
.botao.contorno-escuro { background: transparent; color: var(--ink); border: 1px solid rgba(23,16,13,.2); }
.botao.contorno-escuro:hover { background: rgba(23,16,13,.05); }

/* Cabeçalho */
.topo {
  position: sticky; top: 0; z-index: 50;
  background: rgba(251,245,239,.95); backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(23,16,13,.1);
}
.topo .container { display: flex; align-items: center; justify-content: space-between; height: 4.5rem; gap: 1rem; }
.marca { display: flex; align-items: center; gap: .75rem; text-decoration: none; color: inherit; }
.marca img { width: 2.75rem; height: 2.75rem; border-radius: 999px; object-fit: cover; object-position: center 53%; }
.marca strong { display: block; font-family: var(--display); font-size: 1.25rem; font-weight: 500; letter-spacing: .02em; }
.marca .assinatura { display: block; font-size: .6rem; letter-spacing: .25em; text-transform: uppercase; color: rgba(23,16,13,.5); }
.nav { display: none; align-items: center; gap: 2rem; }
.nav a { color: rgba(23,16,13,.7); text-decoration: none; font-size: .95rem; }
.nav a:hover { color: var(--terracota); }
@media (min-width: 880px) { .nav { display: flex; } }

/* Hero */
.hero { position: relative; background: var(--ink); color: var(--creme); overflow: hidden; }
.hero::before {
  content: ""; position: absolute; left: -12rem; top: -6rem; width: 34rem; height: 34rem;
  background: rgba(200,90,46,.22); filter: blur(120px); border-radius: 999px; pointer-events: none;
}
.hero .container { position: relative; display: grid; gap: 3rem; padding-top: 4.5rem; padding-bottom: 5rem; }
@media (min-width: 1024px) { .hero .container { grid-template-columns: 1fr 1fr; align-items: center; gap: 4rem; padding-top: 6rem; padding-bottom: 7rem; } }
.hero h1 { font-size: clamp(3rem, 8vw, 4.5rem); line-height: 1.03; margin-top: 1.25rem; }
.hero h1 em { display: block; font-style: normal; color: var(--dourado-claro); }
.hero-sub { margin-top: 1.5rem; font-size: 1.125rem; color: rgba(251,245,239,.7); max-width: 34ch; }
.hero-ctas { display: flex; flex-direction: column; gap: .75rem; margin-top: 2.25rem; }
@media (min-width: 480px) { .hero-ctas { flex-direction: row; } }
.garantias { display: flex; flex-direction: column; gap: .75rem; margin-top: 2.5rem; font-size: .9rem; color: rgba(251,245,239,.6); }
@media (min-width: 640px) { .garantias { flex-direction: row; flex-wrap: wrap; gap: 1.5rem; } }
.garantias li::before { content: "—"; color: var(--dourado); margin-right: .5rem; }
.retrato { position: relative; aspect-ratio: 4/5; border-radius: 2rem; overflow: hidden; background: #000; box-shadow: inset 0 0 0 1px rgba(199,148,69,.25); }
.retrato img { width: 100%; height: 100%; object-fit: cover; object-position: center 25%; display: block; }
.retrato figcaption {
  position: absolute; left: 1.5rem; bottom: 1.25rem;
  font-family: var(--display); font-size: 1.5rem; color: var(--creme);
  text-shadow: 0 2px 12px rgba(0,0,0,.6);
}

/* Seções */
section { padding: 4.5rem 0; }
@media (min-width: 768px) { section { padding: 6.5rem 0; } }
.claro { background: var(--creme); }
.suave { background: var(--creme-200); }
.escuro { background: var(--ink); color: var(--creme); }
.cabecalho-secao { max-width: 40rem; }
.cabecalho-secao h2 { font-size: clamp(2.25rem, 5vw, 3rem); line-height: 1.1; margin-top: 1rem; }
.cabecalho-secao p { margin-top: 1rem; color: rgba(23,16,13,.6); }
.escuro .cabecalho-secao p { color: rgba(251,245,239,.6); }

/* Serviços */
.categorias { display: grid; gap: 3.5rem; margin-top: 3.5rem; }
.categoria { display: grid; gap: 1.5rem; }
@media (min-width: 1024px) { .categoria { grid-template-columns: 16rem 1fr; gap: 2.5rem; } }
.categoria-titulo h3 { font-size: 1.85rem; margin-top: 1rem; }
.categoria-titulo p { margin-top: .5rem; font-size: .9rem; color: rgba(23,16,13,.5); }
.cards { display: grid; gap: 1rem; }
@media (min-width: 640px) { .cards { grid-template-columns: 1fr 1fr; } }
.card {
  display: flex; flex-direction: column; padding: 1.5rem;
  border: 1px solid rgba(229,211,194,.7); border-radius: 1rem; background: rgba(255,255,255,.6);
  transition: border-color .2s, box-shadow .2s;
}
.card:hover { border-color: rgba(200,90,46,.4); box-shadow: 0 12px 40px -24px rgba(23,16,13,.5); }
.card-topo { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
.card-topo h4 { font-family: var(--sans); font-size: 1rem; font-weight: 500; }
.preco { font-family: var(--display); font-size: 1.3rem; color: var(--terracota); white-space: nowrap; }
.card-desc { margin-top: .5rem; font-size: .9rem; color: rgba(23,16,13,.6); }
.etiquetas { display: flex; flex-wrap: wrap; gap: .375rem; margin-top: 1rem; }
.etiquetas li { background: var(--creme-200); border-radius: 999px; padding: .25rem .625rem; font-size: .75rem; color: rgba(23,16,13,.6); }
.card-rodape {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: auto; padding-top: 1rem; border-top: 1px solid rgba(229,211,194,.7);
}
.card-rodape .duracao { font-size: .75rem; letter-spacing: .05em; color: rgba(23,16,13,.4); }
.link-agendar {
  background: none; border: 0; cursor: pointer; padding: 0;
  font-size: .9rem; font-weight: 500; color: var(--terracota);
}
.link-agendar:hover { color: var(--terracota-dark); }
.card-rodape .duracao, .link-agendar { margin-top: 1rem; }
.card-rodape { align-items: flex-end; }

/* Passos */
.passos { display: grid; gap: 1.5rem; margin-top: 3rem; }
@media (min-width: 768px) { .passos { grid-template-columns: repeat(3, 1fr); } }
.passos li { border: 1px solid var(--creme-300); border-radius: 1rem; background: var(--creme); padding: 1.75rem; }
.passos .numero { font-family: var(--display); font-size: 3rem; color: rgba(200,90,46,.3); line-height: 1; }
.passos h3 { font-family: var(--sans); font-size: 1rem; font-weight: 500; margin-top: 1rem; }
.passos p { margin-top: .5rem; font-size: .9rem; color: rgba(23,16,13,.6); }

/* Agendamento */
.etapas { display: flex; flex-wrap: wrap; gap: .5rem 1.5rem; margin-top: 2.5rem; }
.etapas button {
  display: flex; align-items: center; gap: .5rem; background: none; border: 0; padding: 0;
  font-size: .9rem; color: rgba(251,245,239,.25); cursor: not-allowed;
}
.etapas button.feita { color: rgba(251,245,239,.6); cursor: pointer; }
.etapas button.ativa { color: var(--creme); }
.etapas .bolha {
  display: grid; place-items: center; width: 1.5rem; height: 1.5rem; border-radius: 999px;
  border: 1px solid rgba(251,245,239,.2); font-size: .75rem; font-variant-numeric: tabular-nums;
}
.etapas .feita .bolha { border-color: rgba(199,148,69,.5); color: var(--dourado); }
.etapas .ativa .bolha { border-color: var(--dourado); background: var(--dourado); color: var(--ink); }

.agenda { display: grid; gap: 2rem; margin-top: 2.5rem; }
@media (min-width: 1024px) { .agenda { grid-template-columns: 1fr 20rem; gap: 3rem; align-items: start; } }

.voltar { background: none; border: 0; padding: 0; cursor: pointer; color: rgba(251,245,239,.5); font-size: .9rem; margin-bottom: 1.25rem; }
.voltar:hover { color: var(--dourado); }

.grupo + .grupo { margin-top: 1.5rem; }
.grupo-titulo { font-size: .72rem; letter-spacing: .2em; text-transform: uppercase; color: var(--dourado); margin-bottom: .75rem; }

.opcoes-servico { display: grid; gap: .5rem; }
@media (min-width: 640px) { .opcoes-servico { grid-template-columns: 1fr 1fr; } }
.opcao {
  display: flex; justify-content: space-between; align-items: flex-start; gap: .75rem; text-align: left;
  padding: 1rem; border-radius: 1rem; cursor: pointer;
  border: 1px solid rgba(251,245,239,.15); background: rgba(255,255,255,.03); color: var(--creme);
  transition: border-color .2s, background .2s;
}
.opcao:hover { border-color: rgba(199,148,69,.5); background: rgba(255,255,255,.06); }
.opcao[aria-pressed="true"] { border-color: var(--dourado); background: rgba(199,148,69,.12); }
.opcao .nome { display: block; font-size: .95rem; }
.opcao .meta { display: block; margin-top: .25rem; font-size: .85rem; color: rgba(251,245,239,.5); }

.grade { display: grid; grid-template-columns: repeat(3, 1fr); gap: .5rem; }
@media (min-width: 640px) { .grade { grid-template-columns: repeat(4, 1fr); } }
@media (min-width: 1024px) { .grade { grid-template-columns: repeat(5, 1fr); } }
.grade.horas { grid-template-columns: repeat(3, 1fr); }
@media (min-width: 640px) { .grade.horas { grid-template-columns: repeat(6, 1fr); } }
.pilula {
  padding: .75rem .25rem; border-radius: .75rem; cursor: pointer; text-align: center;
  border: 1px solid rgba(251,245,239,.15); background: rgba(255,255,255,.03); color: var(--creme);
  font-variant-numeric: tabular-nums; font-size: .9rem;
  transition: border-color .2s, background .2s;
}
.pilula:hover { border-color: rgba(199,148,69,.5); background: rgba(255,255,255,.06); }
.pilula[aria-pressed="true"] { border-color: var(--dourado); background: rgba(199,148,69,.15); }
.pilula .semana { display: block; font-size: .7rem; letter-spacing: .05em; text-transform: uppercase; color: rgba(251,245,239,.5); }
.pilula .numero { display: block; font-family: var(--display); font-size: 1.5rem; line-height: 1.1; }

.campo { display: block; margin-bottom: 1.25rem; }
.campo span { display: block; margin-bottom: .5rem; font-size: .9rem; color: rgba(251,245,239,.7); }
.campo input, .campo textarea {
  width: 100%; padding: .875rem 1rem; border-radius: .75rem; font: inherit; color: var(--creme);
  border: 1px solid rgba(251,245,239,.15); background: rgba(255,255,255,.03); resize: none;
}
.campo input::placeholder, .campo textarea::placeholder { color: rgba(251,245,239,.35); }
.campo input:focus, .campo textarea:focus { border-color: rgba(199,148,69,.6); outline: none; }
.aviso { margin-top: 1rem; text-align: center; font-size: .9rem; color: rgba(251,245,239,.5); }

.resumo { border: 1px solid rgba(251,245,239,.15); border-radius: 1.5rem; background: rgba(255,255,255,.04); padding: 1.5rem; }
@media (min-width: 1024px) { .resumo { position: sticky; top: 6rem; } }
.resumo-topo { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; }
.resumo h3 { font-size: 1.5rem; }
.resumo .recomecar { background: none; border: 0; cursor: pointer; color: rgba(251,245,239,.5); font-size: .75rem; }
.resumo .recomecar:hover { color: var(--dourado); }
.resumo dl { margin: 1.25rem 0 0; display: grid; gap: .75rem; }
.resumo dt { font-size: .7rem; letter-spacing: .15em; text-transform: uppercase; color: rgba(251,245,239,.4); }
.resumo dd { margin: .25rem 0 0; padding-bottom: .75rem; border-bottom: 1px solid rgba(251,245,239,.1); }
.resumo dd button { background: none; border: 0; padding: 0; cursor: pointer; color: var(--creme); font: inherit; text-align: left; }
.resumo dd button:hover { color: var(--dourado); text-decoration: underline; }
.resumo dd.vazio { color: rgba(251,245,239,.3); }
.tecnicas { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: .5rem; }
.tecnica {
  border-radius: 999px; padding: .375rem .75rem; font-size: .85rem; cursor: pointer;
  border: 1px solid rgba(251,245,239,.15); background: none; color: rgba(251,245,239,.6);
}
.tecnica[aria-pressed="true"] { border-color: var(--dourado); background: rgba(199,148,69,.15); color: var(--creme); }
.resumo-valor { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid rgba(251,245,239,.1); }
.resumo-valor .valor { font-family: var(--display); font-size: 1.85rem; color: var(--dourado-claro); margin-top: .25rem; }
.resumo-valor .duracao { font-size: .9rem; color: rgba(251,245,239,.5); }

/* Sobre */
.sobre { display: grid; gap: 2.5rem; align-items: center; }
@media (min-width: 1024px) { .sobre { grid-template-columns: 1fr 1fr; gap: 4rem; } }
.sobre .moldura { aspect-ratio: 4/3; border-radius: 2rem; overflow: hidden; background: #000; }
.sobre .moldura img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; display: block; }
.sobre-texto { display: grid; gap: 1rem; margin-top: 1.5rem; color: rgba(23,16,13,.7); }

/* Dúvidas */
.duvidas { border-top: 1px solid var(--creme-300); }
.duvidas details { border-bottom: 1px solid var(--creme-300); padding: 1.25rem 0; }
.duvidas summary { display: flex; justify-content: space-between; align-items: center; gap: 1.5rem; cursor: pointer; list-style: none; font-weight: 400; }
.duvidas summary::-webkit-details-marker { display: none; }
.duvidas summary::after { content: "+"; color: var(--terracota); font-size: 1.25rem; transition: transform .2s; }
.duvidas details[open] summary::after { transform: rotate(45deg); }
.duvidas p { margin-top: .75rem; max-width: 60ch; font-size: .9rem; color: rgba(23,16,13,.6); }
.duvidas-grid { display: grid; gap: 2.5rem; }
@media (min-width: 1024px) { .duvidas-grid { grid-template-columns: 20rem 1fr; gap: 4rem; } }

/* Contato */
.contato-grid { display: grid; gap: 3rem; }
@media (min-width: 1024px) { .contato-grid { grid-template-columns: 1fr 1fr; gap: 4rem; } }
.endereco { margin-top: 2rem; color: rgba(23,16,13,.7); }
.endereco a { color: var(--terracota); }
.contato-ctas { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 2rem; }
.horarios { border: 1px solid var(--creme-300); border-radius: 1.5rem; background: rgba(244,234,224,.6); padding: 2rem; }
.horarios h3 { font-size: 1.5rem; }
.horarios dl { display: grid; gap: .75rem; margin: 1.5rem 0 0; }
.horarios .linha { display: flex; justify-content: space-between; gap: 1rem; padding-bottom: .75rem; border-bottom: 1px solid var(--creme-300); }
.horarios .linha:last-child { border-bottom: 0; padding-bottom: 0; }
.horarios dt { color: rgba(23,16,13,.7); }
.horarios dd { margin: 0; font-variant-numeric: tabular-nums; }
.horarios .nota { margin-top: 1.5rem; font-size: .9rem; color: rgba(23,16,13,.5); }

/* Rodapé */
footer { background: var(--ink); color: var(--creme); padding: 3.5rem 0; }
.rodape { display: flex; flex-direction: column; gap: 2rem; }
@media (min-width: 768px) { .rodape { flex-direction: row; align-items: center; justify-content: space-between; } }
.rodape .marca .assinatura { color: rgba(251,245,239,.5); }
.rodape nav ul { display: flex; flex-wrap: wrap; gap: .5rem 1.5rem; }
.rodape nav a { color: rgba(251,245,239,.6); text-decoration: none; font-size: .9rem; }
.rodape nav a:hover { color: var(--dourado); }
.creditos { margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(251,245,239,.1); font-size: .75rem; color: rgba(251,245,239,.4); }

.flutuante {
  position: fixed; right: 1.25rem; bottom: 1.25rem; z-index: 40;
  display: grid; place-items: center; width: 3.5rem; height: 3.5rem; border-radius: 999px;
  background: var(--terracota); color: var(--creme); text-decoration: none;
  box-shadow: 0 10px 30px -10px rgba(23,16,13,.6);
}
@media (min-width: 880px) { .flutuante { display: none; } }

.esqueleto { height: 4rem; border-radius: .75rem; background: rgba(255,255,255,.04); }

@media (prefers-reduced-motion: reduce) {
  * { transition-duration: .01ms !important; animation-duration: .01ms !important; }
  html { scroll-behavior: auto; }
}
html { scroll-behavior: smooth; }
</style>

<header class="topo">
  <div class="container">
    <a class="marca" href="#topo">
      <img src="${foto("logo.jpg")}" alt="">
      <span class="texto-marca">
        <strong>${escapar(business.nome)}</strong>
        <span class="assinatura">${escapar(business.assinatura)}</span>
      </span>
    </a>
    <nav class="nav">
      <a href="#servicos">Serviços</a>
      <a href="#como-funciona">Como funciona</a>
      <a href="#sobre">Sobre</a>
      <a href="#contato">Contato</a>
      <a class="botao" href="#agendar">Agendar horário</a>
    </nav>
  </div>
</header>

<main id="topo">
  <section class="hero escuro">
    <div class="container">
      <div>
        <p class="rotulo">${escapar(business.assinatura)}</p>
        <h1>Sua beleza <em>com hora marcada.</em></h1>
        <p class="hero-sub">
          Sobrancelhas, cílios, unhas, maquiagem, cabelo e tranças no mesmo lugar.
          Escolha o serviço e o horário aqui — leva menos de um minuto.
        </p>
        <div class="hero-ctas">
          <a class="botao" href="#agendar">Agendar horário</a>
          <a class="botao contorno" href="#servicos">Ver serviços e preços</a>
        </div>
        <ul class="garantias">
          <li>Atendimento com hora marcada</li>
          <li>Preços na mesa, sem surpresa</li>
          <li>Confirmação no WhatsApp</li>
        </ul>
      </div>
      <figure class="retrato" style="margin:0">
        <img src="${foto("geovana-hero.jpg")}" alt="${escapar(business.profissional)}, profissional responsável pelo espaço">
        <figcaption>${escapar(business.profissional)}</figcaption>
      </figure>
    </div>
  </section>

  <section id="servicos" class="claro">
    <div class="container">
      <div class="cabecalho-secao">
        <p class="rotulo">Serviços e preços</p>
        <h2>Tudo o que você pode agendar</h2>
        <p>
          Os valores abaixo são os praticados no espaço. O tempo é uma estimativa de reserva na
          agenda — pode variar conforme o seu cabelo, unha ou pele.
        </p>
      </div>
      <div class="categorias">${cardsPorCategoria}</div>
    </div>
  </section>

  <section id="como-funciona" class="suave">
    <div class="container">
      <div class="cabecalho-secao">
        <p class="rotulo">Como funciona</p>
        <h2>Três passos até o seu horário</h2>
      </div>
      <ol class="passos">
        ${passos
          .map(
            ([titulo, texto], i) => `
          <li>
            <span class="numero">0${i + 1}</span>
            <h3>${escapar(titulo)}</h3>
            <p>${escapar(texto)}</p>
          </li>`,
          )
          .join("")}
      </ol>
    </div>
  </section>

  <section id="agendar" class="escuro">
    <div class="container">
      <div class="cabecalho-secao">
        <p class="rotulo">Agende online</p>
        <h2>Escolha o serviço, o dia e o horário</h2>
        <p>São quatro passos. No final, o pedido sai pronto no WhatsApp e a confirmação vem na conversa.</p>
      </div>
      <ol class="etapas" id="etapas"></ol>
      <div class="agenda">
        <div id="etapa-conteudo"></div>
        <aside class="resumo" id="resumo"></aside>
      </div>
    </div>
  </section>

  <section id="sobre" class="claro">
    <div class="container sobre">
      <div class="moldura">
        <img src="${foto("geovana-sobre.jpg")}" alt="${escapar(business.profissional)} no espaço de beleza">
      </div>
      <div>
        <p class="rotulo">Quem atende você</p>
        <h2 style="font-size:clamp(2.25rem,5vw,3rem);line-height:1.1;margin-top:1rem">
          Prazer, sou a ${escapar(business.profissional.split(" ")[0])}
        </h2>
        <div class="sobre-texto">
          <p>
            Montei este espaço para atender do jeito que eu gosto de ser atendida: com hora
            marcada, tempo suficiente e sem correria.
          </p>
          <p>
            Cada serviço tem preço definido e um tempo reservado só para você. Você chega, senta
            e sai com o resultado que combinamos — seja uma sobrancelha alinhada, uma unha bem
            estruturada ou uma trança feita para durar.
          </p>
        </div>
        <a class="botao" style="margin-top:2rem" href="#agendar">Quero marcar meu horário</a>
      </div>
    </div>
  </section>

  <section class="suave">
    <div class="container duvidas-grid">
      <div class="cabecalho-secao">
        <p class="rotulo">Dúvidas</p>
        <h2>Antes de agendar</h2>
      </div>
      <div class="duvidas">
        ${duvidas
          .map(
            ([pergunta, resposta]) => `
          <details>
            <summary>${escapar(pergunta)}</summary>
            <p>${escapar(resposta)}</p>
          </details>`,
          )
          .join("")}
      </div>
    </div>
  </section>

  <section id="contato" class="claro">
    <div class="container contato-grid">
      <div>
        <p class="rotulo">Onde e quando</p>
        <h2 style="font-size:clamp(2.25rem,5vw,3rem);line-height:1.1;margin-top:1rem">Venha tomar um café</h2>
        <p class="endereco">
          ${escapar(business.endereco.linha1)}<br>
          ${escapar(business.endereco.linha2)}<br>
          <a href="${business.endereco.mapsUrl}" target="_blank" rel="noopener noreferrer">Abrir no mapa</a>
        </p>
        <div class="contato-ctas">
          <a class="botao" id="cta-whatsapp" href="#" target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
          <a class="botao contorno-escuro" href="${business.instagramUrl}" target="_blank" rel="noopener noreferrer">@${escapar(business.instagram)}</a>
        </div>
      </div>
      <div class="horarios">
        <h3>Horário de funcionamento</h3>
        <dl>
          ${horarioResumo
            .map(
              (linha) => `
            <div class="linha">
              <dt>${escapar(linha.dias)}</dt>
              <dd>${escapar(linha.horas)}</dd>
            </div>`,
            )
            .join("")}
        </dl>
        <p class="nota">Atendimento só com hora marcada, para ninguém esperar.</p>
      </div>
    </div>
  </section>
</main>

<footer>
  <div class="container">
    <div class="rodape">
      <div class="marca">
        <img src="${foto("logo.jpg")}" alt="">
        <span>
          <strong style="font-family:var(--display);font-size:1.5rem">${escapar(business.nome)}</strong>
          <span class="assinatura">${escapar(business.assinatura)}</span>
        </span>
      </div>
      <nav>
        <ul>
          <li><a href="#servicos">Serviços</a></li>
          <li><a href="#agendar">Agendar</a></li>
          <li><a href="#sobre">Sobre</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
      </nav>
    </div>
    <p class="creditos">© ${new Date().getFullYear()} ${escapar(business.nome)} — ${escapar(business.assinatura)}. Todos os direitos reservados.</p>
  </div>
</footer>

<a class="flutuante" id="flutuante" href="#" target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-4.1A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/>
  </svg>
</a>

<script>
const DADOS = ${JSON.stringify(dados)};
${regrasDeAgenda}

const ETAPAS = [
  { id: "servico", titulo: "Serviço" },
  { id: "data", titulo: "Dia" },
  { id: "horario", titulo: "Horário" },
  { id: "dados", titulo: "Seus dados" },
];

const estado = { etapa: "servico", servicoId: null, opcao: null, diaIso: null, hora: null, nome: "", observacao: "" };
const agora = new Date();

const servicoAtual = () => DADOS.servicos.find((s) => s.id === estado.servicoId) || null;
const diaAtual = () => {
  if (!estado.diaIso) return null;
  const [a, m, d] = estado.diaIso.split("-").map(Number);
  return new Date(a, m - 1, d);
};
const porExtenso = (d) => d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });

function etapaEfetiva() {
  if (!servicoAtual()) return "servico";
  if (!estado.diaIso && (estado.etapa === "horario" || estado.etapa === "dados")) return "data";
  if (!estado.hora && estado.etapa === "dados") return "horario";
  return estado.etapa;
}

function mensagem() {
  const s = servicoAtual();
  const linhas = [
    "Olá, " + DADOS.business.nome + "! Quero agendar um horário.",
    "",
    "*Serviço:* " + s.nome + (estado.opcao ? " (" + estado.opcao + ")" : ""),
    "*Valor:* " + s.precoLabel,
    "*Duração estimada:* " + s.duracaoLabel,
    "*Data:* " + porExtenso(diaAtual()),
    "*Horário:* " + estado.hora,
    "*Nome:* " + estado.nome.trim(),
  ];
  if (estado.observacao.trim()) linhas.push("*Observação:* " + estado.observacao.trim());
  linhas.push("", "Enviado pelo site.");
  return linhas.join("\\n");
}

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const linkWhats = (texto) => "https://wa.me/" + DADOS.business.whatsapp + "?text=" + encodeURIComponent(texto);

function irPara(etapa) {
  estado.etapa = etapa;
  desenhar();
}

function escolherServico(id) {
  const s = DADOS.servicos.find((x) => x.id === id);
  estado.servicoId = id;
  estado.opcao = (s && s.opcoes && s.opcoes[0]) || null;
  estado.diaIso = null;
  estado.hora = null;
  estado.etapa = "data";
  desenhar();
}

function desenharEtapas(atual) {
  const indice = ETAPAS.findIndex((e) => e.id === atual);
  document.getElementById("etapas").innerHTML = ETAPAS.map((e, i) => {
    const classe = i === indice ? "ativa" : i < indice ? "feita" : "";
    return '<li><button type="button" class="' + classe + '" data-etapa="' + e.id + '"' +
      (i > indice ? " disabled" : "") + '><span class="bolha">' + (i + 1) + "</span>" + e.titulo + "</button></li>";
  }).join("");
}

function desenharConteudo(atual) {
  const alvo = document.getElementById("etapa-conteudo");
  const indice = ETAPAS.findIndex((e) => e.id === atual);
  const voltar = indice > 0
    ? '<button type="button" class="voltar" data-etapa="' + ETAPAS[indice - 1].id + '">&larr; Voltar</button>'
    : "";

  if (atual === "servico") {
    const grupos = [...new Set(DADOS.servicos.map((s) => s.categoria))].map((cat) => {
      const nome = ${JSON.stringify(Object.fromEntries(categorias.map((c) => [c.id, c.nome])))}[cat];
      const itens = DADOS.servicos.filter((s) => s.categoria === cat).map((s) =>
        '<button type="button" class="opcao" data-escolher="' + s.id + '" aria-pressed="' + (s.id === estado.servicoId) + '">' +
          '<span><span class="nome">' + s.nome + '</span><span class="meta">' + s.duracaoLabel + " · " + s.precoLabel + "</span></span>" +
        "</button>"
      ).join("");
      return '<div class="grupo"><p class="grupo-titulo">' + nome + '</p><div class="opcoes-servico">' + itens + "</div></div>";
    }).join("");
    alvo.innerHTML = voltar + grupos;
    return;
  }

  const servico = servicoAtual();

  if (atual === "data") {
    const dias = diasDisponiveis(servico.duracaoMin, agora);
    if (dias.length === 0) {
      alvo.innerHTML = voltar + '<p style="color:rgba(251,245,239,.7)">Não encontramos dias livres para esse serviço. Fale direto no WhatsApp que a gente encaixa você.</p>';
      return;
    }
    const grupos = [];
    for (const dia of dias) {
      const rotulo = dia.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
      const ultimo = grupos[grupos.length - 1];
      if (ultimo && ultimo.rotulo === rotulo) ultimo.dias.push(dia);
      else grupos.push({ rotulo: rotulo, dias: [dia] });
    }
    alvo.innerHTML = voltar + grupos.map((g) =>
      '<div class="grupo"><p class="grupo-titulo">' + g.rotulo + '</p><div class="grade">' +
      g.dias.map((d) => {
        const iso = chaveDia(d);
        const semana = d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
        return '<button type="button" class="pilula" data-dia="' + iso + '" aria-pressed="' + (iso === estado.diaIso) + '">' +
          '<span class="semana">' + semana + '</span><span class="numero">' + d.getDate() + "</span></button>";
      }).join("") + "</div></div>"
    ).join("");
    return;
  }

  if (atual === "horario") {
    const todos = horariosDoDia(diaAtual(), servico.duracaoMin, agora);
    const blocos = [
      { rotulo: "Manhã", lista: todos.filter((h) => Number(h.slice(0, 2)) < 12) },
      { rotulo: "Tarde", lista: todos.filter((h) => Number(h.slice(0, 2)) >= 12) },
    ].filter((b) => b.lista.length > 0);
    alvo.innerHTML = voltar + (blocos.length === 0
      ? '<p style="color:rgba(251,245,239,.7)">Esse dia já está sem horário livre para o serviço escolhido.</p>'
      : blocos.map((b) =>
          '<div class="grupo"><p class="grupo-titulo">' + b.rotulo + '</p><div class="grade horas">' +
          b.lista.map((h) => '<button type="button" class="pilula" data-hora="' + h + '" aria-pressed="' + (h === estado.hora) + '">' + h + "</button>").join("") +
          "</div></div>"
        ).join(""));
    return;
  }

  const valido = estado.nome.trim().length >= 2;
  alvo.innerHTML = voltar +
    '<label class="campo"><span>Seu nome *</span><input id="campo-nome" autocomplete="name" placeholder="Como você quer ser chamada" value="' + esc(estado.nome) + '"></label>' +
    '<label class="campo"><span>Quer avisar algo? (opcional)</span><textarea id="campo-obs" rows="3" placeholder="Alergia, referência de foto, se é a primeira vez...">' + esc(estado.observacao) + "</textarea></label>" +
    (valido
      ? '<a class="botao" style="width:100%" href="' + linkWhats(mensagem()) + '" target="_blank" rel="noopener noreferrer">Enviar pedido no WhatsApp</a>'
      : '<button type="button" class="botao" style="width:100%" disabled>Enviar pedido no WhatsApp</button>') +
    '<p class="aviso">' + (valido
      ? "Abre o WhatsApp com tudo preenchido. Você confere e envia — a confirmação vem na conversa."
      : "Preencha seu nome para liberar o envio.") + "</p>";
}

function desenharResumo() {
  const servico = servicoAtual();
  const dia = diaAtual();
  const linhas = [
    ["Serviço", servico ? servico.nome : null, "servico"],
    ["Dia", dia ? porExtenso(dia) : null, "data"],
    ["Horário", estado.hora, "horario"],
  ];
  document.getElementById("resumo").innerHTML =
    '<div class="resumo-topo"><h3>Seu agendamento</h3>' +
    (servico ? '<button type="button" class="recomecar" data-recomecar>recomeçar</button>' : "") +
    "</div><dl>" +
    linhas.map(([rotulo, valor, etapa]) =>
      "<div><dt>" + rotulo + "</dt>" +
      (valor
        ? '<dd><button type="button" data-etapa="' + etapa + '">' + valor + "</button></dd>"
        : '<dd class="vazio">a escolher</dd>') +
      "</div>"
    ).join("") + "</dl>" +
    (servico && servico.opcoes
      ? '<div style="margin-top:1.25rem"><dt style="font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;color:rgba(251,245,239,.4)">Técnica</dt><div class="tecnicas">' +
        servico.opcoes.map((o) => '<button type="button" class="tecnica" data-tecnica="' + o + '" aria-pressed="' + (o === estado.opcao) + '">' + o + "</button>").join("") +
        "</div></div>"
      : "") +
    (servico
      ? '<div class="resumo-valor"><div><dt style="font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;color:rgba(251,245,239,.4)">Valor</dt><p class="valor">' +
        servico.precoLabel + '</p></div><p class="duracao">&asymp; ' + servico.duracaoLabel + "</p></div>"
      : "");
}

function desenhar() {
  const atual = etapaEfetiva();
  desenharEtapas(atual);
  desenharConteudo(atual);
  desenharResumo();
}

document.addEventListener("click", (evento) => {
  const alvo = evento.target.closest("[data-servico],[data-escolher],[data-dia],[data-hora],[data-etapa],[data-tecnica],[data-recomecar]");
  if (!alvo) return;

  if (alvo.dataset.servico) {
    escolherServico(alvo.dataset.servico);
    const suave = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    document.getElementById("agendar").scrollIntoView({ behavior: suave, block: "start" });
    return;
  }
  if (alvo.dataset.escolher) return escolherServico(alvo.dataset.escolher);
  if (alvo.dataset.dia) { estado.diaIso = alvo.dataset.dia; estado.hora = null; return irPara("horario"); }
  if (alvo.dataset.hora) { estado.hora = alvo.dataset.hora; return irPara("dados"); }
  if (alvo.dataset.tecnica) { estado.opcao = alvo.dataset.tecnica; return desenhar(); }
  if (alvo.hasAttribute("data-recomecar")) {
    Object.assign(estado, { etapa: "servico", servicoId: null, opcao: null, diaIso: null, hora: null, nome: "", observacao: "" });
    return desenhar();
  }
  if (alvo.dataset.etapa) return irPara(alvo.dataset.etapa);
});

/**
 * Mantém o link de envio em dia enquanto a pessoa digita. Só redesenha a etapa
 * quando o botão precisa virar link (ou o contrário) — redesenhar a cada tecla
 * tiraria o cursor do campo.
 */
function atualizarEnvio(idCampo) {
  const valido = estado.nome.trim().length >= 2;
  const link = document.querySelector("#etapa-conteudo a.botao");

  if (valido && link) {
    link.href = linkWhats(mensagem());
    return;
  }
  if (valido === Boolean(link)) return;

  desenharConteudo(etapaEfetiva());
  const campo = document.getElementById(idCampo);
  if (campo) {
    campo.focus();
    campo.setSelectionRange(campo.value.length, campo.value.length);
  }
}

document.addEventListener("input", (evento) => {
  if (evento.target.id === "campo-nome") {
    estado.nome = evento.target.value;
    atualizarEnvio("campo-nome");
  }
  if (evento.target.id === "campo-obs") {
    estado.observacao = evento.target.value;
    atualizarEnvio("campo-obs");
  }
});

const conversa = linkWhats("Olá, " + DADOS.business.nome + "! Vim pelo site.");
document.getElementById("cta-whatsapp").href = conversa;
document.getElementById("flutuante").href = conversa;

desenhar();
</script>
`;

mkdirSync(dirname(saida), { recursive: true });
writeFileSync(saida, html);
console.log(`Preview gerado em ${saida} (${(html.length / 1024).toFixed(0)} KB)`);
