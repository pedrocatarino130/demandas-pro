<!-- agent-update:start:tooling -->
# Tooling & Productivity Guide

## Required Tooling
- **Node.js 18+ e npm**  instalar via nodejs.org ou nvm. Necessário para `npm run dev/build/test`.
- **Git**  fluxo `git switch -c feature/...`  PR  merge em `main`.
- **Playwright**  já listado em `devDependencies`; use `npx playwright install` caso o runner peça browsers adicionais.
- **Editor**  VS Code com ESLint, Prettier e suporte a arquivos `.env` é suficiente.

## Automation & Scripts
- `npm run dev`  inicia o Vite com HMR em `http://localhost:3000`.
- `npm run build`  gera `dist/`. Use `BASE_URL=/<repo>/` para simular GitHub Pages. Para testes rápidos de PWA local, `npx serve dist`.
- `npm run test:e2e`  executa a suíte Playwright. O `playwright.config.js` já inicia `npm run dev`; para validar o SW em dev, injete `window.__ENABLE_SW_IN_DEV__` via `page.addInitScript`.
- `npm run lint` / `npm run format` (quando adicionados) devem ser executados antes de abrir PRs para evitar ruído.

## Useful Aliases / Tips
- Adicione `alias nb='BASE_URL=/demandas/ npm run build'` para simular builds de Pages.
- Use `npx playwright test --project=chromium --headed` para depurar cenários específicos sem rodar todos os navegadores.
- O workflow de deploy aceita `workflow_dispatch`. Execute via aba Actions quando precisar validar `deploy.yml` sem merge.

## Environment Variables
- `.env.local` (gitignored) deve conter os valores `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID` e `VITE_FIREBASE_APP_ID`.
- No GitHub, crie Secrets com o mesmo nome para abastecer `.github/workflows/deploy.yml`.
- Para forçar o SW em dev (testes), injete `window.__ENABLE_SW_IN_DEV__ = true` antes do boot do app.
<!-- agent-update:end -->
