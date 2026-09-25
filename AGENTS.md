# AGENTS.md

## 1. Visão Geral
Boilerplate reutilizável para criação de protótipos navegáveis (SPAs client-side) de alta fidelidade e micro-interações nativas.
A implementação atual de "Hipóteses para Empréstimo (Neon)" é a primeira instância de teste e referência, não a identidade permanente do repositório.

## 2. Arquitetura: Núcleo vs. Jornada
- **Regra Central**: Código de jornada (telas, textos, regras simuladas e dados mockados) deve ficar isolado em `src/journeys/<nome-da-jornada>/`. O núcleo do boilerplate (shell de viewport, transições e engine de navegação) deve ser agnóstico a regras de negócio.
- **Débito Atual Prioritário**: O código da jornada Neon ainda reside misturado em `src/components/`, `src/router/` e `src/App.tsx`. Novos desenvolvimentos devem respeitar a segregação e extrair a jornada para `src/journeys/emprestimo-neon/`.
- **Zero Backend**: Aplicação 100% estática. Proibido adicionar backend, APIs ativas ou bancos de dados sem aprovação e ADR registrado.

## 3. Camada de Design System (Adapter)
- **Estrutura**: `src/design-system/tokens.css` (tokens via `@theme` Tailwind v4) e `src/design-system/components/` (wrappers finos).
- **Consumo Obrigatório**: Componentes de jornada devem consumir exclusivamente os wrappers de `src/design-system/` ou classes utilitárias semânticas.
- **Proibição de Hex Arbitrário**: Proibido adicionar estilos com valores hardcoded (ex: `text-[#142742]`, `bg-[#0073ea]`). Utilize tokens primitivos e semânticos (`--color-surface-primary`, `--color-text-primary`, `--color-action-default`).
- **Débito Atual**: Cores hexadecimais legadas em `src/components/` devem ser migradas progressivamente para o adapter.

## 4. Comandos de Desenvolvimento
- `npm run dev`: Inicia servidor local em `http://0.0.0.0:3000`.
- `npm run build`: Compila bundle estático em `dist/`.
- `npm run preview`: Executa preview local do build de `dist/`.
- `npm run lint`: Checagem estática de tipos (`tsc --noEmit`).

## 5. Infraestrutura & Deploy
- **Ambiente**: Qualquer storage/CDN estático com regra de fallback SPA (`/index.html` para 404).
- **Container (Nginx Alpine)**:
  ```nginx
  server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / {
      try_files $uri $uri/ /index.html;
    }
  }
  ```

## 6. Cache
- `/assets/*` (gerados com hash pelo Vite):
  `Cache-Control: public, max-age=31536000, immutable`
- `/index.html`:
  `Cache-Control: no-cache`

## 7. Reuso: Clonar para Nova Hipótese
1. Clonar este repositório para o novo projeto.
2. Substituir o conteúdo de `src/journeys/emprestimo-neon/` pela nova jornada, mantendo o contrato de etapas e navegação.
3. Não alterar o núcleo de navegação, transições ou o shell do viewport em `src/`.
4. Atualizar tokens em `src/design-system/tokens.css` caso o tema visual da nova jornada mude.

## 8. Decision Log (ADR)
- **[2026-09]** - Repositório convertido em boilerplate reutilizável: Permite clonar para testar novas hipóteses antes da consolidação em plataforma.
- **[2026-09]** - Isolamento da jornada Neon como primeira instância: Desacopla regras de empréstimo do núcleo reutilizável do shell.
- **[2026-09]** - Criação da camada adapter de Design System: Permite plugar tokens semânticos e novos componentes sem refatorar telas.
- **[2026-09]** - Remoção de express e dotenv: Limpeza de dependências herdadas de template não utilizadas.

## 9. O que NUNCA fazer
- Nunca misturar código, textos ou mocks específicos de uma jornada dentro do núcleo do boilerplate.
- Nunca adicionar classes de cores arbitrárias com valores hexadecimais (`#...`) fora do Design System.
- Nunca remover o fallback para `index.html` da configuração de hospedagem ou roteamento.
- Nunca instalar dependências de backend, servidor Node ou persistência em banco de dados.
- Nunca commitar chaves ou segredos no repositório.

