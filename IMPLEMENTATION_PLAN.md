# Plano: Arquitetura de Herança e Repositório Template (`prototype-boilerplate`)

Este plano define a criação do **`prototype-boilerplate`** e estabelece o **mecanismo oficial de herança contínua** para que o repositório de produto (`plano-de-pagamento`) e futuros protótipos recebam atualizações do **Design System** e do **Core** com um único comando.

---

## 1. Visão Geral da Arquitetura de Herança

```
┌────────────────────────────────────────────────────────┐
│             TEMPLATE CENTRAL                           │
│        (julioferracini-neon/prototype-boilerplate)     │
│                                                        │
│   ├── src/design-system/  <─── Novos Tokens e DS       │
│   ├── src/core/           <─── Viewport, Gestos, Rotas │
│   └── .github/workflows/  <─── Pipeline de Deploy      │
└──────────────────────────┬─────────────────────────────┘
                           │
             git fetch template / merge limpo
                           │
     ┌─────────────────────┴─────────────────────┐
     ▼                                           ▼
┌──────────────────────────┐       ┌──────────────────────────┐
│  PROTÓTIPO 1 (Empréstimo) │       │  PROTÓTIPO 2 (Novo)      │
│  (plano-de-pagamento)    │       │  (ex: onboarding-pix)    │
│                          │       │                          │
│  ├── src/design-system/ ◄┼─sync  │  ├── src/design-system/ ◄┼─sync
│  ├── src/core/          ◄┼─sync  │  ├── src/core/          ◄┼─sync
│  └── src/journeys/       │       │  └── src/journeys/       │
│      └── emprestimo-neon/│       │      └── onboarding/     │
└──────────────────────────┘       └──────────────────────────┘
```

### Por que a herança é segura e sem conflitos?
* **Fronteira Rígida**: O Design System e o Core habitam caminhos exclusivos (`src/design-system/` e `src/core/`).
* **Isolamento de Negócio**: As telas, fluxos e regras dos protótipos vivem dentro de `src/journeys/<nome-do-prototipo>/`.
* Como o código do protótipo **nunca altera arquivos do Core**, o Git realiza a atualização automaticamente sem gerar conflitos de código.

---

## 2. Como Funciona a Herança na Prática (DX Simplificada)

Para que qualquer designer ou engenheiro consiga atualizar o Design System sem precisar dominar comandos avançados de Git, deixaremos scripts automatizados pré-configurados no `package.json` de todos os protótipos:

### Comando 1: Atualizar Tudo (Design System + Core + CI/CD)
```bash
npm run sync:template
```
* **O que faz**:
  1. Verifica se não há mudanças soltas não commitadas no protótipo.
  2. Conecta ao repositório do template e baixa as novidades da branch `main`.
  3. Mescla as melhorias de `src/core/`, `src/design-system/` e `.github/`.
  4. Executa a checagem de tipos (`tsc`) para confirmar que tudo continua compilando.

### Comando 2: Atualizar Apenas o Design System (Cirúrgico)
```bash
npm run sync:ds
```
* **O que faz**: Puxa estritamente a pasta `src/design-system/` do template, mantendo todo o restante do protótipo intacto.

---

## 3. O que compõe o CORE do `prototype-boilerplate`

Para que qualquer pessoa possa testar uma hipótese dentro de um contexto verossímil de aplicativo bancário, o Core fornece a infraestrutura completa de navegação:

### A. Casca de Aplicativo (Shell & Framework)
* **Moldura Mobile (`MobileFrame`)**: Viewport nativo com dimensões de smartphone, safe area, notch e cantos arredondados.
* **Barra de Status (`StatusBar`)**: Simulação de relógio, sinal e bateria com temas claro e escuro.
* **Navegação Global**:
  * **TopNavBar**: Cabeçalho de navegação padronizado com botão voltar e ações contextuais.
  * **BottomNavBar**: Barra inferior com atalhos de navegação do app.

### B. Telas Fundamentais do App (Disponíveis para Reuso)
* **Home (`GlobalHomeScreen`)**: Tela inicial completa com saldo, atalhos rápidos de Pix/Pagamentos, extrato e carrossel de ofertas, simulando a entrada do usuário no aplicativo.
* **Menu de Produtos (`ProductsScreen`)**: Vitrine completa com categorias de produtos (Empréstimos, Seguros, FGTS, Cartões, etc.) para testes de descoberta e arquitetura de informação.
* **Tela de Placeholder (`SurfacePlaceholderScreen`)**: Tela de fallback elegante usada quando o usuário clica em funcionalidades fora do escopo do teste (evita "telas mortas" e mantém a imersão).

### C. Fluxo Baseline (Controle para Testes A/B)
* **Jornada Baseline Completa**: Mantém o fluxo atual de navegação de referência (Baseline Hub, Input de Valor, Simulação e Resumo) acessível via rota `/baseline/`.
* **Objetivo em Testes**: Permite que pesquisadores e designers rodem testes comparativos (Hipótese A vs. Hipótese Nova) no mesmo protótipo sem precisar reconstruir o fluxo de controle.

