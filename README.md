<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=20,6,12&height=200&section=header&text=Nexus%20Dashboard&fontSize=60&fontAlignY=40&desc=Real-time%20analytics%20dashboard%20with%20Apple-grade%20motion&descAlignY=70&fontColor=ffffff&animation=fadeIn" width="100%"/>
</div>

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-FF0090?style=for-the-badge)

</div>

## ✨ O que é

Dashboard de analytics em tempo real com **glassmorphism**, **micro-interações Apple-like** e WebSockets pra updates ao vivo. Pensado pra ser o tipo de UI que o stakeholder pede pra demonstrar pro CEO.

## 🎯 Highlights

- **Real-time** — WebSockets via Server-Sent Events
- **Motion** — entradas escalonadas, hover springs, parallax
- **Theming** — dark/light com `next-themes` + transições suaves
- **Acessível** — WCAG AA, navegação por teclado completa
- **100/100 Lighthouse** — performance budget rígido

## 🚀 Quick start

```bash
git clone https://github.com/gaab-dev/nexus-dashboard
cd nexus-dashboard
pnpm install
pnpm dev
```

Abre em `http://localhost:3000`.

## 🏗️ Stack

| Camada      | Escolha                                  |
|-------------|------------------------------------------|
| Framework   | Next.js 15 (App Router, Server Actions)  |
| Styling     | Tailwind CSS + tailwind-merge + clsx     |
| Motion      | Framer Motion (springs físicos)          |
| Charts      | Recharts + custom D3 layers              |
| State       | Zustand (server-state via TanStack Query)|
| Realtime    | Server-Sent Events                       |
| Type-safety | TypeScript strict + Zod                  |

## 📐 Princípios de design

1. **Contraste antes da decoração** — leitura ≥ 4.5:1 sempre
2. **Motion serve a função** — animação revela hierarquia, nunca enfeita
3. **Density progressiva** — info crítica grande, detalhes a um clique
4. **Estados explícitos** — loading, empty, error, success — todos desenhados

## 📄 Licença

MIT © Felipe Gabriel ([@gaab-dev](https://github.com/gaab-dev))
