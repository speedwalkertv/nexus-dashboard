# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Clientes da Geovana Santos em Quixeramobim–CE. Chegam pelo Instagram e pelo WhatsApp, quase sempre no celular. Querem ver serviço, preço e horário e marcar sozinhas, sem conversar antes. (Público inferido do pedido do dono; confirmar se há tráfego relevante do Google.)

## Product Purpose
Site de agendamento online do espaço de beleza. A cliente escolhe um ou mais serviços, o dia e o horário, e só ao finalizar o pedido o WhatsApp abre com tudo escrito. Sucesso: menos perguntas de preço e disponibilidade no WhatsApp, mais pedidos completos.

## Positioning
Preços, durações e horários livres ficam no próprio site. O WhatsApp é o ponto final do pedido, não o começo da conversa.

## Operating Context
Sem banco de dados no fluxo público: o site monta o pedido e a Geovana confirma pelo WhatsApp. Existe um painel `/admin` (login, agendamentos, resumo do dia) ligado ao Supabase. Dados do negócio em `lib/business.ts`, catálogo em `lib/services.ts`, regras de agenda em `lib/booking.ts`.

## Capabilities and Constraints
- Seleção múltipla de serviços por pedido, com técnica por item, soma de preço e duração.
- Agenda só oferece dias e horários em que o serviço cabe antes do fechamento (intervalos de 30 min, 1 h de antecedência no mesmo dia).
- **Regra do dono:** o site não deve mandar para o WhatsApp em nenhum outro ponto além da finalização do pedido (sem botão flutuante, sem "fale conosco", sem link de dúvida). Toda informação que a cliente costuma perguntar (preço, duração, o que inclui, endereço, horário, política) deve estar visível no site.
- **Fixos:** logo (monograma) e cores da marca (marrom escuro + laranja/dourado) não mudam. Textos e preços não são reescritos sem perguntar.
- Escopo combinado: refinar o que existe, não redesenhar.

## Brand Commitments
Nome "Geovana Santos — Espaço de Beleza". Logo em `public/logo-monograma.jpg`. Paleta: tinta `#17100D`, creme `#FBF5EF`, laranja/dourado `#FF8C1A`, terracota `#E8590C`, rosé `#C98A92`.

## Evidence on Hand
Foto de hero `public/geovana-hero.jpg`; fotos de serviços em `public/servicos/` quando existirem. Sem depoimentos nem avaliações reais fornecidos: não inventar.

## Product Principles
1. A resposta para "quanto custa / quanto tempo / tem horário" está sempre à vista.
2. O WhatsApp é a confirmação do pedido, nunca o atalho para perguntar.
3. Celular primeiro: polegar, tela pequena, conexão média.
4. Nada prometido que o salão não entrega: sem resultado garantido, sem prova social inventada.

## Accessibility & Inclusion
Contraste legível sobre fundo escuro, foco visível, alvos de toque confortáveis, texto em português claro para público amplo.