### D. Motor de Roteamento e Interações Nativas
* **Roteamento SPA com Deep-Links (`useUrlSyncedFlow`)**: Sincronização automática com a URL, permitindo enviar links diretos para telas específicas nos testes com usuários.
* **Micro-interações de Alta Fidelidade**:
  * `BottomSheet` com arrasto por gestos e feedback tátil (haptics).
  * `RouletteOdometer` e `AnimatedNumber` para valores que giram fluidamente ao mudar parâmetros.
* **Design System Adaptável**:
  * `tokens.css` via Tailwind v4 para alterar paleta de cores ou fontes sem mexer nos componentes.
  * Componente base `Button` com estados nativos de toque e foco.

### E. Infraestrutura de Publicação
* Deploy automático e instantâneo no GitHub Pages via GitHub Actions + Bun.
* Suporte nativo a subcaminhos de repositório e fallback SPA 404.

---

## 4. Estrutura de Arquivos no `prototype-boilerplate`

```
prototype-boilerplate/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml          # CI/CD oficial do GitHub Pages
├── public/
│   └── assets/                      # Ícones e assets estáticos
├── scripts/
│   ├── sync-template.sh             # Script do comando npm run sync:template
│   └── sync-ds.sh                   # Script do comando npm run sync:ds
├── src/
│   ├── App.tsx                      # Renderizador da viewport e rotas
│   ├── main.tsx
│   ├── index.css
│   ├── core/                        # NÚCLEO DO PROTÓTIPO
│   │   ├── shell/
│   │   │   ├── MobileFrame.tsx      # Moldura do celular
│   │   │   ├── StatusBar.tsx        # Barra de status
│   │   │   ├── TopNavBar.tsx        # Cabeçalho global
│   │   │   └── BottomNavBar.tsx     # Menu inferior
│   │   ├── screens/                 # Telas estruturais do app
│   │   │   ├── GlobalHomeScreen.tsx # Tela inicial completa
│   │   │   ├── ProductsScreen.tsx   # Vitrine de produtos
│   │   │   └── SurfacePlaceholderScreen.tsx # Fallback para itens fora do escopo
│   │   ├── baseline/                # Fluxo de controle para testes comparativos
│   │   │   ├── BaselineLoanHubScreen.tsx
│   │   │   ├── BaselineInputValueScreen.tsx
│   │   │   ├── BaselineLoanSimulationScreen.tsx
│   │   │   ├── BaselineSummaryScreen.tsx
│   │   │   └── BaselineSuccessScreen.tsx
│   │   ├── router/
│   │   │   ├── useUrlSyncedFlow.ts  # Motor de rota sincronizado com URL
│   │   │   └── types.ts
│   │   ├── components/              # Micro-interações táteis
│   │   │   ├── BottomSheet.tsx
│   │   │   ├── RouletteOdometer.tsx
│   │   │   ├── AnimatedNumber.tsx
│   │   │   └── PinBottomSheet.tsx
│   │   └── utils/
│   │       ├── haptics.ts
│   │       └── finance.ts
│   ├── design-system/               # CAMADA OFICIAL DE DESIGN SYSTEM
│   │   ├── tokens.css               # Cores, espaçamentos, tipografia
│   │   ├── index.ts                 # Ponto único de exportação
│   │   └── components/
│   │       └── Button.tsx
│   └── journeys/                    # Onde as hipóteses de teste residem
│       └── starter-example/         # Exemplo rápido para guiar o time
├── AGENTS.md                        # Diretrizes para assistentes de IA e devs
├── README.md                        # Guia Get Started amigável focado em testes
├── package.json
└── vite.config.ts
```

---

## 5. Etapas de Execução

### Fase 1: Criação do Repositório Template (`prototype-boilerplate`)
1. Criar a pasta isolada `~/Dev/prototype-boilerplate`.
2. Migrar os arquivos do Core, Design System, telas da Home/Produtos/Placeholder e o fluxo Baseline.
3. Criar os scripts `scripts/sync-template.sh` e `scripts/sync-ds.sh`.
4. Criar o repositório `julioferracini-neon/prototype-boilerplate` no GitHub com a descrição oficial:
   > *"Starter kit de alta fidelidade para prototipagem de produtos digitais, focado em testes de usabilidade com usuários reais e validação ágil de conceitos de produto."*
5. Ativar a tag oficial **Template repository** nas configurações do GitHub.
6. Configurar o deploy automático do template no GitHub Pages.

### Fase 2: Conectar o Repositório Atual (`plano-de-pagamento`) ao Template
1. No `plano-de-pagamento`, adicionar o remote `template`:
   `git remote add template https://github.com/julioferracini-neon/prototype-boilerplate.git`
2. Adicionar os scripts `sync:template` e `sync:ds` no `package.json` do `plano-de-pagamento`.
3. Validar a execução do sync para confirmar que a herança está operando de ponta a ponta sem qualquer quebra no simulador de empréstimo.
