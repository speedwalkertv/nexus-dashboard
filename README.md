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

## Como o agendamento funciona

1. **Serviço** — lista completa com preço e duração
2. **Dia** — só aparecem dias abertos que ainda comportam o serviço
3. **Horário** — gerado a partir do expediente, em intervalos de 30 min,
   com 1 hora de antecedência mínima para o mesmo dia
4. **Dados** — nome e observação, e o botão que abre o WhatsApp com tudo escrito

Não há banco de dados: o site monta o pedido, e a confirmação continua sendo
feita por você na conversa. Se um dia a agenda precisar bloquear horários já
ocupados, é aqui (`lib/booking.ts`) que a integração entra.

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
