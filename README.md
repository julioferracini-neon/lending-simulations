# Simulações de Empréstimo: Hipóteses de Plano de Pagamento

Protótipo navegável de alta fidelidade desenvolvido para testes com usuários e validação de hipóteses de produto na jornada de **Empréstimo Pessoal (Neon)**.

Este projeto foi construído sobre a fundação do [**`prototype-boilerplate`**](https://github.com/julioferracini-neon/prototype-boilerplate) e utiliza herança contínua para manter seu Design System e componentes de infraestrutura sempre atualizados.

---

## 1. Contexto de Produto

### O Problema
Na contratação de crédito pessoal, a escolha do plano de pagamento costuma ser uma das etapas de maior fricção e abandono. O cliente frequentemente se depara com opções pré-fixadas e tabelas rígidas, sentindo pouca flexibilidade para adaptar o compromisso financeiro ao seu fluxo de caixa mensal real (data de recebimento do salário e limite de gasto seguro).

### As Hipóteses em Validação

* **Hipótese A: Plano de Pagamento Dinâmico (`DO-01`)**
  * **Conceito**: Dar ao cliente autonomia total para ajustar diretamente o valor da parcela mensal desejada, selecionar a melhor data para o primeiro vencimento e visualizar a amortização e juros em tempo real.
  * **Mecanismos**: Sliders táteis, odômetro numérico com contagem de valores, seletores modais com feedback háptico e cálculo pró-rata die instantâneo.
  * **Objetivo de Negócio**: Aumentar a taxa de conversão final da proposta e reduzir o atraso nas primeiras parcelas por meio de um vencimento mais conveniente.

* **Hipótese B: Fluxo Baseline de Controle (`Baseline`)**
  * **Conceito**: Fluxo convencional de seleção com simulação padrão de mercado.
  * **Objetivo**: Servir de grupo de controle estrito durante sessões de testes de usabilidade e testes A/B comparativos com usuários reais.

---

## 2. Rotas e Deep-Links para Testes com Usuários

O protótipo conta com roteamento sincronizado em tempo real na URL. É possível iniciar o teste diretamente em qualquer etapa ou fluxo:

| Fluxo / Hipótese | Rota Direta | Descrição |
| :--- | :--- | :--- |
| **Portal de Seleção** | `/` ou `#/portal` | Hub inicial para selecionar qual hipótese avaliar |
| **Hipótese DO-01** | `#/do-01/hub` | Ponto de entrada da nova experiência de plano de pagamento |
| **DO-01: Simulação** | `#/do-01/simulation` | Tela principal com slider dinâmico e odômetro |
| **DO-01: Resumo** | `#/do-01/summary` | Revisão de condições, CET, seguro e confirmação por PIN |
| **Fluxo Baseline** | `#/baseline/hub` | Experiência de controle tradicional |
| **Home do App** | `#/home` | Contexto de navegação global com atalhos e vitrine |
| **Produtos** | `#/produtos` | Catálogo de produtos com acesso ao empréstimo |

---

## 3. Conexão com o Boilerplate (Herança Contínua)

Este protótipo herda o Core de navegação e o Design System do repositório template [**`prototype-boilerplate`**](https://github.com/julioferracini-neon/prototype-boilerplate).

### Como Puxar Atualizações do Template

Caso o repositório template receba novos componentes, tokens de cores ou melhorias na engine de viewport, execute no terminal deste projeto:

```bash
# 1. Puxar apenas novidades do Design System (tokens.css e componentes de UI)
npm run sync:ds

# 2. Puxar melhorias completas de infraestrutura (Design System + Core do Shell)
npm run sync:template
```

Esses comandos realizam uma sincronização cirúrgica: atualizam apenas as pastas `src/design-system/` e `src/core/`, mantendo 100% intactas as telas, textos, regras e dados da jornada de empréstimo (`src/journeys/emprestimo-neon/`).

---

## 4. Stack Tecnológica

* **Framework**: React 19 + TypeScript
* **Build Tool**: Vite 8
* **Estilização**: Tailwind CSS v4 com tokens semânticos (`@theme`)
* **Animações e Gestos**: Motion (Framer Motion) com curvas táteis nativas
* **Cálculo Financeiro**: Motor estático client-side (juros compostos, pró-rata die, amortização)
* **Zero Backend**: Aplicação 100% estática, pronta para deploy no GitHub Pages

---

## 5. Como Executar Localmente

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor local de desenvolvimento:
   ```bash
   npm run dev
   ```
   Acesse no navegador: `http://localhost:3000`

3. Comandos de validação:
   * `npm run lint`: Checagem estática de tipagem (`tsc --noEmit`).
   * `npm run build`: Compilação de produção e geração do fallback SPA (`dist/404.html`).
   * `npm run preview`: Visualização local do build compilado.
