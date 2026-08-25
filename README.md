# Geovana Santos — Espaço de Beleza

Site de agendamento online do espaço. A pessoa escolhe o serviço, o dia e o
horário, e o pedido chega pronto no WhatsApp.

## Antes de publicar: edite `lib/business.ts`

Os dados abaixo estão com valores de exemplo e **precisam ser trocados**:

| Campo | O que é |
|---|---|
| `whatsapp` | Número que recebe os agendamentos, só dígitos: `55` + DDD + número |
| `whatsappExibicao` | O mesmo número formatado para leitura |
| `instagram` / `instagramUrl` | Perfil do espaço |
| `endereco` | Rua, cidade e link do Google Maps |
| `expediente` | Horário de abertura e fechamento de cada dia (`null` = fechado) |

Ao mudar o `expediente`, atualize também `horarioResumo` no mesmo arquivo — é
ele que aparece na seção de contato.

## Serviços e preços

Tudo vive em `lib/services.ts`. Cada serviço tem:

- `preco` — em reais, ou `null` para "Sob consulta"
- `aPartirDe` — mostra "a partir de R$ X"
- `duracaoMin` — **estimativa** de quanto tempo o horário fica reservado.
  A agenda usa esse número para só oferecer horários em que o serviço cabe
  inteiro antes do fechamento, então vale ajustar conforme a sua rotina real.
- `opcoes` — variações da mesma técnica (aparecem como etiquetas)
- `inclui` — o que está incluso no serviço

Mexer nesse arquivo já atualiza a vitrine de preços, o passo 1 do agendamento e
os dados estruturados que o Google lê.

## Fotos dos serviços

Cada card mostra uma imagem. Enquanto um serviço não tem foto, aparece a arte
de marca da categoria (traço dourado sobre fundo quente) — decoração assumida,
nunca uma promessa de resultado.

Para colocar a foto real:

1. Salve o arquivo em `public/servicos/` (ex.: `public/servicos/cilios.jpg`)
2. Em `lib/services.ts`, adicione a linha no serviço:

```ts
imagem: "/servicos/cilios.jpg",
```

O card é cortado em 16:9, então a melhor foto é horizontal, com o trabalho no
centro. Algo em torno de 1200x675 px já basta — arquivos muito grandes só
deixam o site lento.

## Como o agendamento funciona

1. **Serviço** — lista completa com preço e duração
2. **Dia** — só aparecem dias abertos que ainda comportam o serviço
3. **Horário** — gerado a partir do expediente, em intervalos de 30 min,
   com 1 hora de antecedência mínima para o mesmo dia
4. **Dados** — nome e observação, e o botão que abre o WhatsApp com tudo escrito

Não há banco de dados: o site monta o pedido, e a confirmação continua sendo
feita por você na conversa. Se um dia a agenda precisar bloquear horários já
ocupados, é aqui (`lib/booking.ts`) que a integração entra.

## Link de visualização (sem servidor)

```bash
node --experimental-strip-types scripts/preview.mjs
```

Gera `preview/index.html`: o site inteiro num arquivo só, com as fotos
embutidas, para mandar por WhatsApp ou publicar como página avulsa. Os dados
saem de `lib/business.ts` e `lib/services.ts`, os mesmos do site — mudou preço
lá, é só gerar de novo. A regra de horários é reescrita em JS de navegador
dentro do script: se mexer em `lib/booking.ts`, ajuste `regrasDeAgenda` junto.

## Rodando

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm run typecheck
```

## Stack

Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion (transições do
agendamento) e `next/font` para as fontes Cormorant Garamond e Jost.

## Estrutura

```
app/            layout, estilos e a página única
components/
  booking/      fluxo de agendamento (contexto + 4 etapas + resumo)
  sections/     hero, serviços, como funciona, sobre, dúvidas, contato
  ui/           botão e animação de entrada
lib/            dados do negócio, catálogo de serviços e regras da agenda
public/         logo e fotos
```
