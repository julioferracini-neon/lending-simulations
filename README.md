# Protótipos Navegáveis (Boilerplate)

Boilerplate reutilizável para construção rápida de protótipos de alta fidelidade, micro-interações nativas e testes de hipóteses de produto em SPAs client-side.

Este repositório foi desenhado para ser clonado e adaptado para diferentes jornadas de negócio sem perder a fundação de design system, transições fluidas e viewport de aplicativo móvel.

---

## Instância de Referência: Empréstimo Neon

A implementação padrão deste repositório contém a jornada de **Hipóteses para Empréstimo**, servindo de exemplo prático de aplicação das diretrizes de arquitetura:

* **Comparativo de fluxos**: Proposta padrão (Baseline) versus Nova experiência (Personalização de parcelas e datas).
* **Micro-interações táteis**: Animações fluidas com Motion, feedback tátil (haptics) e odômetro numérico.
* **Simulador financeiro client-side**: Cálculos de juros, CET, amortização e seguros integrados em tempo real sem dependência de servidor.

---

## Principais Pilares

* **Arquitetura Desacoplada**: A lógica do shell (viewport, roteador, transições de tela) é 100% isolada da regra de negócio das telas (`src/journeys/`).
* **Design System Adapter**: Tokens semânticos centralizados em `src/design-system/tokens.css` (Tailwind CSS v4) e wrappers de componentes prontos para receber o Design System definitivo.
* **100% Estático (Zero Backend)**: Gera um bundle estático otimizado (~550 kB) pronto para publicação em CDN, GitHub Pages, Vercel ou contêiner Nginx Alpine.

---

## Estrutura do Projeto

```text
├── src/
│   ├── design-system/          # Camada adapter (tokens e componentes universais)
│   │   ├── tokens.css          # Tokens semânticos e primitivos (@theme Tailwind v4)
│   │   └── components/         # Wrappers reutilizáveis (ex: Button)
│   ├── journeys/               # Jornadas plugáveis de protótipo
│   │   ├── types.ts            # Contratos de navegação e telas
│   │   └── emprestimo-neon/    # Instância atual da jornada de empréstimo
│   │       ├── screens/        # Telas da jornada
│   │       ├── components/     # Modais e seletores específicos
│   │       └── utils/          # Mocks e regras de cálculo financeiro
│   ├── components/             # Componentes globais do shell (MobileShell, etc.)
│   ├── router/                 # Engine de navegação entre telas
│   ├── App.tsx                 # Ponto de entrada do shell da aplicação
│   └── main.tsx
├── AGENTS.md                   # Diretrizes técnicas para agentes de IA
└── vite.config.ts
```

---

## Começando

### Pré-requisitos
* Node.js 18+ instalado
* npm ou bun

### Instalação e Execução

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```
   Acesse no seu navegador: `http://localhost:3000`

3. Comandos disponíveis:
   * `npm run dev`: Servidor local com Hot Module Replacement (HMR).
   * `npm run build`: Compilação estática de produção na pasta `dist/`.
   * `npm run preview`: Visualização local da compilação de produção.
   * `npm run lint`: Verificação estática de tipagem com TypeScript (`tsc --noEmit`).

---

## Como Criar uma Nova Hipótese / Jornada

Para utilizar este boilerplate em um novo teste de conceito ou protótipo:

1. **Clonar este repositório** para a nova hipótese.
2. **Criar a nova pasta de jornada** em `src/journeys/<sua-jornada>/` implementando as telas necessárias.
3. **Atualizar os tokens visuais** em `src/design-system/tokens.css` caso o produto utilize outra identidade visual (cores primárias, superfícies, etc.).
4. **Conectar a nova jornada no roteador** mantendo o shell de navegação e as transições do viewport.

---

## Stack Tecnológica

* **Framework**: React 19 + TypeScript
* **Build Tool**: Vite 8
* **Estilização**: Tailwind CSS v4 com tokens semânticos
* **Animações e Gestos**: Motion (Framer Motion)
* **Ícones**: Lucide React

