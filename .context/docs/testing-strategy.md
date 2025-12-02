```markdown
<!-- agent-update:start:testing-strategy -->
# Testing Strategy

## Test Types
- **E2E (Playwright)**  suite oficial localizada em `tests/e2e/`. Cobre navegação SPA, quick add, persistência e (agora) refresh em rotas profundas/registro do SW.
- **Smoke manual**  após cada build destinado ao Pages, valide `/`, `/projetos`, `/estudos` e `/rotina` em um browser real para confirmar que o `BASE_URL` foi aplicado corretamente. Verifique também os logs do console para garantir que o SW registrou sem 404.
- (Não existem testes unitários/integration formais no momento; o foco está em E2E + smoke manual.)

## Running Tests
- Rodar todos os E2E: `npm run test:e2e`  o Playwright levanta `npm run dev` automaticamente.
- Navegador específico: `npx playwright test tests/e2e/navigation.spec.js --project=chromium`.
- UI mode: `npm run test:e2e:ui`.
- Para validar o Service Worker durante os testes, injete `window.__ENABLE_SW_IN_DEV__ = true` via `page.addInitScript` (ver exemplos em `tests/e2e/navigation.spec.js`).

## Quality Gates
- Build (`npm run build`) e Playwright devem passar localmente antes de abrir PR.
- Quando mexer em deploy, anexe logs/prints do workflow `Deploy to GitHub Pages` à descrição do PR.
- Se o SW ou o router sofrerem alterações, execute smoke manual acessando `BASE_URL=/demandas/` (build local) e confirme refresh direto em rotas (`/demandas/projetos`, etc.).

## Troubleshooting
- **Playwright não inicializa**  rode `npx playwright install` e verifique se a porta 3000 está livre.
- **Testes envolvendo SW travam**  confirme que `window.__ENABLE_SW_IN_DEV__` está sendo definido antes da navegação (`page.addInitScript`). Limpe registros anteriores com `await navigator.serviceWorker.getRegistrations()` nos testes.
- **Falhas somente em GitHub Pages**  confira se `BASE_URL` foi exportado corretamente (logs do workflow) e se `public/404.html` está presente no artefato publicado.
<!-- agent-update:end -->
```
