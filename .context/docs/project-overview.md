<!-- agent-update:start:project-overview -->
# Project Overview

Gerenciador Pedro v3 é uma SPA 100% client-side que concentra rotinas pessoais, quadro de projetos e estudos com forte ênfase em uso offline. O código é escrito em JavaScript moderno (sem frameworks), empacotado pelo Vite e publicado em GitHub Pages (`https://<user>.github.io/<repo>/`) com suporte a PWA (service worker, manifest e ícones). Todo o roteamento depende de um `BASE_URL` dinâmico para funcionar em subpastas, motivo pelo qual o repositório agora expõe um utilitário central (`src/utils/base-path.js`) e um fallback dedicado em `public/404.html`.

## Quick Facts
- **Stack:** Vite + JavaScript ES Modules + CSS modularizado, sem backend dedicado.
- **Persistência:** IndexedDB (`firebase-cache.js`) sempre ativo; sincronização com Firebase Firestore é opcional e controlada pelas variáveis `VITE_FIREBASE_*`.
- **Deploy:** Automatizado via `.github/workflows/deploy.yml`, que roda `npm run build` com `BASE_URL=/<repo>/` e publica no Pages.
- **PWA:** `public/service-worker.js` resolve o escopo a partir de `self.registration.scope`, garantindo que o registro funcione mesmo em `/demandas/`.
- **Testes:** Playwright cobre navegação SPA, refresh em rotas profundas e registro do SW (forçando-o em dev via `window.__ENABLE_SW_IN_DEV__`).

## File Structure & Code Organization
- `src/` — views (`src/views/*.js`), componentes compartilhados, router (`src/router.js`), store global e serviços Firebase. Destaque para:
  - `src/utils/base-path.js`: centraliza leitura/escrita do `BASE_URL`, constrói URLs e restaura rotas após fallback 404.
  - `src/main.js`: registra o SW, ativa indicadores offline e integra o router.
- `public/` — arquivos copiados sem transformação (manifest, service worker, `404.html` para GitHub Pages).
- `.github/workflows/deploy.yml` — pipeline oficial de build + deploy.
- `.context/` — documentação operacional consumida pelos agentes (playbooks, planos, guias).
- `tests/e2e/` — specs Playwright orquestradas por `playwright.config.js`.
- Diretórios históricos (`sprint2/`, `sprint3/`, `SAVES/`) preservam migrações e scripts utilizados nas fases anteriores.

## Technology Stack Summary
- **Runtime local:** Node 18+, Vite dev server (`npm run dev`).
- **Build:** `npm run build` gera `dist/` respeitando `process.env.BASE_URL` (utilizado tanto pelo router quanto pelo SW).
- **Infra externa:** GitHub Actions para CI/CD e GitHub Pages para hosting; Firebase Firestore opcional para sincronização em tempo real.
- **Observabilidade:** Logs no console e toasts indicam status de sincronização/offline; não há backend para telemetria.

## Development Workflow Highlights
1. `npm install` e `npm run dev` para desenvolvimento.
2. Para reproduzir o cenário de GitHub Pages localmente: `BASE_URL=/demandas/ npm run build && npx serve dist`.
3. Arquivo `.env.local` deve conter todas as chaves `VITE_FIREBASE_*` quando a sincronização estiver habilitada.
4. Antes de abrir PR, rode `npm run build` para atualizar `dist/` e `npm run test:e2e` para validar navegação/refresh.

## Next Steps
- Gerar ícones reais (`public/icon-192.png`, `public/icon-512.png`) para evitar 404 no manifest.
- Expandir documentação de troubleshooting para GitHub Pages (limpeza de cache, `skipWaiting`, etc.).
- Consolidar scripts Playwright que cobrem cenários offline + Firebase, aproveitando o novo utilitário de base path.

<!-- agent-readonly:guidance -->
## AI Update Checklist
1. Review roadmap items or issues labelled “release” to confirm current goals.
2. Cross-check Quick Facts against `package.json` and environment docs.
3. Refresh the File Structure & Code Organization section to reflect new or retired modules; keep guidance actionable.
4. Link critical dashboards, specs, or runbooks used by the team.
5. Flag any details that require human confirmation (e.g., stakeholder ownership).

<!-- agent-readonly:sources -->
## Acceptable Sources
- Recent commits, release notes, or ADRs describing high-level changes.
- Product requirement documents linked from this repository.
- Confirmed statements from maintainers or product leads.

<!-- agent-update:end -->
